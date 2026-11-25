<?php
/**
 * API del Formulario de Asistencia — Taller Práctico Aula ATECA (26 Noviembre)
 * Ruta pública: https://fpapps.es/formulario-asistencia/api.php
 * Privacidad: El endpoint público GET solo devuelve estadísticas agregadas (asistencia,
 * departamentos, ciclos y módulos), nunca nombres personales ni enlace a Google Sheets.
 * La exportación CSV para la hoja de Google Sheets requiere clave privada (?format=csv&key=ateca2026_sync).
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

date_default_timezone_set('Atlantic/Canary');

$dataFile = __DIR__ . '/responses-data.json';
$gasFile  = __DIR__ . '/.gas_webapp_url';
$sheetId  = '1-cOkFqZnIUxqqPR-RKH_6TMJ7gX7JV4Jbh_H3xwAp18';
$syncKey  = 'ateca2026_sync';

function loadResponses(string $file): array {
    if (!file_exists($file)) {
        return [];
    }
    $raw = @file_get_contents($file);
    $parsed = json_decode((string)$raw, true);
    return is_array($parsed) ? $parsed : [];
}

function saveResponses(string $file, array $rows): bool {
    $json = json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return @file_put_contents($file, $json, LOCK_EX) !== false;
}

$responses = loadResponses($dataFile);

function extractDepartmentAndCycle(array $r): array {
    $dept = trim((string)($r['departamento'] ?? ''));
    $deptOtro = trim((string)($r['departamento_otro'] ?? ''));
    $ciclo = trim((string)($r['ciclo'] ?? ''));
    $deptCiclo = trim((string)($r['departamento_ciclo'] ?? ''));

    if ($dept === '' && $deptCiclo !== '') {
        if (strpos($deptCiclo, ' · ') !== false) {
            [$pDept, $pCiclo] = explode(' · ', $deptCiclo, 2);
            $dept = trim($pDept);
            if ($ciclo === '') {
                $ciclo = trim($pCiclo);
            }
        } else {
            $dept = $deptCiclo;
        }
    }

    if ($dept === 'Otros' && $deptOtro !== '') {
        $dept = 'Otros: ' . $deptOtro;
    }

    return [
        'departamento'      => $dept,
        'departamento_otro' => $deptOtro,
        'ciclo'             => $ciclo,
    ];
}

// Exportación CSV privada exclusiva para la sincronización con tu hoja de Google Sheets
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['format']) && strtolower((string)$_GET['format']) === 'csv') {
    $givenKey = isset($_GET['key']) ? trim((string)$_GET['key']) : '';
    if (!hash_equals($syncKey, $givenKey)) {
        http_response_code(403);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Acceso restringido a coordinación.';
        exit;
    }

    $filename = 'Asistencia_Taller_IA_Aula_ATECA_26_Noviembre.csv';
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, [
        'Marca temporal',
        'Nombre y apellidos',
        '¿Confirmas tu asistencia al taller del jueves 26 de noviembre (15:30 - 16:45)?',
        'Departamento / Especialidad',
        'Departamento personalizado (Otros)',
        'Ciclo formativo',
        'Módulo y tipo de material docente previsto',
        'Observaciones, dudas o propuestas para la sesión'
    ]);
    foreach ($responses as $r) {
        $parts = extractDepartmentAndCycle($r);
        fputcsv($out, [
            $r['timestamp'] ?? '',
            $r['nombre'] ?? '',
            $r['asistencia'] ?? '',
            $parts['departamento'],
            $parts['departamento_otro'],
            $parts['ciclo'],
            $r['modulo_material'] ?? '',
            $r['observaciones'] ?? ''
        ]);
    }
    fclose($out);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// GET público: devuelve ÚNICAMENTE estadísticas anónimas agregadas (sin nombres ni enlaces privados)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $attending = 0;
    $notAttending = 0;
    $byDepartment = [];
    $byCycle = [];
    $byModule = [];
    $byMaterial = [];

    foreach ($responses as $r) {
        $isYes = ($r['asistencia'] ?? '') === 'Sí, asistiré';
        if ($isYes) {
            $attending++;
        } elseif (($r['asistencia'] ?? '') === 'No podré asistir') {
            $notAttending++;
        }

        if ($isYes) {
            $parts = extractDepartmentAndCycle($r);
            $dept = $parts['departamento'];
            $ciclo = $parts['ciclo'];
            $cicloShort = (stripos($ciclo, 'Otros (') === 0) ? 'Otros (sin ciclo)' : $ciclo;

            if ($dept !== '' && $cicloShort !== '') {
                $label = $dept . ' · ' . $cicloShort;
            } elseif ($dept !== '') {
                $label = $dept;
            } else {
                $label = '';
            }

            if ($label !== '') {
                $byDepartment[$label] = ($byDepartment[$label] ?? 0) + 1;
            }

            if ($cicloShort !== '') {
                $byCycle[$cicloShort] = ($byCycle[$cicloShort] ?? 0) + 1;
            }

            $mod = trim((string)($r['modulo_base'] ?? $r['modulo_material'] ?? ''));
            if ($mod !== '') {
                $byModule[$mod] = ($byModule[$mod] ?? 0) + 1;
            }

            $mat = trim((string)($r['tipo_material'] ?? ''));
            if ($mat !== '') {
                $byMaterial[$mat] = ($byMaterial[$mat] ?? 0) + 1;
            }
        }
    }

    arsort($byDepartment);
    arsort($byCycle);
    arsort($byModule);
    arsort($byMaterial);

    echo json_encode([
        'ok'    => true,
        'stats' => [
            'total'        => count($responses),
            'attending'    => $attending,
            'notAttending' => $notAttending,
            'byDepartment' => $byDepartment,
            'byCycle'      => $byCycle,
            'byModule'     => $byModule,
            'byMaterial'   => $byMaterial
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// POST: registrar nueva respuesta
$rawInput = (string)file_get_contents('php://input');
$input = json_decode($rawInput, true);
if (!is_array($input)) {
    $input = $_POST;
}

$nombre           = isset($input['nombre']) ? trim((string)$input['nombre']) : '';
$asistencia       = isset($input['asistencia']) ? trim((string)$input['asistencia']) : '';
$departamento     = isset($input['departamento']) ? trim((string)$input['departamento']) : '';
$departamentoOtro = isset($input['departamento_otro']) ? trim((string)$input['departamento_otro']) : '';
$ciclo            = isset($input['ciclo']) ? trim((string)$input['ciclo']) : '';
$deptCiclo        = isset($input['departamento_ciclo']) ? trim((string)$input['departamento_ciclo']) : '';
$modulo           = isset($input['modulo_material']) ? trim((string)$input['modulo_material']) : '';
$tipoMaterial     = isset($input['tipo_material']) ? trim((string)$input['tipo_material']) : '';
$observaciones    = isset($input['observaciones']) ? trim((string)$input['observaciones']) : '';

if ($nombre === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'El campo "Nombre y apellidos" es obligatorio.']);
    exit;
}

if (!in_array($asistencia, ['Sí, asistiré', 'No podré asistir'], true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Debes seleccionar si confirmas tu asistencia al taller.']);
    exit;
}

if ($asistencia === 'Sí, asistiré') {
    if ($departamento === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Por favor, selecciona tu Departamento / Especialidad.']);
        exit;
    }
    if ($departamento === 'Otros' && $departamentoOtro === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Por favor, especifica tu departamento o especialidad en el campo "Otros".']);
        exit;
    }
    if ($ciclo === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Por favor, selecciona tu Ciclo formativo (o elige "Otros").']);
        exit;
    }
}

$isOtherDept = ($asistencia === 'Sí, asistiré' && $departamento === 'Otros');
$departamentoFinal = $asistencia === 'Sí, asistiré'
    ? ($isOtherDept ? ('Otros: ' . $departamentoOtro) : $departamento)
    : '';
$departamentoOtroFinal = $isOtherDept ? $departamentoOtro : '';
$cicloFinal = $asistencia === 'Sí, asistiré' ? $ciclo : '';

if ($deptCiclo === '' && ($departamentoFinal !== '' || $cicloFinal !== '')) {
    $deptCiclo = trim($departamentoFinal . ($departamentoFinal !== '' && $cicloFinal !== '' ? ' · ' : '') . $cicloFinal);
}

$moduloCombined = $modulo;
if ($tipoMaterial !== '' && $modulo !== '') {
    $moduloCombined = $modulo . ' [' . $tipoMaterial . ']';
} elseif ($tipoMaterial !== '') {
    $moduloCombined = $tipoMaterial;
}

$timestamp = date('d/m/Y H:i:s');
$id = 'resp-' . substr(md5(uniqid('', true)), 0, 10);

$entry = [
    'id'                  => $id,
    'timestamp'           => $timestamp,
    'isoTimestamp'        => date('c'),
    'nombre'              => $nombre,
    'asistencia'          => $asistencia,
    'departamento'        => $departamentoFinal,
    'departamento_opcion' => $asistencia === 'Sí, asistiré' ? $departamento : '',
    'departamento_otro'   => $departamentoOtroFinal,
    'ciclo'               => $cicloFinal,
    'departamento_ciclo'  => $deptCiclo,
    'modulo_base'         => $modulo,
    'modulo_material'     => $moduloCombined,
    'tipo_material'       => $tipoMaterial,
    'observaciones'       => $observaciones
];

$updated = false;
foreach ($responses as $idx => $existing) {
    if (isset($existing['nombre']) && mb_strtolower(trim($existing['nombre'])) === mb_strtolower($nombre)) {
        $entry['id'] = $existing['id'] ?? $id;
        $responses[$idx] = $entry;
        $updated = true;
        break;
    }
}
if (!$updated) {
    array_unshift($responses, $entry);
}

if (!saveResponses($dataFile, $responses)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo guardar la respuesta en el servidor.']);
    exit;
}

// Reenviar automáticamente a Google Sheets si hay conector GAS configurado
if (file_exists($gasFile)) {
    $gasUrl = trim((string)@file_get_contents($gasFile));
    if ($gasUrl !== '') {
        $ctx = stream_context_create([
            'http' => [
                'method'  => 'POST',
                'timeout' => 8,
                'header'  => "Content-Type: application/json\r\n",
                'content' => json_encode([
                    'sheetId' => $sheetId,
                    'action'  => $updated ? 'update' : 'append',
                    'row'     => [
                        $entry['timestamp'],
                        $entry['nombre'],
                        $entry['asistencia'],
                        $entry['departamento'],
                        $entry['departamento_otro'],
                        $entry['ciclo'],
                        $entry['modulo_material'],
                        $entry['observaciones']
                    ],
                    'entry'   => $entry
                ], JSON_UNESCAPED_UNICODE)
            ]
        ]);
        @file_get_contents($gasUrl, false, $ctx);
    }
}

echo json_encode([
    'ok'                  => true,
    'action'              => $updated ? 'updated' : 'created',
    'entry'               => [
        'timestamp'          => $entry['timestamp'],
        'nombre'             => $entry['nombre'],
        'asistencia'         => $entry['asistencia'],
        'departamento'       => $entry['departamento'],
        'departamento_otro'  => $entry['departamento_otro'],
        'ciclo'              => $entry['ciclo'],
        'departamento_ciclo' => $entry['departamento_ciclo'],
        'modulo_material'    => $entry['modulo_material'],
        'observaciones'      => $entry['observaciones']
    ],
    'confirmationMessage' => $asistencia === 'Sí, asistiré'
        ? '¡Gracias por confirmar! Recuerda traer tu portátil con wifi y al menos un material docente de tu módulo o materia (PDF, Word, hoja de cálculo, presentación, vídeo o audio). Nos vemos el jueves 26 de noviembre a las 15:30 h en el Aula ATECA.'
        : '¡Gracias por avisar! Hemos registrado que no podrás asistir a esta sesión. Te mantendremos informado/a de próximas convocatorias en el Aula ATECA.'
], JSON_UNESCAPED_UNICODE);

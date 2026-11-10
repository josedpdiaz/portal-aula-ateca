<?php
/**
 * API ligera de Comunidad del Portal Aula ATECA (IES Agustín de Betancourt)
 * -------------------------------------------------------------------------
 * Permite al profesorado autorizado:
 *  - Crear o editar Actividades / Casos de uso (type = 'cases')
 *  - Crear o editar Experiencias reales de aula (type = 'experiences')
 *  - Añadir o editar Consejos / Vídeos en las Guías rápidas (type = 'tips')
 *
 * Almacenamiento dual:
 *  1) Archivo JSON local en el servidor (community-data.json) para lectura/edición inmediata.
 *  2) Reenvío opcional en tiempo real a Google Sheets (si se configura GOOGLE_APPS_SCRIPT_URL).
 *
 * Autorización:
 *  - Se valida correo corporativo (@gobiernodecanarias.org o @iesagustindebetancourt.org)
 *    y código de acceso docente del departamento (por defecto 'ATECA2026', o el contenido
 *    del archivo .teacher_pin si existe en el servidor).
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataFile = __DIR__ . '/community-data.json';
$pinFile  = __DIR__ . '/.teacher_pin';
$gasFile  = __DIR__ . '/.gas_webapp_url';

function loadStore(string $file): array {
    if (!file_exists($file)) {
        return ['cases' => [], 'guides' => [], 'experiences' => [], 'tips' => []];
    }
    $raw = @file_get_contents($file);
    $parsed = json_decode((string)$raw, true);
    if (!is_array($parsed)) {
        return ['cases' => [], 'guides' => [], 'experiences' => [], 'tips' => []];
    }
    return [
        'cases'       => isset($parsed['cases']) && is_array($parsed['cases']) ? $parsed['cases'] : [],
        'guides'      => isset($parsed['guides']) && is_array($parsed['guides']) ? $parsed['guides'] : [],
        'experiences' => isset($parsed['experiences']) && is_array($parsed['experiences']) ? $parsed['experiences'] : [],
        'tips'        => isset($parsed['tips']) && is_array($parsed['tips']) ? $parsed['tips'] : [],
    ];
}

function saveStore(string $file, array $store): bool {
    $json = json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return @file_put_contents($file, $json, LOCK_EX) !== false;
}

$store = loadStore($dataFile);

// GET: devolver todos los elementos publicados con el registro del docente (correo, nombre y departamento)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['ok' => true, 'data' => $store], JSON_UNESCAPED_UNICODE);
    exit;
}

// POST: crear o editar un elemento por parte de un docente autorizado
$input = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Formato JSON no válido']);
    exit;
}

$type       = isset($input['type']) ? trim((string)$input['type']) : '';
$email      = isset($input['email']) ? strtolower(trim((string)$input['email'])) : '';
$pin        = isset($input['pin']) ? trim((string)$input['pin']) : '';
$author     = isset($input['author']) ? trim((string)$input['author']) : '';
$department = isset($input['department']) ? trim((string)$input['department']) : '';
$item       = isset($input['item']) && is_array($input['item']) ? $input['item'] : [];

if (!in_array($type, ['cases', 'guides', 'experiences', 'tips'], true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Tipo de contenido no válido']);
    exit;
}

// Validar correo docente autorizado
$validDomain = (
    str_ends_with($email, '@gobiernodecanarias.org') ||
    str_ends_with($email, '@canariaseducacion.es') ||
    str_ends_with($email, '@iesagustindebetancourt.org') ||
    $email === 'josedpdiaz@gmail.com'
);
if (!$validDomain || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(403);
    echo json_encode([
        'ok' => false,
        'error' => 'Autenticación requerida: introduce un correo docente válido (@gobiernodecanarias.org o @canariaseducacion.es).'
    ]);
    exit;
}

// Validar código de acceso docente
$expectedPin = file_exists($pinFile) ? trim((string)file_get_contents($pinFile)) : 'ATECA2026';
if ($expectedPin !== '' && !hash_equals(strtoupper($expectedPin), strtoupper($pin))) {
    http_response_code(403);
    echo json_encode([
        'ok' => false,
        'error' => 'Clave docente incorrecta. Solicítala a la coordinación del Aula ATECA.'
    ]);
    exit;
}

$now = gmdate('Y-m-d H:i:s');
$id  = isset($item['id']) && trim((string)$item['id']) !== ''
    ? preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$item['id'])
    : ($type . '-' . substr(md5(uniqid('', true)), 0, 10));

$emailUser = explode('@', $email)[0] ?? 'Docente';
$finalAuthor = $author !== '' ? $author : (isset($item['author']) && trim((string)$item['author']) !== '' ? trim((string)$item['author']) : $emailUser);
$finalDept   = $department !== '' ? $department : (isset($item['department']) && trim((string)$item['department']) !== '' ? trim((string)$item['department']) : 'Administración y Gestión');

$item['id']          = $id;
$item['authorEmail'] = $email;
$item['author']      = $finalAuthor;
$item['department']  = $finalDept;
$item['updatedAt']   = $now;

// Buscar si ya existe para editarlo o añadirlo como nuevo
$found = false;
foreach ($store[$type] as $idx => $existing) {
    if (isset($existing['id']) && $existing['id'] === $id) {
        $item['createdAt'] = $existing['createdAt'] ?? $now;
        $store[$type][$idx] = $item;
        $found = true;
        break;
    }
}
if (!$found) {
    $item['createdAt'] = $now;
    array_unshift($store[$type], $item);
}

if (!saveStore($dataFile, $store)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo guardar en el servidor']);
    exit;
}

// Si hay un webhook de Google Apps Script configurado, sincronizar también con Google Sheets
if (file_exists($gasFile)) {
    $gasUrl = trim((string)file_get_contents($gasFile));
    if ($gasUrl !== '') {
        $ctx = stream_context_create([
            'http' => [
                'method'  => 'POST',
                'timeout' => 8,
                'header'  => "Content-Type: application/json\r\n",
                'content' => json_encode(['type' => $type, 'action' => $found ? 'update' : 'create', 'item' => $item], JSON_UNESCAPED_UNICODE)
            ]
        ]);
        @file_get_contents($gasUrl, false, $ctx);
    }
}

echo json_encode([
    'ok'     => true,
    'action' => $found ? 'updated' : 'created',
    'item'   => $item
], JSON_UNESCAPED_UNICODE);


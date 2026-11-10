<?php
/**
 * Auto-actualizador desde GitHub para https://fpapps.es/aula-ateca/
 * Descarga portal_ateca_dist.zip de josedpdiaz/portal-aula-ateca (rama main)
 * y lo descomprime en el propio directorio.
 *
 * Para protegerlo con una clave opcional, crea un archivo .deploy_token en este
 * mismo directorio y llama a: ?token=TU_CLAVE
 */
header('Content-Type: application/json; charset=utf-8');

$tokenFile = __DIR__ . '/.deploy_token';
if (file_exists($tokenFile)) {
    $expected = trim((string)file_get_contents($tokenFile));
    $given = isset($_GET['token']) ? trim((string)$_GET['token']) : '';
    if ($expected !== '' && !hash_equals($expected, $given)) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Token no válido']);
        exit;
    }
}

$zipUrl = 'https://raw.githubusercontent.com/josedpdiaz/portal-aula-ateca/main/portal_ateca_dist.zip?t=' . time();
$tmpZip = __DIR__ . '/_tmp_deploy.zip';

$ctx = stream_context_create([
    'http' => [
        'timeout' => 30,
        'header'  => "User-Agent: FPapps-Deployer/1.0\r\nCache-Control: no-cache\r\n"
    ]
]);

$data = @file_get_contents($zipUrl, false, $ctx);
if ($data === false || strlen($data) < 1000) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'No se pudo descargar portal_ateca_dist.zip desde GitHub']);
    exit;
}

file_put_contents($tmpZip, $data);

$zip = new ZipArchive();
if ($zip->open($tmpZip) !== true) {
    @unlink($tmpZip);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo abrir el archivo ZIP']);
    exit;
}

$zip->extractTo(__DIR__);
$zip->close();
@unlink($tmpZip);

echo json_encode([
    'ok' => true,
    'updated_at' => gmdate('c'),
    'bytes' => strlen($data),
    'message' => 'Portal actualizado correctamente desde GitHub main'
]);

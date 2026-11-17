<?php
header('Content-Type: application/json; charset=utf-8');

$parent = realpath(__DIR__ . '/..');
if (!$parent || !is_dir($parent)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Parent dir not found']);
    exit;
}

$targetDir = $parent . '/formulario-asistencia';
if (!is_dir($targetDir)) {
    if (!@mkdir($targetDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Cannot create target directory']);
        exit;
    }
}

$zipFile = __DIR__ . '/formulario_asistencia_dist.zip';
if (!file_exists($zipFile)) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'error' => 'formulario_asistencia_dist.zip not found']);
    exit;
}

$zip = new ZipArchive();
if ($zip->open($zipFile) !== true) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to open zip']);
    exit;
}

$zip->extractTo($targetDir);
$zip->close();

echo json_encode([
    'ok' => true,
    'target' => $targetDir,
    'url' => 'https://fpapps.es/formulario-asistencia/',
    'files' => array_values(array_diff(scandir($targetDir), ['.', '..']))
]);

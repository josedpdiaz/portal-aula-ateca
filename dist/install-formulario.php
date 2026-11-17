<?php
header('Content-Type: application/json; charset=utf-8');
$parent = realpath(__DIR__ . '/..');
$targetDir = $parent . '/formulario-asistencia';
if (!is_dir($targetDir)) @mkdir($targetDir, 0755, true);
$zip = new ZipArchive();
if ($zip->open(__DIR__ . '/formulario_asistencia_dist.zip') === true) {
    $zip->extractTo($targetDir);
    $zip->close();
    echo json_encode(['ok' => true, 'updated' => gmdate('c')]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}

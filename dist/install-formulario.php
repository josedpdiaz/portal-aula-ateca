<?php
header('Content-Type: application/json; charset=utf-8');
$parent = realpath(__DIR__ . '/..');
$targetDir = $parent . '/formulario-asistencia';
if (!is_dir($targetDir)) @mkdir($targetDir, 0755, true);
$zipPath = __DIR__ . '/formulario_asistencia_dist.zip';
$zip = new ZipArchive();
if ($zip->open($zipPath) === true) {
    $zip->extractTo($targetDir);
    $zip->close();
    @unlink($zipPath);
    @unlink(__FILE__);
    echo json_encode(['ok' => true, 'updated' => gmdate('c')]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}

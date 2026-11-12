<?php
header('Content-Type: application/json; charset=utf-8');

$parent = realpath(__DIR__ . '/..');
if (!$parent || !is_dir($parent)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Parent dir not found']);
    exit;
}

$targetIndex = $parent . '/index.html';
$targetCss   = $parent . '/styles.css';

// Backup
$backupDir = $parent . '/_backups';
if (!is_dir($backupDir)) {
    @mkdir($backupDir, 0755, true);
}
$ts = date('Ymd_His');
if (file_exists($targetIndex)) {
    @copy($targetIndex, $backupDir . '/index_' . $ts . '.html');
}
if (file_exists($targetCss)) {
    @copy($targetCss, $backupDir . '/styles_' . $ts . '.css');
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!isset($data['index_html']) || !isset($data['styles_css'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing index_html or styles_css']);
    exit;
}

$w1 = file_put_contents($targetIndex, $data['index_html'], LOCK_EX);
$w2 = file_put_contents($targetCss, $data['styles_css'], LOCK_EX);

if ($w1 === false || $w2 === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to write files']);
    exit;
}

echo json_encode([
    'ok' => true,
    'message' => 'fpapps.es landing page updated successfully',
    'index_bytes' => $w1,
    'css_bytes' => $w2,
    'backup_ts' => $ts
]);

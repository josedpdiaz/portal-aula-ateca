<?php
header('Content-Type: application/json');
$parent = realpath(__DIR__ . '/..');
$index = $parent . '/index.html';
echo json_encode([
    'dir' => __DIR__,
    'parent' => $parent,
    'index_exists' => file_exists($index),
    'index_writable' => is_writable($index),
    'parent_writable' => is_writable($parent),
    'index_size' => file_exists($index) ? filesize($index) : null
]);

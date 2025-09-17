<?php
// api/quizzes.php
require_once "../lib/db.php";

$id = $_GET['id'] ?? null;
if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Quiz ID required"]);
    exit;
}

// Fetch quiz
$stmt = $pdo->prepare("SELECT id, title FROM quizzes WHERE id = ?");
$stmt->execute([$id]);
$quiz = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$quiz) {
    http_response_code(404);
    echo json_encode(["error" => "Quiz not found"]);
    exit;
}

// Fetch questions + options
$stmt = $pdo->prepare("SELECT id, text FROM questions WHERE quiz_id = ?");
$stmt->execute([$id]);
$quiz['questions'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($quiz['questions'] as &$q) {
    $stmt = $pdo->prepare("SELECT id, text FROM options WHERE question_id = ?");
    $stmt->execute([$q['id']]);
    $q['options'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

echo json_encode($quiz);

<?php
// api/courses.php
require_once "../lib/db.php";

// For MVP: return all courses
$stmt = $pdo->query("SELECT id, title, description FROM courses");
$courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($courses);

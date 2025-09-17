<?php
// api/index.php
header("Content-Type: application/json");

// Decide which script to include based on the request
$request = $_SERVER['REQUEST_URI'];

if (strpos($request, "/api/auth/login") !== false) {
    require "auth.php";
} elseif (strpos($request, "/api/courses") !== false) {
    require "courses.php";
} elseif (strpos($request, "/api/quizzes") !== false) {
    require "quizzes.php";
} elseif (strpos($request, "/api/attempts") !== false) {
    require "attempts.php";
} else {
    http_response_code(404);
    echo json_encode(["error" => "Endpoint not found"]);
}

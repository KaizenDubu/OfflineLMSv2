<?php
// lib/db.php
// Database connection using PDO

$host = "localhost";        // MySQL host
$port = "3307";             // ⚠️ Use your MySQL port (3306 or 3307)
$db   = "lms";              // Database name
$user = "lms_app";
$pass = "password123";

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

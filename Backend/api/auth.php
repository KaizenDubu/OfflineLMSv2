<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight (OPTIONS request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../lib/db.php";

// Expect JSON { "email": "...", "password": "..." }
$input = json_decode(file_get_contents("php://input"), true);

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Email and password required"]);
    exit;
}

// ✅ now include must_change_password
$stmt = $pdo->prepare("SELECT id, password, role, must_change_password FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    echo json_encode([
        "success" => true,
        "user_id" => $user['id'],
        "role"    => $user['role'],
        "must_change_password" => (int)$user['must_change_password'] // 0 or 1
    ]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid email or password"]);
}

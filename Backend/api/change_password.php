<?php
require_once "../lib/db.php";
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$userId = $input['user_id'] ?? null;
$newPassword = $input['new_password'] ?? null;

if (!$userId || !$newPassword) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "User ID and new password required"]);
    exit;
}

$hashed = password_hash($newPassword, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("UPDATE users SET password = ?, must_change_password = 0 WHERE id = ?");
if ($stmt->execute([$hashed, $userId])) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database update failed"]);
}

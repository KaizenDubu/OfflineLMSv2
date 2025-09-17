<?php
require_once "../lib/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");

// Debug mode (optional, comment out in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // List all users
        $stmt = $pdo->query("SELECT id, email, role FROM users");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
        break;

    case 'POST':
        // Create new user
        $input = json_decode(file_get_contents("php://input"), true);
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $role = $input['role'] ?? 'student';

        if (!$email || !$password) {
            http_response_code(400);
            echo json_encode(["error" => "Email and password required"]);
            exit;
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);

        // Admins: no forced change, Teachers/Students: must_change_password = 1
        $mustChange = ($role === 'admin') ? 0 : 1;

        $stmt = $pdo->prepare(
            "INSERT INTO users (email, password, role, must_change_password) VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([$email, $hash, $role, $mustChange]);

        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        // Update user email/role
        $input = json_decode(file_get_contents("php://input"), true);
        $id = $input['id'] ?? 0;
        $role = $input['role'] ?? null;
        $email = $input['email'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "User ID required"]);
            exit;
        }

        if ($role) {
            $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
            $stmt->execute([$role, $id]);
        }

        if ($email) {
            $stmt = $pdo->prepare("UPDATE users SET email = ? WHERE id = ?");
            $stmt->execute([$email, $id]);
        }

        echo json_encode(["success" => true]);
        break;

    case 'PATCH':
        // Reset password
        $input = json_decode(file_get_contents("php://input"), true);
        $id = $input['id'] ?? 0;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "User ID required"]);
            exit;
        }

        // Default reset password
        $newPass = "password123";
        $hash = password_hash($newPass, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare(
            "UPDATE users SET password = ?, must_change_password = 1 WHERE id = ?"
        );
        $stmt->execute([$hash, $id]);

        echo json_encode([
            "success" => true,
            "new_password" => $newPass
        ]);
        break;

    case 'DELETE':
        // Delete user
        $id = $_GET['id'] ?? 0;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "User ID required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}

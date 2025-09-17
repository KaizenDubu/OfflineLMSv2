<?php
require_once "../lib/db.php";

function addUser($pdo, $email, $password, $role) {
    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
    $stmt->execute([$email, $hashed, $role]);
    echo "Created $role user: $email\n";
}

addUser($pdo, "admin@example.com", "admin123", "admin");
addUser($pdo, "teacher@example.com", "teacher123", "teacher");
addUser($pdo, "student@example.com", "student123", "student");

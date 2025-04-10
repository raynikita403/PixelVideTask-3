<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header("Content-Type: application/json"); 

file_put_contents("debug_log.txt", "API hit\n", FILE_APPEND);
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    sendErrorOutput("Not found", 404);
}

$requiredFields = ["full_name", "email", "password"];

foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        sendErrorOutput("$field is required", 400);
    }
}

$pdo = getPDO();
$full_name = trim($_POST["full_name"]);
$email = trim($_POST["email"]);
$password=md5($_POST["password"]);


$query = "INSERT INTO users (full_name, email, password) VALUES (:full_name, :email, :password)";
$stmt = $pdo->prepare($query);
$stmt->bindParam(":full_name", $full_name, PDO::PARAM_STR);
$stmt->bindParam(":email", $email, PDO::PARAM_STR);
$stmt->bindParam(":password", $password, PDO::PARAM_STR);


try {
    $stmt->execute();
    sendSuccessOutput("Registration Successful", 201);
} catch (PDOException $e) {
    sendErrorOutput("Database error: " . $e->getMessage(), 500);
}
?>

<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

if ($_SERVER["REQUEST_METHOD"] != 'POST') {
    sendErrorOutput("Invalid Request Method", 405);
}
if (!isset($_POST['token']) || empty($_POST['token'])) {
    sendErrorOutput("Token is required", 400);
}

$token = $_POST['token'];
$pdo = getPDO();

$query = "SELECT id FROM users WHERE token = :token";
$statement = $pdo->prepare($query);
$statement->bindParam(":token", $token, PDO::PARAM_STR);
$statement->execute();
$user = $statement->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    sendErrorOutput("Invalid token or user not logged in", 401);
}
$query = "UPDATE users SET token = NULL WHERE id = :id";
$statement = $pdo->prepare($query);
$statement->bindParam(":id", $user["id"], PDO::PARAM_INT);
$statement->execute();

sendSuccessOutput("Logged Out Successfully!");
?>

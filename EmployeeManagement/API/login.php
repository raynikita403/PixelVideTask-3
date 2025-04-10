<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("./utils/dbConnection.php");
require_once("./utils/response.php");
require_once("./utils/token.php");

if ($_SERVER["REQUEST_METHOD"] != 'POST') {
    sendErrorOutput("Invalid Request Method", 405);
}

if (!isset($_POST['username']) || empty($_POST['username'])) {
    sendErrorOutput("Username is required", 400);
}

if (!isset($_POST['password']) || empty($_POST['password'])) {
    sendErrorOutput("Password is required", 400);
}

$username = $_POST["username"];
$password = md5($_POST['password']);
$pdo = getPDO();

$query = "SELECT id, full_name, role FROM users WHERE full_name = :username AND password = :password";
$statement = $pdo->prepare($query);
$statement->bindParam(":username", $username, PDO::PARAM_STR);
$statement->bindParam(":password", $password, PDO::PARAM_STR);
$statement->execute();
$data = $statement->fetch(PDO::FETCH_ASSOC);

if (!$data) {
    sendErrorOutput("Invalid Username or Password", 401);
}

$token = getRandomToken();
$data["token"] = $token;

$query = "UPDATE users SET token = :token WHERE id = :id";
$statement = $pdo->prepare($query);
$statement->bindParam(":token", $token, PDO::PARAM_STR);
$statement->bindParam(":id", $data["id"], PDO::PARAM_INT);
$statement->execute();

sendSuccessOutput("Logged In Successfully!", [
    "id" => $data["id"],
    "username" => $data["full_name"],
    "role" => $data["role"], 
    "token" => $token
]);
?>

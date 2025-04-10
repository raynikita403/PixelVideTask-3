<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

if ($_SERVER["REQUEST_METHOD"] != 'GET') {
    sendErrorOutput("Invalid Request Method", 405);
}

if (!isset($_GET['id']) || empty($_GET['id'])) {
    sendErrorOutput("Leave request ID is required", 400);
}

$leaveRequestId = $_GET['id'];
$pdo = getPDO();
$query = "SELECT id, employee_name, leave_type, start_date, end_date, status, reason FROM leave_requests WHERE id = :id";
$statement = $pdo->prepare($query);
$statement->bindParam(":id", $leaveRequestId, PDO::PARAM_INT);
$statement->execute();
$leaveRequest = $statement->fetch(PDO::FETCH_ASSOC);

if (!$leaveRequest) {
    sendErrorOutput("Leave request not found", 404);
}

sendSuccessOutput("Leave request details fetched successfully", $leaveRequest);
?>

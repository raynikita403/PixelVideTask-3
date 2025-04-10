<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("./utils/dbConnection.php");
require_once("./utils/response.php");
header('Content-Type: application/json');

$pdo = getPDO();

$query = "SELECT id, employee_name, leave_type, start_date, end_date, status FROM leave_requests";
$statement = $pdo->prepare($query);
$statement->execute();
$leaveRequests = $statement->fetchAll(PDO::FETCH_ASSOC);

sendSuccessOutput("Leave requests fetched successfully", $leaveRequests);
?>

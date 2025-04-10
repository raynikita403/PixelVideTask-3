<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

if ($_SERVER["REQUEST_METHOD"] != 'POST') {
    sendErrorOutput("Invalid Request Method", 405);
}

if (!isset($_POST['id']) || empty($_POST['id'])) {
    sendErrorOutput("Leave request ID is required", 400);
}

if (!isset($_POST['status']) || empty($_POST['status'])) {
    sendErrorOutput("Status is required", 400);
}

$id = $_POST['id'];
$status = $_POST['status'];
if (!in_array($status, ['Approved', 'Rejected'])) {
    sendErrorOutput("Invalid status value", 400);
}

$pdo = getPDO();

$query = "UPDATE leave_requests SET status = :status WHERE id = :id";
$statement = $pdo->prepare($query);
$statement->bindParam(":status", $status, PDO::PARAM_STR);
$statement->bindParam(":id", $id, PDO::PARAM_INT);

if ($statement->execute()) {
    echo json_encode(['status' => true, 'message' => 'Leave request status updated successfully']);
} else {
    echo json_encode(['status' => false, 'message' => 'Failed to update leave request status']);
}
?>

<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');

if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID not provided']);
    exit;
}

$id = $_GET['id'];

try {
    $pdo = getPDO();
    $query = "DELETE FROM movie_show WHERE id = :show_id";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'Movie show deleted successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

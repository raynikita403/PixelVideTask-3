<?php
require_once("./utils/dbConnection.php");
header('Content-Type: application/json');

try {
    $pdo = getPDO();
    $query = "SELECT id, description FROM show_time ORDER BY id";
    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $times = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $times]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>

<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');

try {
    $pdo = getPDO(); 

    $query = "SELECT id, name, location, status FROM theater";

    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $theaters = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $theaters]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>

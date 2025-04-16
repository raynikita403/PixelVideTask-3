<?php
require_once("./utils/dbConnection.php");
header('Content-Type: application/json');

if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID not provided']);
    exit;
}

$id = $_GET['id'];

try {
    $pdo = getPDO();

    // Get movie show details
    $stmt = $pdo->prepare("SELECT * FROM movie_show WHERE id = ?");
    $stmt->execute([$id]);
    $movieShow = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$movieShow) {
        echo json_encode(['success' => false, 'message' => 'Show not found']);
        exit;
    }

    // Get all theaters
    $theaterStmt = $pdo->query("SELECT id, name FROM theater");
    $theaters = $theaterStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get all show times
    $showTimeStmt = $pdo->query("SELECT id, description FROM show_time");
    $showTimes = $showTimeStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => [
            'id' => $movieShow['id'],
            'price' => $movieShow['price'],
            'theater_id' => $movieShow['theater_id'],
            'show_time_id' => $movieShow['show_time_id'],
            'theaters' => $theaters,
            'show_times' => $showTimes
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

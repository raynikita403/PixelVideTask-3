<?php
require_once("./utils/dbConnection.php");
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'], $data['price'], $data['theater_id'], $data['show_time_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $pdo = getPDO();
    
  
    $query = "UPDATE movie_show 
              SET price = :price, theater_id = :theater_id, show_time_id = :show_time_id 
              WHERE id = :id";

  
    $stmt = $pdo->prepare($query);

    
    $stmt->execute([
        ':price' => $data['price'],
        ':theater_id' => $data['theater_id'],
        ':show_time_id' => $data['show_time_id'],
        ':id' => $data['id']
    ]);

    echo json_encode(['success' => true, 'message' => 'Show updated successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

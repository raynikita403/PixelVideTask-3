<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');

try {
    $pdo = getPDO();

    $query = "
        SELECT 
            ms.id AS show_id,
            m.title AS movie_name,
            t.name AS theater_name,
            t.location AS theater_location,
            st.description AS show_time,
            ms.price
        FROM movie_show ms
        JOIN movie m ON ms.movie_id = m.id
        JOIN theater t ON ms.theater_id = t.id
        JOIN show_time st ON ms.show_time_id = st.id
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $shows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $shows]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>

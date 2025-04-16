<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');

try {
    $pdo = getPDO(); 
    $categoryId = isset($_GET['category_id']) ? $_GET['category_id'] : null;

    $query = "SELECT 
                m.id,
                m.title,
                m.description,
                m.banner,
                m.duration,
                m.released_date,
                m.rating,
                mc.description AS category
              FROM movie m
              LEFT JOIN movie_categories mc ON m.category_id = mc.id";
    
    if ($categoryId) {
        $query .= " WHERE m.category_id = ?";
    }

    $query .= " ORDER BY m.id";

    $stmt = $pdo->prepare($query);

    if ($categoryId) {
        $stmt->execute([$categoryId]);
    } else {
        $stmt->execute();
    }

    $movies = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($movies);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage(), $e->getLine()]);
}
?>

<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');

try {
    $pdo = getPDO();

    // Decode JSON input
    $input = json_decode(file_get_contents("php://input"), true);
    $movie_shows = $input['movie_shows'] ?? [];

    if (empty($movie_shows)) {
        sendErrorOutput("No movie show data provided.", 422);
    }

    $query = "INSERT INTO movie_show (movie_id, theater_id, show_time_id, price) 
              VALUES (:movie_id, :theater_id, :show_time_id, :price)";
    $stmt = $pdo->prepare($query);

    foreach ($movie_shows as $show) {
        $stmt->execute([
            ':movie_id' => $show['movie_id'],
            ':theater_id' => $show['theater_id'],
            ':show_time_id' => $show['show_time_id'],
            ':price' => $show['price']
        ]);
    }

    sendSuccessOutput("Movie show(s) inserted successfully.");
} catch (PDOException $e) {
    sendErrorOutput("Database Error: " . $e->getMessage(), 500);
}

<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

if ($_SERVER["REQUEST_METHOD"] !== 'GET') {
    sendErrorOutput("Invalid Request Method", 405);
}

if (!isset($_GET['id']) || empty($_GET['id'])) {
    sendErrorOutput("HOA ID is required", 400);
}

$hoaId = $_GET['id'];

try {
    $pdo = getPDO();

    $query = "SELECT 
                h.mjh, 
                h.smjh, 
                h.mnh, 
                h.gsh, 
                h.sh, 
                h.dh, 
                h.sdh, 
                h.year, 
                d.description AS hod_description, 
                s.description AS estscheme_description
              FROM 
                hoa h
              JOIN 
                department d ON h.hod = d.id
              JOIN 
                scheme s ON h.estScheme = s.id
              WHERE 
                h.id = :id";

    $statement = $pdo->prepare($query);
    $statement->bindParam(":id", $hoaId, PDO::PARAM_INT);
    $statement->execute();
    $hoa = $statement->fetch(PDO::FETCH_ASSOC);

    if (!$hoa) {
        sendErrorOutput("HOA record not found", 404);
    }

    sendSuccessOutput("HOA details fetched successfully", $hoa);

} catch (PDOException $e) {
    sendErrorOutput("Database error: " . $e->getMessage(), 500);
}
?>

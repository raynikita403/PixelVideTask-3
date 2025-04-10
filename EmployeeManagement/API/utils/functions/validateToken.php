<?php

require_once(__DIR__ . '/../response.php');
require_once(__DIR__ . '/../db.php');


function validateToken()
{
    $headers = apache_request_headers();
    $token = $headers['Authorization'];
    
    if (!$token) {
        sendErrorOutput("Token Not Found", 401);
    }

    $pdo = getPDO();
    $query = "SELECT * FROM users WHERE token = :token";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam('token', $token);
    $stmt->execute();

    $userDetails = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$userDetails) {
        sendErrorOutput("Invalid Token", 401);
    }

    return $userDetails;
}

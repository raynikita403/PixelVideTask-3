<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");
header('Content-Type: application/json');
$pdo = getPDO();
$query = "SELECT 
            hoa.id,
            d.description AS hod_description, 
            s.description AS estScheme_description, 
            CONCAT(hoa.mjH, hoa.smjH, hoa.mnH, hoa.gsH, hoa.sH, hoa.dH, hoa.sdH) AS hoa,
            CONCAT(hoa.mjH, '-', hoa.smjH, '-', hoa.mnH, '-', hoa.gsH, '-', hoa.sH, '-', hoa.dH, '-', hoa.sdH,'-',s.code) AS hoa_tier,  
            hoa.mjH,
            hoa.smjH,
            hoa.mnH,
            hoa.gsH,
            hoa.sH,
            hoa.dH,
            hoa.sdH,
            s.description,
            hoa.year,
            hoa.amount,
            hoa.status
        FROM 
            hoa
        JOIN 
            department d ON hoa.hod = d.id
        JOIN 
            scheme s ON hoa.estScheme = s.id;";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if ($data) {
    echo json_encode(array("status" => "success", "data" => $data));
    } else {
    echo json_encode(array("status" => "error", "message" => "No data found"));
    }

?>

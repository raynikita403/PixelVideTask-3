<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");
require_once("./utils/token.php");

header('Content-Type: application/json');

try {
    $pdo = getPDO(); 

    $query = "SELECT 
    e.id, 
    e.firstname, 
    e.lastname, 
    e.gross,
    d.designation_name AS designation, 
    w.description AS working_status, 
    l.district AS location,
    s.deduction,
    s.net,
    s.paid_on
FROM employee_details e
LEFT JOIN designation_details d ON e.designation_id = d.id
LEFT JOIN working_status w ON e.working_status_id = w.id
LEFT JOIN locations l ON e.location_id = l.id
LEFT JOIN salaries s ON e.id = s.employee_id;
";


    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($employees);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>

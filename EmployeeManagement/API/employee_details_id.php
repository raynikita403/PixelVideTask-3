<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");
require_once("./utils/token.php");

header('Content-Type: application/json');

try {
    $pdo = getPDO();
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode(["status" => false, "message" => "Employee ID is required"]);
        exit;
    }

    $id = intval($_GET['id']); 
    $query = "SELECT e.id, 
       e.firstname, 
       e.lastname, 
       e.surname, 
       e.doj, 
       e.dob, 
       e.gender, 
       e.phone, 
       e.working_status_id, 
       e.designation_id, 
       e.location_id, 
       ws.description AS working_status, 
       d.designation_name, 
       l.district AS location, 
       e.gross, 
       s.deduction, 
       s.net, 
       s.paid_on,
       s.year,
       s.month
FROM employee_details e
FULL JOIN working_status ws ON e.working_status_id = ws.id
FULL JOIN designation_details d ON e.designation_id = d.id
FULL JOIN locations l ON e.location_id = l.id
FULL JOIN salaries s ON e.id = s.employee_id
WHERE e.id = :id";

              

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $employee = $stmt->fetch(PDO::FETCH_ASSOC);

    
    if ($employee) {
        echo json_encode(["status" => true, "employee" => $employee]);
    } else {
        echo json_encode(["status" => false, "message" => "Employee not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => false, "error" => $e->getMessage()]);
}
?>

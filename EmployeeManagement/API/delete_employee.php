<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    sendErrorOutput("Invalid request method", 405);
}

if (!isset($_POST["id"]) || empty(trim($_POST["id"]))) {
    sendErrorOutput("Employee ID is required", 400);
}

$employeeId = intval($_POST["id"]);

try {
    $pdo = getPDO(); 
    $checkQuery = "SELECT id FROM employee_details WHERE id = :id";
    $checkStmt = $pdo->prepare($checkQuery);
    $checkStmt->bindParam(":id", $employeeId, PDO::PARAM_INT);
    $checkStmt->execute();

    if ($checkStmt->rowCount() === 0) {
        sendErrorOutput("Employee not found", 404);
    }


    $deleteSalaryDetails = "DELETE FROM salary_details WHERE salary_id IN 
                            (SELECT id FROM salaries WHERE employee_id = :id)";
    $stmt1 = $pdo->prepare($deleteSalaryDetails);
    $stmt1->bindParam(":id", $employeeId, PDO::PARAM_INT);
    $stmt1->execute();


    $deleteSalaries = "DELETE FROM salaries WHERE employee_id = :id";
    $stmt2 = $pdo->prepare($deleteSalaries);
    $stmt2->bindParam(":id", $employeeId, PDO::PARAM_INT);
    $stmt2->execute();

    $deleteEmployee = "DELETE FROM employee_details WHERE id = :id";
    $stmt3 = $pdo->prepare($deleteEmployee);
    $stmt3->bindParam(":id", $employeeId, PDO::PARAM_INT);
    $stmt3->execute();

  

    echo json_encode(["success" => true, "message" => "Employee and related salary records deleted successfully!"]);
} catch (PDOException $e) {
   
    sendErrorOutput("Database error: " . $e->getMessage(), 500);
}
exit;
?>

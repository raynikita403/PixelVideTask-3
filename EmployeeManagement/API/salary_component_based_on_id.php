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
    $query = "SELECT 
                  e.id AS employee_id,
                  e.firstname,
                  e.lastname,
                  s.month,
                  s.year,
                  sc.description AS salary_component,
                  sd.amount
              FROM salary_details sd
              JOIN salaries s ON sd.salary_id = s.id
              JOIN employee_details e ON s.employee_id = e.id
              JOIN salary_components sc ON sd.salary_component_id = sc.id
              WHERE e.id = :id";

 
                 $stmt = $pdo->prepare($query);
                 $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                 $stmt->execute();

    // Fetch the results
    $salaryComponents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($salaryComponents) {
        echo json_encode(["status" => true, "salary_components" => $salaryComponents]);
    } else {
        echo json_encode(["status" => false, "message" => "No salary components found for the employee"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => false, "error" => $e->getMessage()]);
}
?>

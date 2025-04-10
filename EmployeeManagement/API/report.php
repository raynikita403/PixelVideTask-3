<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] != "GET") {
    sendErrorOutput("Invalid request method", 405);
}

try {
    $pdo = getPDO();
    $sql_total = "SELECT COUNT(*) AS total_employees FROM employee_details";
    $stmt_total = $pdo->query($sql_total);
    $total_employees = $stmt_total->fetch(PDO::FETCH_ASSOC)['total_employees'];

    $sql_locations = "SELECT l.district, COUNT(e.id) AS total_employees 
                      FROM employee_details e 
                      JOIN locations l ON e.location_id = l.id 
                      GROUP BY l.district";
    $stmt_locations = $pdo->query($sql_locations);
    $locations = $stmt_locations->fetchAll(PDO::FETCH_ASSOC);

    $sql_designations = "SELECT d.designation_name AS designation, COUNT(e.id) AS total_employees 
                         FROM employee_details e 
                         JOIN designation_details d ON e.designation_id = d.id 
                         GROUP BY d.designation_name";
    $stmt_designations = $pdo->query($sql_designations);
    $designations = $stmt_designations->fetchAll(PDO::FETCH_ASSOC);

    $response = array(
        'total_employees' => $total_employees,
        'locations' => $locations,
        'designations' => $designations
    );
    echo json_encode($response);

} catch (PDOException $e) {
    sendErrorOutput("Database error: " . $e->getMessage(), 500);
}

exit;
?>

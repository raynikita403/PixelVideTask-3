<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] != "GET") {
    sendErrorOutput("Invalid request method", 405);
}

try {
    $pdo = getPDO();

    $sql_location_salary = "SELECT l.district, 
                                   AVG(e.gross) AS avg_month_salary, 
                                   AVG(e.gross * 12) AS avg_year_salary
                            FROM employee_details e
                            JOIN locations l ON e.location_id = l.id
                            GROUP BY l.district";
    $stmt_location_salary = $pdo->query($sql_location_salary);
    $locations_salary = $stmt_location_salary->fetchAll(PDO::FETCH_ASSOC);
    if (!$stmt_location_salary) {
        die("SQL query failed: " . print_r($pdo->errorInfo(), true));
    }

    $sql_designation_salary = "SELECT d.designation_name AS designation, 
                                       AVG(e.gross) AS avg_month_salary, 
                                       AVG(e.gross * 12) AS avg_year_salary
                                FROM employee_details e
                                JOIN designation_details d ON e.designation_id = d.id
                                GROUP BY d.designation_name";


    $stmt_designation_salary = $pdo->query($sql_designation_salary);
    $designations_salary = $stmt_designation_salary->fetchAll(PDO::FETCH_ASSOC);

  
    $response = array(
        'locations_salary' => $locations_salary,
        'designations_salary' => $designations_salary
    );

    echo json_encode($response);

} catch (PDOException $e) {
    sendErrorOutput("Database error: " . $e->getMessage(), 500);
}

exit;
?>

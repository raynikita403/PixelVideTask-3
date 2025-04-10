<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    sendErrorOutput("Invalid request method", 405);
}
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    sendErrorOutput("Invalid JSON input", 400);
}
$requiredFields = [
    "employeeId", "firstname", "lastname", "doj", "dob", "gender", "phone", 
    "working_status_id", "designation_id", "location_id", "gross"
];

// Validate input
foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        sendErrorOutput("$field is required", 400);
    }
}

try {
    $pdo = getPDO();

    $employeeId = intval($input["employeeId"]);
    $firstname = trim($input["firstname"]);
    $lastname = trim($input["lastname"]);
    $surname = trim($input["surname"] ?? "");
    $doj = $input["doj"];
    $dob = $input["dob"];
    $gender = $input["gender"];
    $phone = $input["phone"];
    $working_status_id = intval($input["working_status_id"]);
    $designation_id = intval($input["designation_id"]);
    $location_id = intval($input["location_id"]);
    $gross = floatval($input["gross"]);

    if (!preg_match('/^\d{10}$/', $phone)) {
        sendErrorOutput("Invalid phone number format", 400);
    }

    $query = "UPDATE employee_details 
              SET firstname = :firstname, lastname = :lastname, surname = :surname, 
                  doj = :doj, dob = :dob, gender = :gender, phone = :phone, 
                  working_status_id = :working_status_id, designation_id = :designation_id, 
                  location_id = :location_id, gross = :gross 
              WHERE id = :employeeId";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":employeeId", $employeeId, PDO::PARAM_INT);
    $stmt->bindParam(":firstname", $firstname, PDO::PARAM_STR);
    $stmt->bindParam(":lastname", $lastname, PDO::PARAM_STR);
    $stmt->bindParam(":surname", $surname, PDO::PARAM_STR);
    $stmt->bindParam(":doj", $doj, PDO::PARAM_STR);
    $stmt->bindParam(":dob", $dob, PDO::PARAM_STR);
    $stmt->bindParam(":gender", $gender, PDO::PARAM_STR);
    $stmt->bindParam(":phone", $phone, PDO::PARAM_STR);
    $stmt->bindParam(":working_status_id", $working_status_id, PDO::PARAM_INT);
    $stmt->bindParam(":designation_id", $designation_id, PDO::PARAM_INT);
    $stmt->bindParam(":location_id", $location_id, PDO::PARAM_INT);
    $stmt->bindParam(":gross", $gross, PDO::PARAM_STR);

    $stmt->execute();

    sendSuccessOutput(["message" => "Employee updated successfully"], 200);
} catch (PDOException $e) {
    sendErrorOutput("Database error: " . $e->getMessage(), 500);
}
?>

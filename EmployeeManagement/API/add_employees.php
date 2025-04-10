<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    sendErrorOutput("Invalid request method", 405);
}
$inputData = file_get_contents('php://input');
$data = json_decode(file_get_contents("php://input"), true);
if ($data === null) {
    sendErrorOutput("Invalid JSON format", 400);
}

$requiredFields = [
    "firstname", "lastname","email", "doj", "dob", "gender", "phone", 
    "working_status_id", "designation_id", "location_id", "gross"
];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        sendErrorOutput("$field is required", 400);
    }
}
$employeeId = $data['id'];
$firstname = trim($data["firstname"]);
$lastname = trim($data["lastname"]);
$surname = trim($data["surname"] ?? ""); 
$email = trim($data["email"]);
$doj = $data["doj"];
$dob = $data["dob"];
$gender = $data["gender"];
$phone = $data["phone"];
$working_status_id = intval($data["working_status_id"]);
$designation_id = intval($data["designation_id"]);
$location_id = intval($data["location_id"]);
$gross = floatval($data["gross"]);

try {
    $pdo = getPDO();
    $query = "INSERT INTO employee_details 
    (firstname, lastname, surname, doj, dob, gender, phone, working_status_id, designation_id, location_id, gross,email) 
    VALUES (:firstname, :lastname, :surname, :doj, :dob, :gender, :phone, :working_status_id, :designation_id, :location_id, :gross,:email) 
    RETURNING id";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":firstname", $firstname, PDO::PARAM_STR);
    $stmt->bindParam(":lastname", $lastname, PDO::PARAM_STR);
    $stmt->bindParam(":surname", $surname, PDO::PARAM_STR);
    $stmt->bindParam(":email", $email, PDO::PARAM_STR);
    $stmt->bindParam(":doj", $doj, PDO::PARAM_STR);
    $stmt->bindParam(":dob", $dob, PDO::PARAM_STR);
    $stmt->bindParam(":gender", $gender, PDO::PARAM_STR);
    $stmt->bindParam(":phone", $phone, PDO::PARAM_STR);
    $stmt->bindParam(":working_status_id", $working_status_id, PDO::PARAM_INT);
    $stmt->bindParam(":designation_id", $designation_id, PDO::PARAM_INT);
    $stmt->bindParam(":location_id", $location_id, PDO::PARAM_INT);
    $stmt->bindParam(":gross", $gross, PDO::PARAM_STR);

    if (!$stmt->execute()) {
        sendErrorOutput("Error executing employee insert query", 500);
    }

    $employeeId = $stmt->fetchColumn();
    if ($employeeId === false) {
        die("Error: No column found in the query result.");
    }    

    $bonus = isset($_POST['bonus']) ? floatval($_POST['bonus']) : 1000; 
    $basicSalary = $gross * 0.50;
    $hra = $gross * 0.20;
    $da = $gross * 0.10;
    $pf = $gross * 0.10;
    $tds = $gross * 0.05;
    $medicalAllowance = 2000;
    $ca = 2000;
    
    $totalDeductions = $pf + $tds;
    $netSalary = ($gross + $bonus + $medicalAllowance + $ca + $da + $hra + $basicSalary) - $totalDeductions;

    $salaryQuery = "INSERT INTO salaries (employee_id, gross, deduction, net, paid_on, month, year)
                    VALUES (:employee_id, :gross, :deduction, :net, :paid_on, :month, :year)
                        RETURNING id";
    $paidOn = date("Y-m-t");
    $month = date("F", strtotime($paidOn)); 
    $year = date("Y", strtotime($paidOn)); 
    
    $stmtSalary = $pdo->prepare($salaryQuery);
    $stmtSalary->bindParam(":employee_id", $employeeId, PDO::PARAM_INT);
    $stmtSalary->bindParam(":gross", $gross, PDO::PARAM_STR);
    $stmtSalary->bindParam(":deduction", $totalDeductions, PDO::PARAM_STR);
    $stmtSalary->bindParam(":net", $netSalary, PDO::PARAM_STR);
    $stmtSalary->bindParam(":paid_on", $paidOn, PDO::PARAM_STR);
    $stmtSalary->bindParam(":month", $month, PDO::PARAM_STR);
    $stmtSalary->bindParam(":year", $year, PDO::PARAM_INT);

    if (!$stmtSalary->execute()) {
        sendErrorOutput("Error inserting salary details", 501);
    }
    
    $salaryId = $stmtSalary->fetchColumn(); 
    $components = [
        ['component_id' => 1, 'amount' => $basicSalary], 
        ['component_id' => 2, 'amount' => $da],        
        ['component_id' => 3, 'amount' => $hra],          
        ['component_id' => 4, 'amount' => $ca],          
        ['component_id' => 5, 'amount' => $medicalAllowance], 
        ['component_id' => 6, 'amount' => $bonus],       
        ['component_id' => 7, 'amount' => $tds],
        ['component_id' => 8, 'amount' => $pf]          
    ];
    foreach ($components as $component) {
        $componentQuery = "INSERT INTO salary_details (salary_id, salary_component_id, amount)
                           VALUES (:salary_id, :component_id, :amount)";
        $componentStmt = $pdo->prepare($componentQuery);
        $componentStmt->bindParam(":salary_id", $salaryId, PDO::PARAM_INT);
        $componentStmt->bindParam(":component_id", $component['component_id'], PDO::PARAM_INT);
        $componentStmt->bindParam(":amount", $component['amount'], PDO::PARAM_STR);
        $componentStmt->execute();
    }

    sendSuccessOutput("Employee added successfully with salary details.", [
        "employee_id" => $employeeId,
        "firstname" => $firstname,
        "lastname" => $lastname,
        "gross_salary" => $gross,
        "net_salary" => $netSalary,
        "pf"=>$pf
    ]);

} catch (PDOException $e) {
    sendErrorOutput("Database error: " . $e->getMessage(), 500);
}
?>

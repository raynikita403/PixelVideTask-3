<?php
require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    sendErrorOutput("Invalid request method", 405);
}

$inputData = file_get_contents('php://input');
$data = json_decode($inputData, true);

if ($data === null) {
    sendErrorOutput("Invalid JSON format", 400);
}

if (!isset($data["employee_id"]) || !is_numeric($data["employee_id"]) || intval($data["employee_id"]) <= 0) {
    sendErrorOutput("Invalid or missing employee_id", 400);
}

$employeeId = intval($data["employee_id"]);
$grossSalary = floatval($data["gross_salary"]);
$month = $data["month"];
$year = intval($data["year"]);
$bonus = isset($data["bonus"]) ? floatval($data["bonus"]) : 1000;
$basic = isset($data["basic"]) ? floatval($data["basic"]) : $grossSalary * 0.50;
$hra = isset($data["hra"]) ? floatval($data["hra"]) : $grossSalary * 0.20;
$da = isset($data["da"]) ? floatval($data["da"]) : $grossSalary * 0.10;
$pf = isset($data["pf"]) ? floatval($data["pf"]) : $grossSalary * 0.10;
$tds = isset($data["tds"]) ? floatval($data["tds"]) : $grossSalary * 0.05;
$medicalAllowance = isset($data["medical_allowance"]) ? floatval($data["medical_allowance"]) : 2000;
$ca = isset($data["ca"]) ? floatval($data["ca"]) : 2000;

$totalDeductions = $pf + $tds;
$netSalary = ($grossSalary + $bonus + $basic + $hra + $da + $medicalAllowance + $ca) - $totalDeductions;

$paidOn = date("Y-m-t");

try {
    $pdo = getPDO();
    $pdo->beginTransaction();

    // Update salary record
    $updateSalaryQuery = "UPDATE salaries 
                          SET gross = :gross, deduction = :deduction, net = :net, paid_on = :paid_on
                          WHERE employee_id = :employee_id AND month = :month AND year = :year";

    $stmtSalary = $pdo->prepare($updateSalaryQuery);
    $stmtSalary->bindParam(":gross", $grossSalary);
    $stmtSalary->bindParam(":deduction", $totalDeductions);
    $stmtSalary->bindParam(":net", $netSalary);
    $stmtSalary->bindParam(":paid_on", $paidOn);
    $stmtSalary->bindParam(":month", $month);
    $stmtSalary->bindParam(":year", $year);
    $stmtSalary->bindParam(":employee_id", $employeeId);

    if (!$stmtSalary->execute()) {
        throw new Exception("Failed to update salary record.");
    }

    // Update gross in employee_details
    $updateGrossQuery = "UPDATE employee_details SET gross = :gross WHERE id = :employee_id";
    $stmt = $pdo->prepare($updateGrossQuery);
    $stmt->bindParam(":gross", $grossSalary);
    $stmt->bindParam(":employee_id", $employeeId);
    $stmt->execute();

    // Get salary_id for employee & month
    $salaryIdQuery = "SELECT id FROM salaries WHERE employee_id = :employee_id AND month = :month AND year = :year";
    $stmtSalaryId = $pdo->prepare($salaryIdQuery);
    $stmtSalaryId->execute([
        ":employee_id" => $employeeId,
        ":month" => $month,
        ":year" => $year
    ]);
    $salaryId = $stmtSalaryId->fetchColumn();

    if (!$salaryId) {
        throw new Exception("Salary record not found.");
    }

    // Prepare components to update or insert
    $components = [
        ['component_id' => 1, 'amount' => $basic], // Basic
        ['component_id' => 2, 'amount' => $da],    // DA
        ['component_id' => 3, 'amount' => $hra],   // HRA
        ['component_id' => 4, 'amount' => $ca],    // CA
        ['component_id' => 5, 'amount' => $medicalAllowance], // Medical Allowance
        ['component_id' => 6, 'amount' => $bonus], // Bonus
        ['component_id' => 7, 'amount' => $tds],   // TDS
        ['component_id' => 8, 'amount' => $pf]     // PF
    ];

    foreach ($components as $component) {
        // Check if the component exists for this salary_id
        $checkQuery = "SELECT id FROM salary_details WHERE salary_id = :salary_id AND salary_component_id = :component_id";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->execute([
            ":salary_id" => $salaryId,
            ":component_id" => $component['component_id']
        ]);

        if ($checkStmt->fetchColumn()) {
            // Update existing component
            $componentQuery = "UPDATE salary_details 
                               SET amount = :amount 
                               WHERE salary_id = :salary_id AND salary_component_id = :component_id";
        } else {
            // Insert new component if it doesn't exist
            $componentQuery = "INSERT INTO salary_details (salary_id, salary_component_id, amount) 
                               VALUES (:salary_id, :component_id, :amount)";
        }

        $componentStmt = $pdo->prepare($componentQuery);
        $componentStmt->execute([
            ":salary_id" => $salaryId,
            ":component_id" => $component['component_id'],
            ":amount" => $component['amount']
        ]);
    }

    $pdo->commit();

    sendSuccessOutput("Salary and components updated successfully.", [
        "employee_id" => $employeeId,
        "gross_salary" => $grossSalary,
        "net_salary" => $netSalary,
        "month" => $month,
        "year" => $year,
        "salary_id" => $salaryId,
        "pf" => $pf,
        "tds" => $tds
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendErrorOutput("Error: " . $e->getMessage(), 500);
}
?>

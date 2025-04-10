<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("./utils/dbConnection.php");
require_once("./utils/response.php");

header("Content-Type: application/json"); 
$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    sendErrorOutput("Invalid JSON format", 400);
}

$requiredFields = [
    "hod", "estScheme", "mjH", "smjH", "mnH", "gsH", "sH", "dH", "sdH", "year", "status"
];


foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        sendErrorOutput("$field is required", 400);
    }
}

$hod = $data["hod"];
$estScheme = $data["estScheme"];
$mjH = $data["mjH"];
$smjH = $data["smjH"];
$mnH = $data["mnH"];
$gsH = $data["gsH"];
$sH = $data["sH"];
$dH = $data["dH"];
$sdH = $data["sdH"];
$year = $data["year"];
$status = $data["status"];
$amount = isset($data["amount"]) ? $data["amount"] : 100.00;

$hoa = $mjH . $smjH . $mnH . $gsH . $sH . $dH . $sdH;
$hoa_tier = $mjH . "-" . $smjH . "-" . $mnH . "-" . $gsH . "-" . $sH . "-" . $dH . "-" . $sdH;

$pdo = getPDO();

$schemeQuery = "SELECT id FROM scheme WHERE type = :type LIMIT 1";
$schemeStmt = $pdo->prepare($schemeQuery);
$schemeStmt->bindParam(":type", $estScheme, PDO::PARAM_INT);
$schemeStmt->execute();
$scheme = $schemeStmt->fetch(PDO::FETCH_ASSOC);

if (!$scheme) {
    sendErrorOutput("Invalid estScheme value", 400);
}

$scheme_code = $scheme["id"];
$insertQuery = "INSERT INTO hoa (
    hod, estScheme, hoa, hoa_tier, mjH, smjH, mnH, gsH, sH, dH, sdH, scheme_code, year, amount, status
) VALUES (
    :hod, :estScheme, :hoa, :hoa_tier, :mjH, :smjH, :mnH, :gsH, :sH, :dH, :sdH, :scheme_code, :year, :amount, :status
)";

$statement = $pdo->prepare($insertQuery);
$statement->bindParam(":hod", $hod, PDO::PARAM_INT);
$statement->bindParam(":estScheme", $estScheme, PDO::PARAM_INT);
$statement->bindParam(":hoa", $hoa);
$statement->bindParam(":hoa_tier", $hoa_tier);
$statement->bindParam(":mjH", $mjH);
$statement->bindParam(":smjH", $smjH);
$statement->bindParam(":mnH", $mnH);
$statement->bindParam(":gsH", $gsH);
$statement->bindParam(":sH", $sH);
$statement->bindParam(":dH", $dH);
$statement->bindParam(":sdH", $sdH);
$statement->bindParam(":scheme_code", $scheme_code, PDO::PARAM_INT);
$statement->bindParam(":year", $year);
$statement->bindParam(":amount", $amount);
$statement->bindParam(":status", $status);

try {
    $statement->execute();
    sendSuccessOutput("HOA inserted successfully");
} catch (PDOException $e) {
    sendErrorOutput("Database error: " . $e->getMessage(), 500);
}
?>

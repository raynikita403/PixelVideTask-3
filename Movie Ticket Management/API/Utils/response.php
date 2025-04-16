<?php

function sendErrorOutput($message = 'Something Went Wrong!', $status = 400)
{
    http_response_code($status);
    echo json_encode(["status" => false, "message" => $message, "data" => null]);
    exit;
}

function sendSuccessOutput($message = "success", $data = null)
{
    echo json_encode(["status" => true, "message" => $message, "data" => $data]);
    exit;
}

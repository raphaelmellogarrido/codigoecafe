<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = htmlspecialchars(trim($_POST["name"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_VALIDATE_EMAIL);
    $body = "Nome: $name\nE-mail: $email\nAssunto: $subject_field\n\nMensagem:\n$message";
    $message = htmlspecialchars(trim($_POST["message"] ?? ''));

    if (!$name || !$email || !$message) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Preencha todos os campos."]);
        exit;
    }

    $to = "contacto@codigoecafe.com";
    $subject = "Novo contato pelo site - $name";
    $body = "Nome: $name\nE-mail: $email\n\nMensagem:\n$message";
    $headers = "From: no-reply@codigoecafe.com\r\nReply-To: $email";
    $subject_field = htmlspecialchars(trim($_POST["subject"] ?? ''));

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Erro ao enviar e-mail."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método não permitido."]);
}
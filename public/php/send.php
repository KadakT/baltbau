<?php

header("Content-Type: text/plain");

if(!empty($_POST['website'])) exit;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo "Ungültige Anfragemethode.";
  exit;
}

$name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');
$subject = "Anfrage zu zusätzlichen Projektbeispielen";

if(empty($name)){
    echo 'Geben Sie Ihren Namen ein.';
    exit;
}

if(empty($email)){
    echo 'Geben Sie Ihre E-Mail-Adresse ein';
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo "Ungültige E-Mail-Adresse.";
  exit;
}

if(empty($message)){
    echo 'Schreiben Sie eine Nachricht.';
    exit;
}

if (strlen($message) < 10) {
  echo "Die Nachricht muss mindestens 10 Zeichen lang sein.";
  exit;
}

if (strlen($message) > 1000) {
  echo "Die Nachricht darf maximal 1000 Zeichen enthalten.";
  exit;
}

$to = "info@baltbau.eu"; 
$headers = 'From: noreplay@baltbau.de' . "\r\n" .
           'Reply-To: ' . $email . "\r\n" .
           'X-Mailer: PHP/' . phpversion();
$body = "Absender: $email\n\nNachricht:\n$message";

$sent = mail($to, $subject, $body, $headers, '-fsaatja@baltbau.de');

if ($sent) {
  echo "OK";
} else {
  echo "Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.";
}

?>
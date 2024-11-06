<?php
// Include the TCPDF library
require_once('../TCPDF-main/tcpdf.php');  // Adjust the path if necessary

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $customerName = $_POST['customerName'];
    $repairDescription = $_POST['repairDescription'];
    $partsCost = $_POST['partsCost'];
    $laborCost = $_POST['laborCost'];
    $totalCost = $_POST['totalCost'];

    // Create PDF
    $pdf = new TCPDF();
    $pdf->AddPage();
    $pdf->SetFont('helvetica', '', 12);

    // Add content to the PDF
    $pdf->Cell(0, 10, "Repair Estimate", 0, 1, 'C');
    $pdf->Ln(10);
    $pdf->Cell(0, 10, "Customer Name: $customerName", 0, 1);
    $pdf->Cell(0, 10, "Repair Description: $repairDescription", 0, 1);
    $pdf->Cell(0, 10, "Parts Cost: $$partsCost", 0, 1);
    $pdf->Cell(0, 10, "Labor Cost: $$laborCost", 0, 1);
    $pdf->Cell(0, 10, "Total Cost: $$totalCost", 0, 1);

    // Output PDF to a file
    $pdfOutput = 'repair_estimate.pdf';
    $pdf->Output($pdfOutput, 'F');  // Save to a file in the current directory

    // Send the email
    $to = "egordyai88@gmail.com";  // Replace with recipient's email address
    $subject = "Repair Estimate";
    $message = "Attached is the repair estimate for $customerName.";
    $headers = "From: egordyai88@gmail.com\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"boundary1234\"\r\n";

    // Prepare the attachment
    $attachment = chunk_split(base64_encode(file_get_contents($pdfOutput)));
    $message .= "--boundary1234\r\n";
    $message .= "Content-Type: application/pdf; name=\"repair_estimate.pdf\"\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n";
    $message .= $attachment . "\r\n";
    $message .= "--boundary1234--";

    // Send the email
    if (mail($to, $subject, $message, $headers)) {
        echo "Estimate sent successfully!";
    } else {
        echo "There was an error sending the email.";
    }
}
?>

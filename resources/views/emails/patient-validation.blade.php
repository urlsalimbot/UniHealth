<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Information Validation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #10b981;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e5e7eb;
        }
        .patient-info {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
        }
        .info-row {
            margin: 10px 0;
        }
        .label {
            font-weight: bold;
            color: #6b7280;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>UniHealth</h1>
        <p>Patient Information Validation</p>
    </div>
    
    <div class="content">
        <h2>Dear {{ $patient->first_name }} {{ $patient->last_name }},</h2>
        
        <p>Thank you for registering with UniHealth. We have received your patient information and it is currently being validated by our healthcare team.</p>
        
        <div class="patient-info">
            <h3>Your Submitted Information:</h3>
            <div class="info-row">
                <span class="label">Patient ID:</span> {{ $patient->patient_id }}
            </div>
            <div class="info-row">
                <span class="label">Full Name:</span> {{ $patient->first_name }} {{ $patient->middle_name }} {{ $patient->last_name }} {{ $patient->suffix }}
            </div>
            <div class="info-row">
                <span class="label">Date of Birth:</span> {{ \Carbon\Carbon::parse($patient->date_of_birth)->format('F d, Y') }}
            </div>
            <div class="info-row">
                <span class="label">Gender:</span> {{ $patient->gender }}
            </div>
            <div class="info-row">
                <span class="label">Email:</span> {{ $patient->email }}
            </div>
            <div class="info-row">
                <span class="label">Mobile Number:</span> {{ $patient->mobile_number }}
            </div>
            <div class="info-row">
                <span class="label">Address:</span> {{ $patient->house_number }} {{ $patient->street }}, {{ $patient->barangay }}, {{ $patient->municipality_city }}, {{ $patient->province }}, {{ $patient->region }} {{ $patient->postal_code }}
            </div>
        </div>

        <div class="patient-info" style="text-align: center; background-color: #f0f9ff; border-left: 4px solid #0ea5e9;">
            <h3>Your Patient QR Code</h3>
            <p style="margin-bottom: 15px; color: #64748b;">Scan this code for quick access to your patient record</p>
            <div style="display: inline-block; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <img src="{{ $qrCodeUrl }}" alt="Patient QR Code" style="max-width: 150px; height: auto;" />
            </div>
            <p style="margin-top: 10px; font-size: 12px; color: #94a3b8;">
                Patient ID: {{ $patient->patient_id }}
            </p>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <ul>
            <li>Our healthcare team will review your information within 24-48 hours</li>
            <li>You will receive a confirmation email once your account is fully validated</li>
            <li>If any additional information is needed, we will contact you directly</li>
        </ul>
        
        <p>If you have any questions or need to update your information, please contact our support team.</p>
        
        <div class="footer">
            <p>© {{ date('Y') }} UniHealth. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>

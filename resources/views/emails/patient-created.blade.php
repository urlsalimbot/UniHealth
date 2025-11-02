<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to UniHealth</title>
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
        .welcome-box {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
            text-align: center;
        }
        .patient-info {
            background-color: #f0fdf4;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #bbf7d0;
        }
        .info-row {
            margin: 10px 0;
        }
        .label {
            font-weight: bold;
            color: #6b7280;
        }
        .cta-button {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
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
        <p>Your Healthcare Partner</p>
    </div>
    
    <div class="content">
        <div class="welcome-box">
            <h2>Welcome, {{ $patient->first_name }}!</h2>
            <p>Your patient record has been successfully created and validated.</p>
        </div>
        
        <p>Dear {{ $patient->first_name }} {{ $patient->last_name }},</p>
        
        <p>We are pleased to inform you that your patient registration with UniHealth has been completed successfully. Your account is now active and ready for use.</p>
        
        <div class="patient-info">
            <h3>Your Patient Information:</h3>
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
                <span class="label">Registration Date:</span> {{ $patient->created_at->format('F d, Y') }}
            </div>
        </div>

        <div class="patient-info" style="text-align: center; background-color: #f0fdf4; border-left: 4px solid #22c55e;">
            <h3>🎉 Your Patient QR Code</h3>
            <p style="margin-bottom: 15px; color: #64748b;">Scan this code for instant access to your patient dashboard</p>
            <div style="display: inline-block; padding: 20px; background: white; border-radius: 12px; border: 2px solid #bbf7d0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <img src="{{ $qrCodeUrl }}" alt="Patient QR Code" style="max-width: 180px; height: auto;" />
            </div>
            <p style="margin-top: 15px; font-size: 14px; color: #16a34a; font-weight: 600;">
                Patient ID: {{ $patient->patient_id }}
            </p>
            <p style="margin-top: 5px; font-size: 12px; color: #94a3b8;">
                Keep this QR code safe for quick check-ins
            </p>
        </div>
        
        <h3>What You Can Do Now:</h3>
        <ul>
            <li>View your medical records and test results</li>
            <li>Request prescription refills</li>
        </ul>
        
        <div style="text-align: center;">
            <a href="{{ route('patients.show', ['id' => $patient->patient_id]) }}" class="cta-button">
                View Your Patient Dashboard
            </a>
        </div>
        
        <p><strong>Important Information:</strong></p>
        <ul>
            <li>Keep your Patient ID confidential and use it for all healthcare transactions</li>
            <li>Update your contact information if it changes</li>
            <li>Bring a valid ID for your first appointment</li>
        </ul>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <div class="footer">
            <p>© {{ date('Y') }} UniHealth. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>

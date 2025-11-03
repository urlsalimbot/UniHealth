<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your Medication Request Has Been Fulfilled</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f9fafb; color: #222;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); padding: 32px;">
        <h2 style="color: #2563eb;">Your Medication Request is Ready</h2>
        <p>Dear {{ $request->patient->first_name ?? 'Patient' }},</p>
        <p>We are pleased to inform you that your medication request (Request #{{ $request->id }}) has been <strong>fulfilled</strong> and is now ready for pickup.</p>
        <ul>
            <li><strong>Request ID:</strong> {{ $request->id }}</li>
            <li><strong>Status:</strong> Fulfilled</li>
            <li><strong>Pickup Location:</strong> {{ config('app.name') }} Pharmacy</li>
            <li><strong>Date Fulfilled:</strong> {{ $request->fulfilled_at ? $request->fulfilled_at->format('F j, Y, g:i a') : now()->format('F j, Y, g:i a') }}</li>
        </ul>
        <p>If you have any questions or need further assistance, please contact our pharmacy staff.</p>
        <p style="margin-top: 32px; color: #6b7280; font-size: 0.95em;">Thank you for choosing {{ config('app.name') }} for your healthcare needs.</p>
        <hr style="margin: 32px 0;">
        <p style="font-size: 0.85em; color: #aaa;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
</body>
</html>

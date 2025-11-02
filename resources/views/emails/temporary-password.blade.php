<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your UniHealth Account</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .welcome {
            font-size: 20px;
            margin-bottom: 20px;
            color: #1f2937;
        }
        .password-box {
            background-color: #f1f5f9;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        .password-label {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .password {
            font-size: 24px;
            font-weight: 700;
            color: #16a34a;
            letter-spacing: 2px;
            font-family: 'Courier New', monospace;
        }
        .instructions {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .instructions h3 {
            margin: 0 0 10px 0;
            color: #92400e;
            font-size: 16px;
        }
        .login-button {
            display: inline-block;
            background-color: #16a34a;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: background-color 0.2s;
        }
        .login-button:hover {
            background-color: #15803d;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 0;
            color: #64748b;
            font-size: 14px;
        }
        .security-note {
            font-size: 12px;
            color: #ef4444;
            margin-top: 15px;
            padding: 10px;
            background-color: #fef2f2;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 UniHealth</h1>
            <p>Your Healthcare Management System</p>
        </div>
        
        <div class="content">
            <p class="welcome">Hello, {{ $userName }}!</p>
            
            <p>Welcome to UniHealth! Your account has been successfully created. Below you'll find your temporary password to access the system.</p>
            
            <div class="password-box">
                <div class="password-label">Your Temporary Password</div>
                <div class="password">{{ $temporaryPassword }}</div>
            </div>
            
            <div class="instructions">
                <h3>🔐 Important Security Information</h3>
                <p>This is a temporary password for your first login. Please change it immediately after logging in to ensure your account security.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ $loginUrl }}" class="login-button">
                    Sign In to Your Account
                </a>
            </div>
            
            <div class="security-note">
                <strong>Security Reminder:</strong> Never share your password with anyone. If you didn't request this account, please contact your administrator immediately.
            </div>
            
            <p><strong>Login Details:</strong></p>
            <ul>
                <li>Email: {{ $userEmail }}</li>
                <li>Temporary Password: {{ $temporaryPassword }}</li>
                <li>Login URL: {{ $loginUrl }}</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} UniHealth Healthcare Management System</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>

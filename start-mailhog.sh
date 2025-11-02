#!/bin/bash

echo "🚀 Starting MailHog for UniHealth email testing..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing MailHog container
docker stop unihealth-mailhog 2>/dev/null || true
docker rm unihealth-mailhog 2>/dev/null || true

# Start MailHog
echo "📧 Starting MailHog on ports 1025 (SMTP) and 8025 (Web)..."
docker run -d --name unihealth-mailhog -p 1025:1025 -p 8025:8025 mailhog/mailhog:latest

if [ $? -eq 0 ]; then
    echo "✅ MailHog started successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your .env file with:"
    echo "   MAIL_MAILER=smtp"
    echo "   MAIL_HOST=127.0.0.1"
    echo "   MAIL_PORT=1025"
    echo "   MAIL_USERNAME=null"
    echo "   MAIL_PASSWORD=null"
    echo "   MAIL_ENCRYPTION=null"
    echo "   MAIL_FROM_ADDRESS=\"test@example.com\""
    echo "   MAIL_FROM_NAME=\"UniHealth\""
    echo ""
    echo "2. Clear Laravel config: php artisan config:clear"
    echo "3. Visit http://localhost:8025 to view emails"
    echo "4. Test at: http://localhost:8000/test-mail-form"
    echo ""
    echo "🔧 To stop MailHog: docker stop unihealth-mailhog"
else
    echo "❌ Failed to start MailHog"
    exit 1
fi

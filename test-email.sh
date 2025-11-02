#!/bin/bash

echo "🧪 Testing Temporary Password Email Feature"
echo "=========================================="

# Check if Laravel application is running
echo "1. Checking Laravel application..."
if curl -s http://localhost:8000/up > /dev/null; then
    echo "✅ Laravel is running"
else
    echo "❌ Laravel is not running. Please start it first:"
    echo "   php artisan serve"
    exit 1
fi

# Test email configuration
echo ""
echo "2. Testing email configuration..."
CONFIG_RESPONSE=$(curl -s http://localhost:8000/test-email)
echo "$CONFIG_RESPONSE" | jq .

# Send test email
echo ""
echo "3. Sending test email..."
SEND_RESPONSE=$(curl -s -X POST http://localhost:8000/test-send-email)
echo "$SEND_RESPONSE" | jq .

# Check if MailHog is accessible
echo ""
echo "4. Checking MailHog access..."
if curl -s http://localhost:8025 > /dev/null; then
    echo "✅ MailHog is accessible at http://localhost:8025"
    echo "📧 Check your inbox there for the test email!"
else
    echo "❌ MailHog is not accessible. Please start MailHog:"
    echo "   Option 1 - Docker: docker run -d -p 1025:1025 -p 8025:8025 --name mailhog mailhog/mailhog"
    echo "   Option 2 - Local:  MailHog (if installed via Go)"
    echo ""
    echo "📋 Alternative: Check Laravel logs for email content:"
    echo "   tail -f storage/logs/laravel.log"
fi

echo ""
echo "🎯 To test the actual user creation:"
echo "   1. Go to http://localhost:8000/admin/users/create"
echo "   2. Fill out the form with a real email address"
echo "   3. Submit and check MailHog for the temporary password email"
echo ""
echo "🔍 Debugging tips:"
echo "   - Check Laravel logs: tail -f storage/logs/laravel.log"
echo "   - Check MailHog: http://localhost:8025"
echo "   - Verify .env mail settings match MailHog configuration"

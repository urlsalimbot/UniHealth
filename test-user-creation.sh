#!/bin/bash

echo "🧪 Testing User Creation Fix"
echo "============================"

# Check if Laravel application is running
echo "1. Checking Laravel application..."
if curl -s http://localhost:8000/up > /dev/null; then
    echo "✅ Laravel is running"
else
    echo "❌ Laravel is not running. Please start it first:"
    echo "   php artisan serve"
    exit 1
fi

# Check if MailHog is running
echo ""
echo "2. Checking MailHog..."
if curl -s http://localhost:8025 > /dev/null; then
    echo "✅ MailHog is accessible at http://localhost:8025"
else
    echo "❌ MailHog is not accessible. Start it with:"
    echo "   ./start-mailhog.sh"
    echo ""
    echo "📋 Or run: docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog"
fi

# Test the create user page
echo ""
echo "3. Testing user creation page..."
CREATE_PAGE=$(curl -s http://localhost:8000/admin/users/create)
if echo "$CREATE_PAGE" | grep -q "Create New User Account"; then
    echo "✅ User creation page is accessible"
else
    echo "❌ User creation page not accessible"
    echo "   Check authentication and admin permissions"
fi

echo ""
echo "🎯 Ready to test!"
echo ""
echo "Testing Steps:"
echo "1. Go to: http://localhost:8000/admin/users/create"
echo "2. Fill in the form:"
echo "   - Name: Test User"
echo "   - Email: test@example.com"
echo "   - Role: Intake Staff"
echo "3. Click 'Create Account & Send Email'"
echo "4. Check for success message"
echo "5. Check MailHog at: http://localhost:8025"
echo ""
echo "🔧 What was fixed:"
echo "✅ Corrected route redirect (admin.dashboard instead of admin.users.index)"
echo "✅ Improved error handling with proper validation messages"
echo "✅ Added form processing states and disabled inputs during submission"
echo "✅ Enhanced frontend with better error display"
echo "✅ Added fallback for email failures (shows temp password in warning)"
echo ""
echo "📝 Debugging:"
echo "- Check Laravel logs: tail -f storage/logs/laravel.log"
echo "- Check browser console for JavaScript errors"
echo "- Verify email in MailHog: http://localhost:8025"

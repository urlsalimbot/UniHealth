# Mail Testing Setup for UniHealth

## Quick Setup Options

### Option 1: MailHog (Recommended for Local Development)

MailHog captures all outgoing emails and shows them in a web interface.

**Using Docker:**
```bash
# Start MailHog
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Or use the provided docker-compose
docker-compose -f docker-compose.test.yml up mailhog
```

**Update your `.env` file:**
```env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="test@example.com"
MAIL_FROM_NAME="UniHealth"
```

**Access emails:** http://localhost:8025

### Option 2: Mailtrap (Online Testing)

1. Sign up at [Mailtrap.io](https://mailtrap.io)
2. Get your SMTP credentials from the dashboard
3. Update your `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="test@example.com"
MAIL_FROM_NAME="UniHealth"
```

### Option 3: Gmail (Real Email Testing)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Update your `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-16-character-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="test@example.com"
MAIL_FROM_NAME="UniHealth"
```

### Option 4: Log Only (Current Setup)

Emails are written to `storage/logs/laravel.log` instead of being sent.

```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS="test@example.com"
MAIL_FROM_NAME="UniHealth"
```

## Testing Your Setup

1. **Update your `.env`** with one of the configurations above
2. **Restart your Laravel server:**
   ```bash
   php artisan config:clear
   composer run dev
   ```
3. **Test emails:**
   - Visit: http://localhost:8000/test-mail-form
   - Click "Test with Dummy Patient Data"
   - Check your mail service (MailHog web interface, Mailtrap inbox, or Gmail)

## Email Logging

All emails are also logged to:
- `storage/logs/laravel.log` - Standard Laravel logs
- `storage/logs/emails.log` - Dedicated email log with full HTML content

View logs in real-time:
```bash
tail -f storage/logs/laravel.log
tail -f storage/logs/emails.log
```

## Troubleshooting

**Connection refused:**
- Make sure your mail service is running
- Check that ports aren't blocked
- Verify HOST and PORT in `.env`

**Authentication failed:**
- Double-check username/password
- For Gmail, use App Password (not regular password)
- For Mailtrap, use credentials from dashboard

**Emails not appearing:**
- Check `storage/logs/laravel.log` for errors
- Verify MAIL_MAILER setting
- Try clearing config cache: `php artisan config:clear`

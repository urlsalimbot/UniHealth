<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mail Test Results - UniHealth</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="bg-green-600 text-white p-6">
                    <h1 class="text-2xl font-bold">Mail Test Results</h1>
                    <p class="mt-2">Testing UniHealth Patient Mail System</p>
                </div>
                
                <div class="p-6">
                    @if(isset($patient))
                        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 class="text-lg font-semibold text-blue-800">Test Patient</h3>
                            <p class="text-blue-700">{{ $patient->first_name }} {{ $patient->last_name }} ({{ $patient->email }})</p>
                        </div>
                    @endif

                    <div class="space-y-4">
                        @foreach($results as $type => $result)
                            <div class="p-4 rounded-lg border @if(str_contains($result, '✅')) bg-green-50 border-green-200 @else bg-red-50 border-red-200 @endif">
                                <h3 class="font-semibold @if(str_contains($result, '✅')) text-green-800 @else text-red-800 @endif">
                                    {{ ucfirst($type) }} Mail
                                </h3>
                                <p class="@if(str_contains($result, '✅')) text-green-700 @else text-red-700 @endif mt-1">
                                    {{ $result }}
                                </p>
                            </div>
                        @endforeach
                    </div>

                    <div class="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">Next Steps</h3>
                        <div class="space-y-2 text-sm text-gray-600">
                            <p><strong>If using log driver:</strong> Check <code>storage/logs/laravel.log</code></p>
                            <p><strong>If using SMTP:</strong> Check your email inbox at test@example.com</p>
                            <p><strong>If using array driver:</strong> Check Laravel Telescope or mail debugging tools</p>
                        </div>
                    </div>

                    <div class="mt-6 flex space-x-4">
                        <a href="{{ route('test.mail.form') }}" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            ← Back to Test Form
                        </a>
                        <a href="/test-mail" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Test Again
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

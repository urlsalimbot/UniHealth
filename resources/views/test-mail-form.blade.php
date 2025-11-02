<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mail Test Form - UniHealth</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="bg-green-600 text-white p-6">
                    <h1 class="text-2xl font-bold">Mail Testing System</h1>
                    <p class="mt-2">Test UniHealth Patient Mail Functionality</p>
                </div>
                
                <div class="p-6">
                    <div class="mb-8">
                        <h2 class="text-lg font-semibold text-gray-800 mb-4">Quick Test Options</h2>
                        
                        <div class="space-y-4">
                            <a href="/test-mail" class="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                🧪 Test with Dummy Patient Data
                            </a>
                            
                            @if($patients->count() > 0)
                                <div class="mt-6">
                                    <h3 class="text-md font-semibold text-gray-700 mb-3">Test with Real Patient:</h3>
                                    <div class="space-y-2">
                                        @foreach($patients as $patient)
                                            <a href="{{ route('test.mail.patient', $patient->patient_id) }}" 
                                               class="block w-full text-left bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-lg border border-gray-200 transition-colors">
                                                <div class="flex justify-between items-center">
                                                    <span class="font-medium">{{ $patient->first_name }} {{ $patient->last_name }}</span>
                                                    <span class="text-sm text-gray-500">{{ $patient->email }}</span>
                                                </div>
                                                <div class="text-sm text-gray-500 mt-1">ID: {{ $patient->patient_id }}</div>
                                            </a>
                                        @endforeach
                                    </div>
                                </div>
                            @else
                                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p class="text-yellow-800">No patients found in the database. Create a patient first, or use the dummy data test.</p>
                                </div>
                            @endif
                        </div>
                    </div>

                    <div class="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 class="text-lg font-semibold text-blue-800 mb-3">Current Mail Configuration</h3>
                        <div class="space-y-2 text-sm text-blue-700">
                            <p><strong>Driver:</strong> {{ config('mail.default') }}</p>
                            <p><strong>From Address:</strong> {{ config('mail.from.address') }}</p>
                            <p><strong>From Name:</strong> {{ config('mail.from.name') }}</p>
                        </div>
                    </div>

                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">How to Check Results</h3>
                        <div class="space-y-2 text-sm text-gray-600">
                            @if(config('mail.default') === 'log')
                                <p>📝 <strong>Log Driver:</strong> Check <code>storage/logs/laravel.log</code> for email content</p>
                            @elseif(config('mail.default') === 'array')
                                <p>📋 <strong>Array Driver:</strong> Emails stored in memory - use Laravel debugging tools</p>
                            @elseif(config('mail.default') === 'smtp')
                                <p>📧 <strong>SMTP Driver:</strong> Check the configured email inbox</p>
                            @else
                                <p>⚙️ <strong>Custom Driver:</strong> Check your mail service documentation</p>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code Test - UniHealth</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="bg-green-600 text-white p-6">
                    <h1 class="text-2xl font-bold">QR Code Test</h1>
                    <p>Patient ID: {{ $patientId }}</p>
                </div>
                
                <div class="p-6">
                    <div class="text-center mb-8">
                        <h2 class="text-lg font-semibold text-gray-800 mb-4">Generated QR Code</h2>
                        <div class="inline-block p-6 bg-white border-2 border-gray-200 rounded-lg shadow-md">
                            <img src="{{ $qrUrl }}" alt="Patient QR Code" class="w-48 h-48 mx-auto" />
                        </div>
                        <p class="mt-4 text-sm text-gray-600">Patient ID: {{ $patientId }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-md font-semibold text-gray-800 mb-3">QR Code Data:</h3>
                        <pre class="text-xs text-gray-600 overflow-x-auto">{{ json_encode($qrData, JSON_PRETTY_PRINT) }}</pre>
                    </div>

                    <div class="mt-6">
                        <h3 class="text-md font-semibold text-gray-800 mb-3">QR Code URL:</h3>
                        <div class="bg-gray-100 rounded p-3">
                            <code class="text-xs text-gray-700 break-all">{{ $qrUrl }}</code>
                        </div>
                    </div>

                    <div class="mt-8 flex space-x-4">
                        <a href="{{ route('test.mail.form') }}" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            ← Back to Mail Tests
                        </a>
                        <a href="/test-qr-code/{{ $patientId }}" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            View JSON Data
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

<?php

namespace App\Services;

use App\Models\Audit;
use Illuminate\Support\Facades\Auth;

class AuditLogger
{
    public static function log(string $action, string $entityType, string $entityId, array $metadata = []): Audit
    {
        return Audit::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'metadata' => $metadata,
        ]);

    }
}

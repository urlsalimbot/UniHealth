<?php

namespace App\Enums;

enum TransactionDirection: string
{
    case IN = 'in';
    case OUT = 'out';

    public function label(): string
    {
        return match ($this) {
            self::IN => 'Incoming',
            self::OUT => 'Outgoing',
        };
    }
}

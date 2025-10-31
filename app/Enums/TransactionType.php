<?php

namespace App\Enums;

enum TransactionType: string
{
    case PURCHASE = 'purchase';
    case DISPENSE = 'dispense';
    case ADJUSTMENT = 'adjustment';
    case RETURN = 'return';
    case TRANSFER = 'transfer';
    case WASTE = 'waste';

    public function label(): string
    {
        return ucfirst($this->value);
    }
}

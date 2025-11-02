<?php
namespace App\Enums;

enum TransactionType: string
{
    case RELEASE = 'RELEASE';
    case INTAKE = 'INTAKE';
    case ADJUSTMENT = 'ADJUSTMENT';
    case DISPOSAL = 'DISPOSAL';
}
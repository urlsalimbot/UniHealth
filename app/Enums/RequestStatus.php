<?php
namespace App\Enums;

enum RequestStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case FULFILLED = 'fulfilled';
    case REJECTED = 'rejected';
}

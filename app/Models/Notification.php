<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'role',
        'is_global',
        'type',
        'title',
        'message',
        'action_url'
    ];

    public function viewers()
    {
        return $this->belongsToMany(User::class, 'notification_user')
            ->withPivot('is_viewed')
            ->withTimestamps();
    }
}

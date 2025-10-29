<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use OwenIt\Auditing\Contracts\Auditable;
class User extends Authenticatable implements MustVerifyEmail, Auditable
{
    use \OwenIt\Auditing\Auditable;
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'patient_id', // ✅ allow patient link
    ];
    
    protected $auditInclude = [
        'name',
        'email',
        'password',
        'role',
        'patient_id', // ✅ allow patient link
    ];





    public function patient()
    {
        return $this->belongsTo(Patients::class, 'patient_id', 'patient_id');
    }


    public const ROLE_ADMIN = 'administrator';
    public const ROLE_STAFF = 'intake-staff';
    public const ROLE_DOCTOR = 'doctor';
    public const ROLE_PHARM = 'pharmacist';
    public const ROLE_PTNT = 'patient';

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isStaff(): bool
    {
        return $this->role === self::ROLE_STAFF;
    }

    public function isDoctor(): bool
    {
        return $this->role === self::ROLE_DOCTOR;
    }

    public function isPharm(): bool
    {
        return $this->role === self::ROLE_PHARM;
    }


    public function isPatient(): bool
    {
        return $this->role === self::ROLE_PTNT;
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}

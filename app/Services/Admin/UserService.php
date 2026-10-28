<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;

class UserService
{
    public function getPaginatedUsers($search = null)
    {
        return User::query()
            ->where('id', '!=', Auth::id())
            ->select(['id', 'name', 'email', 'role_id', 'is_active','email_verified_at', 'expert_verified_at'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->paginate(10)
            ->withQueryString();
    }

    public function updateRole(User $user, int $roleId)
    {
        return $user->update(['role_id' => $roleId]);
    }

    public function toggleUserStatus(User $user)
    {
        $user->is_active = !$user->is_active;
        return $user->save();
    }

    public function sendPasswordReset(User $user)
    {
        return Password::broker()->sendResetLink(['email' => $user->email]);
    }

    public function deleteUser(User $user)
    {
        return $user->delete();
    }
}
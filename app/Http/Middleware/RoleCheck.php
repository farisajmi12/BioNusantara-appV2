<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleCheck
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // 1. Cek apakah user sudah login
        if (! Auth::check()) {
            return redirect('/login');
        }

        // 2. Ambil role_id user (1: Admin, 2: Expert, 3: User)
        $userRole = Auth::user()->role_id;

        // 3. Mapping nama role ke ID (sesuai database kita)
        $roleMap = [
            'admin' => 1,
            'expert' => 2,
            'user' => 3,
        ];

        // 4. Validasi akses
        foreach ($roles as $role) {
            if (isset($roleMap[$role]) && $userRole == $roleMap[$role]) {
                return $next($request);
            }
        }

        // Jika tidak punya akses, lempar kembali ke dashboard dengan pesan error
        return redirect('/dashboard')->with('error', 'Akses Ditolak! Anda tidak memiliki otoritas.');
    }
}
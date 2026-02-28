<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsUser
{
    /**
     * Vérifier que c'est un utilisateur
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()->role !== 'utilisateur') {
            return response()->json([
                'success' => false,
                'message' => 'Accès réservé aux utilisateurs',
            ], 403);
        }

        return $next($request);
    }
}

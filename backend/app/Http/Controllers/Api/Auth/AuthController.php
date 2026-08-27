<?php

namespace App\Http\Controllers\Api\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

/**
 * Sanctum token auth (Bearer header), not cookie/session - the frontend and
 * API can live on different domains (e.g. separate free hosts), where
 * cross-site session cookies are increasingly blocked by browsers.
 */
class AuthController extends Controller
{
    /**
     * Public registration always creates a `client` account (cahier §2.1) —
     * livreur/admin accounts can only be provisioned by an admin.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            ...$request->validated(),
            'password' => $request->validated('password'),
            'role' => UserRole::Client,
            'is_active' => true,
        ]);

        return response()->json([
            'user' => new UserResource($user),
            'token' => $user->createToken('spa')->plainTextToken,
            'redirect_to' => $this->redirectFor($user->role),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ["Ces identifiants ne correspondent à aucun compte."],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Ce compte est désactivé. Contactez le support.'],
            ]);
        }

        return response()->json([
            'user' => new UserResource($user),
            'token' => $user->createToken('spa')->plainTextToken,
            'redirect_to' => $this->redirectFor($user->role),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var \Laravel\Sanctum\PersonalAccessToken $token */
        $token = $request->user()->currentAccessToken();
        $token?->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $request->user()->update($request->validated());

        return response()->json(['user' => new UserResource($request->user()->fresh())]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 422);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill(['password' => $password])->save();
                $user->tokens()->delete();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 422);
    }

    private function redirectFor(UserRole $role): string
    {
        return match ($role) {
            UserRole::Client => '/client',
            UserRole::Livreur => '/livreur',
            UserRole::Admin => '/admin',
        };
    }
}

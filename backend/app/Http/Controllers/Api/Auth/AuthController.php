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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
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

    /**
     * "Se connecter avec Google" (Google Identity Services one-tap/button
     * flow): the frontend hands us the signed ID token straight from
     * Google, we verify it with Google's own tokeninfo endpoint rather than
     * trusting anything the client claims. Google-authenticated accounts
     * rely on Google's own password reset and 2-factor security - we don't
     * duplicate that here, and existing accounts are linked by email.
     */
    public function google(Request $request): JsonResponse
    {
        $data = $request->validate(['credential' => ['required', 'string']]);

        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $data['credential'],
        ]);

        if (! $response->successful()) {
            throw ValidationException::withMessages([
                'credential' => ["Connexion Google impossible : le jeton est invalide ou a expiré. Réessayez."],
            ]);
        }

        $payload = $response->json();
        $expectedClientId = config('services.google.client_id');

        if (! $expectedClientId || ($payload['aud'] ?? null) !== $expectedClientId) {
            throw ValidationException::withMessages([
                'credential' => ['Connexion Google impossible : configuration du serveur invalide.'],
            ]);
        }

        if (($payload['email_verified'] ?? 'false') !== 'true') {
            throw ValidationException::withMessages([
                'credential' => ["Votre adresse email Google doit être vérifiée pour vous connecter."],
            ]);
        }

        $googleId = $payload['sub'];
        $email = $payload['email'];

        $user = User::where('google_id', $googleId)->first()
            ?? User::where('email', $email)->first();

        if ($user) {
            if (! $user->google_id) {
                $user->update(['google_id' => $googleId]);
            }
        } else {
            $user = User::create([
                'first_name' => $payload['given_name'] ?? 'Compte',
                'last_name' => $payload['family_name'] ?? 'Google',
                'phone' => null,
                'email' => $email,
                'password' => Hash::make(Str::random(40)),
                'role' => UserRole::Client,
                'is_active' => true,
                'google_id' => $googleId,
                'email_verified_at' => now(),
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'credential' => ['Ce compte est désactivé. Contactez le support.'],
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

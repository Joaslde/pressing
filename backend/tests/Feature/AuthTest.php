<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Http;

it('registers a new client account', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'Awa',
        'last_name' => 'Diallo',
        'phone' => '+229 90 00 00 01',
        'email' => 'awa@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertCreated()
        ->assertJsonPath('user.role', 'client')
        ->assertJsonPath('redirect_to', '/client')
        ->assertJsonStructure(['token']);

    $this->assertDatabaseHas('users', ['email' => 'awa@example.com', 'role' => 'client']);
});

it('cannot register with a role other than client', function () {
    // The public register endpoint has no `role` input at all - this proves
    // the server always forces `client` regardless of what's posted (cahier §2.1).
    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'Awa',
        'last_name' => 'Diallo',
        'phone' => '+229 90 00 00 02',
        'email' => 'awa2@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'admin',
    ]);

    $response->assertCreated()->assertJsonPath('user.role', 'client');
});

it('logs in and redirects according to role', function (UserRole $role, string $expectedRedirect) {
    $user = User::factory()->create(['role' => $role, 'password' => 'password123']);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertOk()
        ->assertJsonPath('redirect_to', $expectedRedirect)
        ->assertJsonStructure(['token']);
})->with([
    'client' => [UserRole::Client, '/client'],
    'livreur' => [UserRole::Livreur, '/livreur'],
    'admin' => [UserRole::Admin, '/admin'],
]);

it('rejects invalid credentials', function () {
    User::factory()->create(['email' => 'a@example.com', 'password' => 'password123']);

    $this->postJson('/api/v1/auth/login', ['email' => 'a@example.com', 'password' => 'wrong'])
        ->assertUnprocessable();
});

it('blocks login for a deactivated account', function () {
    $user = User::factory()->create(['password' => 'password123', 'is_active' => false]);

    $this->postJson('/api/v1/auth/login', ['email' => $user->email, 'password' => 'password123'])
        ->assertUnprocessable();
});

it('sends a password reset link without a server error', function () {
    // Regression test: the default ResetPassword notification builds its
    // link via route('password.reset'), a named web route this API-only
    // app doesn't have - that used to 500. MAIL_MAILER=array in testing
    // still fully renders the notification's toMail(), so this exercises
    // the same code path that failed.
    $user = User::factory()->create();

    $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email])
        ->assertOk();

    $this->assertDatabaseHas('password_reset_tokens', ['email' => $user->email]);
});

it('logs in with Google, creating a new account on first sign-in', function () {
    config(['services.google.client_id' => 'test-client-id.apps.googleusercontent.com']);

    Http::fake([
        'oauth2.googleapis.com/*' => Http::response([
            'aud' => 'test-client-id.apps.googleusercontent.com',
            'sub' => 'google-user-123',
            'email' => 'nouvelle@example.com',
            'email_verified' => 'true',
            'given_name' => 'Awa',
            'family_name' => 'Diallo',
        ], 200),
    ]);

    $response = $this->postJson('/api/v1/auth/google', ['credential' => 'fake-id-token']);

    $response->assertOk()
        ->assertJsonPath('user.role', 'client')
        ->assertJsonPath('redirect_to', '/client')
        ->assertJsonStructure(['token']);

    $this->assertDatabaseHas('users', [
        'email' => 'nouvelle@example.com',
        'google_id' => 'google-user-123',
        'phone' => null,
    ]);
});

it('links Google sign-in to an existing account with the same email', function () {
    config(['services.google.client_id' => 'test-client-id.apps.googleusercontent.com']);
    $user = User::factory()->create(['email' => 'existant@example.com']);

    Http::fake([
        'oauth2.googleapis.com/*' => Http::response([
            'aud' => 'test-client-id.apps.googleusercontent.com',
            'sub' => 'google-user-456',
            'email' => 'existant@example.com',
            'email_verified' => 'true',
        ], 200),
    ]);

    $this->postJson('/api/v1/auth/google', ['credential' => 'fake-id-token'])
        ->assertOk()
        ->assertJsonPath('user.id', $user->id);

    $this->assertDatabaseHas('users', ['id' => $user->id, 'google_id' => 'google-user-456']);
    // Still only one account for this email - no duplicate created.
    $this->assertDatabaseCount('users', 1);
});

it('rejects a Google token meant for a different app', function () {
    config(['services.google.client_id' => 'test-client-id.apps.googleusercontent.com']);

    Http::fake([
        'oauth2.googleapis.com/*' => Http::response([
            'aud' => 'someone-elses-client-id.apps.googleusercontent.com',
            'sub' => 'google-user-789',
            'email' => 'quelquun@example.com',
            'email_verified' => 'true',
        ], 200),
    ]);

    $this->postJson('/api/v1/auth/google', ['credential' => 'fake-id-token'])
        ->assertUnprocessable();

    $this->assertDatabaseMissing('users', ['email' => 'quelquun@example.com']);
});

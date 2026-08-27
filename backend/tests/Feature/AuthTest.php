<?php

use App\Enums\UserRole;
use App\Models\User;

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

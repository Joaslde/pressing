<?php

use App\Enums\UserRole;
use App\Models\User;

it('blocks non-admins from admin routes', function (UserRole $role) {
    $user = User::factory()->create(['role' => $role]);

    $this->actingAs($user)->getJson('/api/v1/admin/dashboard')->assertForbidden();
})->with([
    'client' => [UserRole::Client],
    'livreur' => [UserRole::Livreur],
]);

it('allows admins to reach admin routes', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    $this->actingAs($admin)->getJson('/api/v1/admin/dashboard')->assertOk();
});

it('blocks non-livreurs from livreur routes', function (UserRole $role) {
    $user = User::factory()->create(['role' => $role]);

    $this->actingAs($user)->getJson('/api/v1/livreur/dashboard')->assertForbidden();
})->with([
    'client' => [UserRole::Client],
    'admin' => [UserRole::Admin],
]);

it('rejects unauthenticated requests to protected routes', function () {
    $this->getJson('/api/v1/orders')->assertUnauthorized();
    $this->getJson('/api/v1/admin/dashboard')->assertUnauthorized();
    $this->getJson('/api/v1/livreur/dashboard')->assertUnauthorized();
});

it('exposes the public catalog without authentication', function () {
    $this->getJson('/api/v1/services')->assertOk();
    $this->getJson('/api/v1/articles')->assertOk();
    $this->getJson('/api/v1/fees')->assertOk();
});

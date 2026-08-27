<?php

namespace App\Policies;

use App\Models\Assignment;
use App\Models\User;

class AssignmentPolicy
{
    public function view(User $user, Assignment $assignment): bool
    {
        return $user->isAdmin() || $this->belongsToUser($user, $assignment);
    }

    public function update(User $user, Assignment $assignment): bool
    {
        return $this->belongsToUser($user, $assignment);
    }

    private function belongsToUser(User $user, Assignment $assignment): bool
    {
        return $user->deliveryPerson && $user->deliveryPerson->id === $assignment->delivery_person_id;
    }
}

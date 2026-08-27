<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    /**
     * The app now uses Sanctum token auth (Bearer header), not cookies - so
     * `$this->actingAs($user)` (used throughout the test suite) is routed
     * through Sanctum::actingAs() to authenticate as a token would, unless a
     * specific non-Sanctum guard is requested.
     */
    public function actingAs($user, $guard = null)
    {
        if ($guard === null) {
            Sanctum::actingAs($user, ['*']);

            return $this;
        }

        return parent::actingAs($user, $guard);
    }
}

<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Accepts digits with optional leading "+" and spaces/dashes as separators
 * (e.g. "+229 01 00 00 00", "0100000000"), requiring 8-15 actual digits -
 * the E.164 international range. Rejects clearly-too-short input like "0128"
 * that the plain string|max rules previously let through.
 */
class ValidPhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! preg_match('/^\+?[0-9][0-9\s-]*$/', $value)) {
            $fail('Le champ :attribute doit être un numéro de téléphone valide.');

            return;
        }

        $digitCount = strlen(preg_replace('/\D/', '', $value));

        if ($digitCount < 8 || $digitCount > 15) {
            $fail('Le champ :attribute doit contenir entre 8 et 15 chiffres.');
        }
    }
}

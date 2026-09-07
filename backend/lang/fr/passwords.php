<?php

// French translations for Laravel's built-in password reset messages
// (used via __($status) in AuthController::forgotPassword/resetPassword).
// This app never shipped lang/en either - without this file, these fell
// back to the framework's default English strings despite APP_LOCALE=fr.

return [
    'reset' => "Votre mot de passe a été réinitialisé.",
    'sent' => "Nous venons de vous envoyer par email un lien de réinitialisation.",
    'throttled' => "Veuillez patienter avant de réessayer.",
    'token' => "Ce lien de réinitialisation est invalide ou a expiré.",
    'user' => "Nous ne trouvons aucun compte associé à cette adresse email.",
];

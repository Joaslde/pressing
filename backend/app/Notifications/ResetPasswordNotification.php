<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordBase;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * Laravel's default ResetPassword notification builds its link via
 * route('password.reset', ...), a named web route this API-only app doesn't
 * have - that threw a RouteNotFoundException and turned "mot de passe
 * oublié" into a 500. This points the link at the frontend's own reset page
 * instead, carrying the token/email as query params (see
 * ResetPasswordPage.tsx).
 */
class ResetPasswordNotification extends ResetPasswordBase
{
    public function toMail(mixed $notifiable): MailMessage
    {
        $url = rtrim(config('app.frontend_url'), '/').'/reinitialiser-mot-de-passe?'.http_build_query([
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ]);

        return (new MailMessage)
            ->subject('Réinitialisation de votre mot de passe X-Pressing')
            ->line('Vous recevez cet email car une réinitialisation de mot de passe a été demandée pour votre compte.')
            ->action('Réinitialiser le mot de passe', $url)
            ->line('Ce lien expire dans 60 minutes.')
            ->line("Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.");
    }
}

<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Commande {$this->order->order_number} - {$this->order->status->label()}")
            ->greeting("Bonjour {$notifiable->first_name},")
            ->line("Le statut de votre commande {$this->order->order_number} a changé : {$this->order->status->label()}.")
            ->action('Voir ma commande', rtrim(config('app.frontend_url'), '/')."/client/orders/{$this->order->id}")
            ->line('Merci de votre confiance envers X-Pressing.');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'status' => $this->order->status->value,
            'status_label' => $this->order->status->label(),
        ];
    }
}

<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\FacilityMedicationInventory;

class LowStockAlert extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public FacilityMedicationInventory $inventory
    ) {
        $this->onQueue('notifications');
        $this->tries = 3;
        $this->timeout = 60;
    }

    public function via($notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'inventory_id' => $this->inventory->inventory_id,
            'medication_name' => $this->inventory->medication->name ?? 'Unknown',
            'current_stock' => $this->inventory->current_stock,
            'minimum_stock_level' => $this->inventory->minimum_stock_level,
            'facility_name' => $this->inventory->healthcare_facilities->name ?? 'Unknown',
            'reorder_point' => $this->inventory->reorder_point,
            'action_url' => route('inventory.show', $this->inventory->inventory_id),
        ];
    }

    public function toMail($notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Low Stock Alert - ' . ($this->inventory->medication->name ?? 'Medication'))
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('The medication **' . ($this->inventory->medication->name ?? 'Unknown') . '** at **' . ($this->inventory->healthcare_facilities->name ?? 'Unknown') . '** has reached low stock levels.')
            ->line('Current Stock: ' . $this->inventory->current_stock)
            ->line('Minimum Required: ' . $this->inventory->minimum_stock_level)
            ->line('Reorder Point: ' . $this->inventory->reorder_point)
            ->action('View Inventory', route('inventory.show', $this->inventory->inventory_id))
            ->line('Please reorder this medication as soon as possible.');
    }
}

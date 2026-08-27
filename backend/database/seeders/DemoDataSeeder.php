<?php

namespace Database\Seeders;

use App\Enums\DeliveryPersonStatus;
use App\Enums\FeeType;
use App\Enums\UserRole;
use App\Models\Article;
use App\Models\DeliveryPerson;
use App\Models\Fee;
use App\Models\Service;
use App\Models\TimeSlot;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Demo catalog + accounts so the app is usable end-to-end without manual
 * admin setup. Mirrors the service/article examples from the cahier (§5, §6).
 */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'X-Pressing',
            'phone' => '+229 01 00 00 00',
            'email' => 'admin@x-pressing.example',
            'role' => UserRole::Admin,
        ]);

        collect([
            ['first_name' => 'Ali', 'last_name' => 'Koffi', 'phone' => '+229 01 00 00 01', 'email' => 'ali.koffi@x-pressing.example'],
            ['first_name' => 'Fatima', 'last_name' => 'Sanni', 'phone' => '+229 01 00 00 02', 'email' => 'fatima.sanni@x-pressing.example'],
        ])->each(function (array $attrs) {
            $user = User::factory()->create([...$attrs, 'role' => UserRole::Livreur]);
            DeliveryPerson::create([
                'user_id' => $user->id,
                'status' => DeliveryPersonStatus::Available,
            ]);
        });

        User::factory()->create([
            'first_name' => 'Client',
            'last_name' => 'Démo',
            'phone' => '+229 01 00 00 03',
            'email' => 'client@x-pressing.example',
            'role' => UserRole::Client,
        ]);

        collect([
            [
                'name' => 'Lavage - Lessive à la main',
                'treatment_type' => 'hand_wash',
                'description' => "Lavage manuel, rinçage, séchage selon le traitement prévu et préparation pour restitution.",
            ],
            [
                'name' => 'Lavage + Repassage',
                'treatment_type' => 'wash_and_iron',
                'description' => 'Lavage, séchage, repassage et préparation des vêtements pour livraison.',
            ],
            [
                'name' => 'Repassage uniquement',
                'treatment_type' => 'iron_only',
                'description' => 'Réception des vêtements, repassage, pliage ou préparation, restitution au client.',
            ],
            [
                'name' => 'Nettoyage à sec - Lavage en machine',
                'treatment_type' => 'dry_clean',
                'description' => 'Traitement en machine adapté aux vêtements délicats nécessitant un nettoyage à sec.',
            ],
        ])->each(fn (array $attrs) => Service::create([
            ...$attrs,
            'slug' => Str::slug($attrs['name']),
            'is_active' => true,
        ]));

        collect([
            ['name' => 'Chemise', 'price' => 1000],
            ['name' => 'Pantalon', 'price' => 1500],
            ['name' => 'Robe', 'price' => 2000],
            ['name' => 'Costume', 'price' => 3500],
            ['name' => 'Jupe', 'price' => 1500],
            ['name' => 'Veste', 'price' => 2500],
            ['name' => 'Drap', 'price' => 2000],
        ])->each(fn (array $attrs) => Article::create([...$attrs, 'is_active' => true]));

        // Flat rate for the whole current coverage zone (Cotonou, Calavi, Fifadji,
        // Godomey and surroundings) - zone-based pricing can be added later if the
        // pressing expands beyond this area.
        Fee::create(['type' => FeeType::Pickup, 'label' => 'Frais de collecte (Cotonou, Calavi et environs)', 'amount' => 1000, 'is_active' => true]);
        Fee::create(['type' => FeeType::Delivery, 'label' => 'Frais de livraison (Cotonou, Calavi et environs)', 'amount' => 1000, 'is_active' => true]);

        collect([
            ['label' => '08h - 10h', 'start_time' => '08:00', 'end_time' => '10:00'],
            ['label' => '10h - 12h', 'start_time' => '10:00', 'end_time' => '12:00'],
            ['label' => '14h - 16h', 'start_time' => '14:00', 'end_time' => '16:00'],
            ['label' => '16h - 18h', 'start_time' => '16:00', 'end_time' => '18:00'],
        ])->each(fn (array $attrs) => TimeSlot::create([
            ...$attrs,
            'max_capacity' => 10,
            'is_active' => true,
        ]));
    }
}

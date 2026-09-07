<?php

// French translations for Laravel's built-in validation messages. This
// app never shipped lang/en either, so any rule violation not covered by
// a custom FormRequest message (none of them define one) fell back to the
// framework's default English strings despite APP_LOCALE=fr. Only the
// rules actually used across app/Http/Requests are covered here.

return [

    'required' => "Le champ :attribute est obligatoire.",
    'email' => "Le champ :attribute doit être une adresse email valide.",
    'string' => "Le champ :attribute doit être une chaîne de caractères.",
    'integer' => "Le champ :attribute doit être un nombre entier.",
    'numeric' => "Le champ :attribute doit être un nombre.",
    'boolean' => "Le champ :attribute doit être vrai ou faux.",
    'array' => "Le champ :attribute doit être une liste.",
    'date' => "Le champ :attribute n'est pas une date valide.",
    'confirmed' => "La confirmation du champ :attribute ne correspond pas.",
    'unique' => "Cette valeur du champ :attribute est déjà utilisée.",
    'exists' => "La valeur sélectionnée pour :attribute n'est pas valide.",
    'in' => "La valeur sélectionnée pour :attribute n'est pas valide.",

    'max' => [
        'numeric' => "Le champ :attribute ne doit pas dépasser :max.",
        'string' => "Le champ :attribute ne doit pas dépasser :max caractères.",
        'array' => "Le champ :attribute ne doit pas contenir plus de :max éléments.",
    ],

    'min' => [
        'numeric' => "Le champ :attribute doit être d'au moins :min.",
        'string' => "Le champ :attribute doit contenir au moins :min caractères.",
        'array' => "Le champ :attribute doit contenir au moins :min éléments.",
    ],

    'attributes' => [
        'first_name' => 'prénom',
        'last_name' => 'nom',
        'phone' => 'téléphone',
        'email' => 'email',
        'password' => 'mot de passe',
        'password_confirmation' => 'confirmation du mot de passe',
        'credential' => 'jeton Google',
        'amount' => 'montant',
        'price' => 'prix',
        'quantity' => 'quantité',
        'items' => 'articles',
        'service_id' => 'service',
        'article_id' => 'article',
        'pickup_address_id' => 'adresse de collecte',
        'delivery_address_id' => 'adresse de livraison',
        'time_slot_id' => 'créneau',
        'pickup_date' => 'date de collecte',
        'delivery_person_id' => 'livreur',
        'mission_type' => 'type de mission',
        'status' => 'statut',
        'name' => 'nom',
        'label' => 'libellé',
        'description' => 'description',
        'is_active' => 'statut actif',
        'latitude' => 'latitude',
        'longitude' => 'longitude',
        'city' => 'ville',
        'full_address' => 'adresse complète',
        'instructions' => 'instructions',
    ],

];

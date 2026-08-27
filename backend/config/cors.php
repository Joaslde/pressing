<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    // Comma-separated list in .env so local dev + the deployed frontend can
    // both call the API (e.g. "http://localhost:5173,https://x-pressing.vercel.app").
    'allowed_origins' => array_filter(explode(',', env('FRONTEND_URLS', env('FRONTEND_URL', 'http://localhost:5173')))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Bearer-token auth (see AuthController) - no cookies involved, so no
    // need for credentialed CORS requests.
    'supports_credentials' => false,

];

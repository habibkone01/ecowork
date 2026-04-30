<?php

use Dedoc\Scramble\Http\Middleware\RestrictedDocsAccess;

return [
    'api_path' => 'api',
    'api_domain' => null,
    'export_path' => 'api.json',
    'info' => [
        'version' => env('API_VERSION', '1.0.0'),
        'description' => '# EcoWork API
API de gestion des espaces de coworking GreenSpace.
## Authentification
Cette API utilise **Laravel Sanctum** pour l\'authentification.
Incluez le token dans le header de chaque requête :
Authorization: Bearer {token}
## Rôles
- **utilisateur** : peut consulter les espaces et gérer ses réservations
- **admin** : accès complet à toutes les ressources',
    ],
    'ui' => [
        'title' => 'EcoWork API Documentation',
        'theme' => 'light',
        'hide_try_it' => false,
        'hide_schemas' => false,
        'logo' => '',
        'try_it_credentials_policy' => 'include',
        'layout' => 'responsive',
    ],
    'servers' => null,
    'enum_cases_description_strategy' => 'description',
    'enum_cases_names_strategy' => false,
    'flatten_deep_query_parameters' => true,
    'middleware' => [
        'web',
        // RestrictedDocsAccess::class,
    ],
    'extensions' => [],
];

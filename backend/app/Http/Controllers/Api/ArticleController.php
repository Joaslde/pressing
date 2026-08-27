<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class ArticleController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $articles = Cache::remember('catalog:articles', now()->addHour(), function () {
            return Article::where('is_active', true)->orderBy('name')->get();
        });

        return ArticleResource::collection($articles);
    }
}

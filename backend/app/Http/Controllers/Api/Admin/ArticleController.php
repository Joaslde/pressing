<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArticleRequest;
use App\Http\Requests\Admin\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class ArticleController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ArticleResource::collection(Article::orderBy('name')->get());
    }

    public function store(StoreArticleRequest $request): ArticleResource
    {
        $article = Article::create($request->validated());
        Cache::forget('catalog:articles');

        return new ArticleResource($article);
    }

    public function update(UpdateArticleRequest $request, Article $article): ArticleResource
    {
        $article->update($request->validated());
        Cache::forget('catalog:articles');

        return new ArticleResource($article);
    }

    public function destroy(Article $article): \Illuminate\Http\Response
    {
        $article->update(['is_active' => false]);
        Cache::forget('catalog:articles');

        return response()->noContent();
    }
}

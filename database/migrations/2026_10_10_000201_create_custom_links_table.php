<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ext_custom_links', function (Blueprint $table) {
            $table->id();
            $table->string('label', 60);
            $table->string('url', 500);
            $table->string('icon', 32)->default('link');
            $table->string('placement', 16)->default('console');
            $table->json('egg_ids')->nullable();
            $table->boolean('new_tab')->default(true);
            $table->unsignedSmallInteger('sort')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ext_custom_links');
    }
};

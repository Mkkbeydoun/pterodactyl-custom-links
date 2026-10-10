<?php

use Illuminate\Support\Facades\Route;
use RustixDev\CustomLinks\Http\Controllers\AdminLinkController;

Route::get('/links', [AdminLinkController::class, 'index']);
Route::post('/links', [AdminLinkController::class, 'store']);
Route::patch('/links/{link}', [AdminLinkController::class, 'update'])->whereNumber('link');
Route::delete('/links/{link}', [AdminLinkController::class, 'destroy'])->whereNumber('link');
Route::get('/eggs', [AdminLinkController::class, 'eggs']);

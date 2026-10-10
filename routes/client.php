<?php

use Illuminate\Support\Facades\Route;
use RustixDev\CustomLinks\Http\Controllers\LinkController;

Route::get('/links', [LinkController::class, 'dashboard']);

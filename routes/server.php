<?php

use Illuminate\Support\Facades\Route;
use RustixDev\CustomLinks\Http\Controllers\LinkController;

// Anyone who can see the server sees its links, like the server name itself.
Route::get('/links', [LinkController::class, 'server']);

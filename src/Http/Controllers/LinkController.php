<?php

namespace RustixDev\CustomLinks\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Pterodactyl\Models\Server;
use RustixDev\CustomLinks\Models\CustomLink;

class LinkController
{
    /** Dashboard links. Server placeholders are left out because there is no server here. */
    public function dashboard(Request $request): JsonResponse
    {
        $links = CustomLink::query()->where('placement', 'dashboard')->orderBy('sort')->orderBy('id')->get();

        return new JsonResponse([
            'data' => $links->map(fn (CustomLink $link) => $link->toClientPayload($request->user()))->filter()->values(),
        ]);
    }

    /** Console and navigation links for one server, filtered by its egg and with placeholders filled in. */
    public function server(Request $request, Server $server): JsonResponse
    {
        $server->loadMissing('allocation');

        $links = CustomLink::query()
            ->whereIn('placement', ['console', 'navigation'])
            ->orderBy('sort')
            ->orderBy('id')
            ->get()
            ->filter(fn (CustomLink $link) => $link->appliesTo($server));

        return new JsonResponse([
            'data' => $links->map(fn (CustomLink $link) => $link->toClientPayload($request->user(), $server))->filter()->values(),
        ]);
    }
}

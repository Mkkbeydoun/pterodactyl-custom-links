<?php

namespace RustixDev\CustomLinks\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
use Pterodactyl\Models\Egg;
use RustixDev\CustomLinks\Models\CustomLink;

class AdminLinkController
{
    public function index(): JsonResponse
    {
        $links = CustomLink::query()->orderBy('sort')->orderBy('id')->get();

        return new JsonResponse(['data' => $links->map->toAdminPayload()->values()]);
    }

    public function eggs(): JsonResponse
    {
        return new JsonResponse([
            'data' => Egg::query()->orderBy('name')->get(['id', 'name'])->map(fn (Egg $e) => ['id' => $e->id, 'name' => $e->name])->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $link = CustomLink::query()->create($this->validated($request));

        return new JsonResponse(['data' => $link->toAdminPayload()], 201);
    }

    public function update(Request $request, int $link): JsonResponse
    {
        $model = CustomLink::query()->findOrFail($link);
        $model->update($this->validated($request));

        return new JsonResponse(['data' => $model->refresh()->toAdminPayload()]);
    }

    public function destroy(int $link): Response
    {
        CustomLink::query()->findOrFail($link)->delete();

        return new Response('', 204);
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:60'],
            'url' => ['required', 'string', 'max:500', function (string $attribute, mixed $value, \Closure $fail) {
                if (! is_string($value) || ! CustomLink::hasAllowedScheme($value)) {
                    $fail('The link must start with http://, https:// or steam://.');
                }
            }],
            'icon' => ['required', 'string', 'regex:/^[a-z0-9]+(-[a-z0-9]+)*$/', 'max:32'],
            'placement' => ['required', Rule::in(CustomLink::PLACEMENTS)],
            'egg_ids' => ['array', 'max:200'],
            'egg_ids.*' => ['integer', 'min:1'],
            'new_tab' => ['boolean'],
            'sort' => ['integer', 'min:0', 'max:1000'],
        ]);

        $eggs = array_values(array_unique(array_map('intval', $data['egg_ids'] ?? [])));
        $data['egg_ids'] = $data['placement'] === 'dashboard' || $eggs === [] ? null : $eggs;
        $data['new_tab'] = (bool) ($data['new_tab'] ?? true);
        $data['sort'] = (int) ($data['sort'] ?? 0);

        return $data;
    }
}

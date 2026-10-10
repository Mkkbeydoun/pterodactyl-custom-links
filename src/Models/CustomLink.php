<?php

namespace RustixDev\CustomLinks\Models;

use Illuminate\Database\Eloquent\Model;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\User;

/**
 * @property int $id
 * @property string $label
 * @property string $url
 * @property string $icon
 * @property string $placement
 * @property list<int>|null $egg_ids
 * @property bool $new_tab
 * @property int $sort
 */
class CustomLink extends Model
{
    protected $table = 'ext_custom_links';

    protected $fillable = ['label', 'url', 'icon', 'placement', 'egg_ids', 'new_tab', 'sort'];

    /** console: a button row above the server console. navigation: the server's tab bar. dashboard: above the server list. */
    public const array PLACEMENTS = ['console', 'navigation', 'dashboard'];

    /** Schemes a link may use, before and after placeholders are filled in. */
    public const array SCHEMES = ['http', 'https', 'steam'];

    protected function casts(): array
    {
        return [
            'egg_ids' => 'array',
            'new_tab' => 'boolean',
            'sort' => 'integer',
        ];
    }

    public function appliesTo(Server $server): bool
    {
        return empty($this->egg_ids) || in_array($server->egg_id, $this->egg_ids, true);
    }

    public static function hasAllowedScheme(string $url): bool
    {
        $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));

        return in_array($scheme, self::SCHEMES, true);
    }

    /**
     * Fills in {server.*} and {user.*} placeholders. Values are URL-encoded, so a
     * server name cannot change the link's scheme or host.
     */
    public function resolveUrl(User $user, ?Server $server = null): ?string
    {
        $values = ['{user.username}' => $user->username];

        if ($server !== null) {
            $allocation = $server->allocation;
            $values += [
                '{server.name}' => $server->name,
                '{server.uuid}' => $server->uuid,
                '{server.identifier}' => config('pterodactyl.features.new_server_identifiers') ? $server->identifier : $server->uuidShort,
                '{server.ip}' => $allocation ? ($allocation->ip_alias ?: $allocation->ip) : '',
                '{server.port}' => $allocation ? (string) $allocation->port : '',
            ];
        }

        $url = strtr($this->url, array_map(fn (string $value) => rawurlencode($value), $values));

        return self::hasAllowedScheme($url) ? $url : null;
    }

    /** @return array<string, mixed> */
    public function toAdminPayload(): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'url' => $this->url,
            'icon' => $this->icon,
            'placement' => $this->placement,
            'egg_ids' => $this->egg_ids ?? [],
            'new_tab' => $this->new_tab,
            'sort' => $this->sort,
        ];
    }

    /** @return array<string, mixed>|null */
    public function toClientPayload(User $user, ?Server $server = null): ?array
    {
        $url = $this->resolveUrl($user, $server);

        return $url === null ? null : [
            'id' => $this->id,
            'label' => $this->label,
            'url' => $url,
            'icon' => $this->icon,
            'placement' => $this->placement,
            'new_tab' => $this->new_tab,
        ];
    }
}

<?php

namespace RustixDev\CustomLinks\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Pterodactyl\Models\Allocation;
use Pterodactyl\Models\Server;

/**
 * The server's domain from the Domains extension, when that extension is installed.
 * Only its table is read, so Custom Links works the same without it.
 */
final class ServerDomain
{
    public const string TABLE = 'ext_domains_domains';

    /** DNS states in which the domain points at the server. */
    public const array LIVE = ['active', 'verified'];

    /** Answers per server object, so a page of links asks the database once. */
    private static ?\WeakMap $cache = null;

    /**
     * The working domain for the allocation (a domain without an allocation counts
     * for the primary one), oldest first, or null when there is none.
     */
    public static function forAllocation(Server $server, Allocation $allocation): ?string
    {
        self::$cache ??= new \WeakMap();
        $known = self::$cache[$server] ?? [];
        if (! array_key_exists($allocation->id, $known)) {
            $known[$allocation->id] = self::lookup($server, $allocation);
            self::$cache[$server] = $known;
        }

        return $known[$allocation->id];
    }

    private static function lookup(Server $server, Allocation $allocation): ?string
    {
        try {
            if (! Schema::hasTable(self::TABLE)) {
                return null;
            }

            $name = DB::table(self::TABLE)
                ->where('server_id', $server->id)
                ->whereIn('dns_status', self::LIVE)
                ->where(function ($query) use ($server, $allocation) {
                    $query->where('allocation_id', $allocation->id);
                    if ($allocation->id === $server->allocation_id) {
                        $query->orWhereNull('allocation_id');
                    }
                })
                ->orderBy('id')
                ->value('name');
        } catch (\Throwable) {
            return null;
        }

        return is_string($name) && $name !== '' ? $name : null;
    }
}

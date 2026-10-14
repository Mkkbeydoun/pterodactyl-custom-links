# Custom Links

Add your own buttons and links to server pages and the dashboard: wikis, Discord, map viewers, store pages. Show them on every server or only on chosen eggs.

## Features

- **Three places to show links**: a button row above the server console, extra tabs in the server's menu, and a button row above the server list on the dashboard.
- **Per-egg targeting**: show a link on every server, or only on servers using chosen eggs (a map viewer for Rust, a mod list for Minecraft).
- **Placeholders** filled in for each server: `{server.name}`, `{server.domain}`, `{server.ip}`, `{server.port}`, `{server.uuid}`, `{server.identifier}` and `{user.username}`. Values are URL-encoded, so a server name can't change where a link goes.
- **`{server.domain}`** is the server's domain from the [Domains](https://github.com/Rustix-Development/pterodactyl-domains) extension, such as `play.example.com`. When the server has no working domain, or Domains is not installed, it is the same as `{server.ip}`.
- **Safe links only**: http, https and `steam://` (for one-click joins like `steam://connect/{server.ip}:{server.port}`). Anything else is rejected when saving and again after placeholders are filled in.
- **Any icon** from the panel's icon set, an order number, and a choice of opening in a new tab.
- **Admin page** at **Admin → Custom Links**.

## API

| Method | Path | Who |
|---|---|---|
| GET | `/api/client/extensions/custom-links/links` | Any signed-in user (dashboard links) |
| GET | `/api/client/servers/{server}/extensions/custom-links/links` | Anyone who can see the server |
| GET, POST | `/api/admin/extensions/custom-links/links` | Root admins |
| PATCH, DELETE | `/api/admin/extensions/custom-links/links/{id}` | Root admins |

## Requirements

- Pterodactyl Panel v2.0.0-beta.1 or later
- PHP 8.3+

## Install

1. Download `custom-links-<version>.pteroext` from the [latest release](https://github.com/Rustix-Development/pterodactyl-custom-links/releases/latest).
2. In the panel, open **Admin → Extensions**, upload the file and enable it.
3. Reload the panel.

From a terminal instead:

```sh
php artisan p:extension:install /path/to/custom-links-<version>.pteroext --enable
```

## Build from source

```sh
npm install
npm run typecheck
npm test
npm run build
php artisan p:extension:doctor /path/to/custom-links
php artisan p:extension:pack /path/to/custom-links
```

## Uninstall

Remove it under **Admin → Extensions**, or from a terminal:

```sh
php artisan p:extension:remove custom-links
```

## License

MIT. See [LICENSE](LICENSE).

This is a community extension and is not affiliated with or endorsed by Pterodactyl.

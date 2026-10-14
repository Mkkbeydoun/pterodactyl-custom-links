Add your own buttons and links to server pages and the dashboard: wikis, Discord, map viewers, store pages. Show them on every server or only on chosen eggs.

## Install

Download `custom-links-${VERSION}.pteroext` below, then upload it under **Admin → Extensions** and enable it. From a terminal instead:

```sh
php artisan p:extension:install /path/to/custom-links-${VERSION}.pteroext --enable
```

### What's new in ${VERSION}

- New `{server.domain}` placeholder, filled with the server's domain from the Domains extension or its IP when it has none.
- Links look like the panel's own buttons and line up with the other extensions above the console.

Requires Pterodactyl Panel v2.0.0-beta.1 or later and PHP 8.3+. See the README for features and settings.

This is a community extension and is not affiliated with or endorsed by Pterodactyl.

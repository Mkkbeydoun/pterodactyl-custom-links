<?php

namespace RustixDev\CustomLinks;

use Pterodactyl\Extensions\ExtensionProvider;

class CustomLinksProvider extends ExtensionProvider
{
    public function boot(): void
    {
        $this->registerApiRoutes();
    }
}

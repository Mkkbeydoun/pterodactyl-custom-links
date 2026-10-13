import { NamedIcon } from '@pterodactyl/sdk';
import type { ClientLink } from '../api';

/** The core secondary Button's look, on a real link so it can be middle-clicked, copied or opened in a new tab. */
const SECONDARY_LINK =
    'rxcl:relative rxcl:inline-block rxcl:rounded-sm rxcl:border rxcl:px-4 rxcl:py-2 rxcl:text-sm rxcl:uppercase rxcl:tracking-wide rxcl:no-underline rxcl:transition-colors rxcl:duration-150 rxcl:border-border rxcl:bg-transparent rxcl:text-foreground rxcl:[&:hover]:border-primary rxcl:[&:hover]:bg-primary rxcl:[&:hover]:text-primary-foreground';

/** A wrapping row of links styled as secondary buttons. Renders nothing when there are none. */
export default function LinkRow({ links, className = '' }: { links: ClientLink[]; className?: string }) {
    if (links.length === 0) return null;

    return (
        <nav aria-label='Links' className={`rxcl:flex rxcl:flex-wrap rxcl:items-center rxcl:gap-2 ${className}`}>
            {links.map((link) => (
                <a
                    key={link.id}
                    href={link.url}
                    {...(link.new_tab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={`${SECONDARY_LINK} rxcl:max-w-full`}
                >
                    <span className='rxcl:inline-flex rxcl:max-w-full rxcl:items-center rxcl:gap-2'>
                        <NamedIcon name={link.icon} size={16} aria-hidden='true' />
                        <span className='rxcl:truncate'>{link.label}</span>
                    </span>
                </a>
            ))}
        </nav>
    );
}

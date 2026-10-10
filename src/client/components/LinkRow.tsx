import { NamedIcon } from '@pterodactyl/sdk';
import type { ClientLink } from '../api';

/** A wrapping row of button-styled links. Renders nothing when there are none. */
export default function LinkRow({ links, className = '' }: { links: ClientLink[]; className?: string }) {
    if (links.length === 0) return null;

    return (
        <nav aria-label='Links' className={`rxcl:flex rxcl:flex-wrap rxcl:gap-2 ${className}`}>
            {links.map((link) => (
                <a
                    key={link.id}
                    href={link.url}
                    {...(link.new_tab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className='rxcl:inline-flex rxcl:min-h-9 rxcl:items-center rxcl:gap-2 rxcl:rounded-md rxcl:border rxcl:border-border rxcl:bg-card rxcl:px-3 rxcl:py-1.5 rxcl:text-sm rxcl:text-card-foreground rxcl:no-underline rxcl:transition-colors rxcl:hover:bg-accent rxcl:hover:text-accent-foreground rxcl:focus-visible:outline-2 rxcl:focus-visible:outline-ring'
                >
                    <NamedIcon name={link.icon} size={16} aria-hidden='true' />
                    <span className='rxcl:truncate'>{link.label}</span>
                </a>
            ))}
        </nav>
    );
}

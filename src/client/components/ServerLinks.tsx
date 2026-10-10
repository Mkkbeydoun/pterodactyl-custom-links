import { useQuery } from '@tanstack/react-query';
import { NamedIcon, type SdkServer as Server } from '@pterodactyl/sdk';
import { serverLinksQuery } from '../api';
import LinkRow from './LinkRow';

const useServerLinks = (server: Server) => {
    const uuid = server.attributes.uuid;
    const { data = [] } = useQuery({ ...serverLinksQuery(uuid), enabled: Boolean(uuid) });

    return data;
};

export function ConsoleLinks({ data: server }: { data: Server }) {
    const links = useServerLinks(server).filter((link) => link.placement === 'console');

    return <LinkRow links={links} className='rxcl:mb-4' />;
}

/** Extra entries in the server's tab bar, after the core tabs. */
export function NavigationLinks({ data: server }: { data: Server }) {
    const links = useServerLinks(server).filter((link) => link.placement === 'navigation');

    return (
        <>
            {links.map((link) => (
                <a
                    key={link.id}
                    href={link.url}
                    {...(link.new_tab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                    <span className='rxcl:inline-flex rxcl:items-center rxcl:gap-2 rxcl:align-top'>
                        <NamedIcon name={link.icon} size={16} aria-hidden='true' />
                        {link.label}
                    </span>
                </a>
            ))}
        </>
    );
}

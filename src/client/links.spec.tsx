import { afterEach, beforeEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createExtensionTestHost, createTestServer } from '@pterodactyl/sdk/testing';
import LinkRow from './components/LinkRow';
import { ConsoleLinks, NavigationLinks } from './components/ServerLinks';
import { serverLinksQuery, type ClientLink } from './api';

const server = createTestServer({ uuid: 'f1a1b2c3-0000-4000-8000-000000000002' });
let host: ReturnType<typeof createExtensionTestHost>;

beforeEach(() => {
    host = createExtensionTestHost({ extensionId: 'custom-links', prefix: 'rxcl', server });
});

afterEach(() => {
    cleanup();
    host.dispose();
});

const link = (overrides: Partial<ClientLink> = {}): ClientLink => ({
    id: 1,
    label: 'Live map',
    url: 'https://map.example.com/?ip=1.2.3.4',
    icon: 'map',
    placement: 'console',
    new_tab: true,
    ...overrides,
});

test('links open in a new tab safely when asked to', async () => {
    render(<LinkRow links={[link(), link({ id: 2, label: 'Wiki', new_tab: false })]} />, { wrapper: host.Wrapper });

    const map = (await screen.findByText('Live map')).closest('a')!;
    expect(map.getAttribute('target')).toBe('_blank');
    expect(map.getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.getByText('Wiki').closest('a')!.getAttribute('target')).toBeNull();
});

test('an empty list renders nothing', async () => {
    render(<LinkRow links={[]} />, { wrapper: host.Wrapper });
    render(<LinkRow links={[link({ label: 'Marker' })]} />, { wrapper: host.Wrapper });

    await screen.findByText('Marker');
    expect(document.querySelectorAll('nav')).toHaveLength(1);
});

test('console and menu slots each show only their own links', async () => {
    host.queryClient.setQueryData(serverLinksQuery(server.attributes.uuid).queryKey, [
        link(),
        link({ id: 2, label: 'Discord', placement: 'navigation', url: 'https://discord.gg/x' }),
    ]);

    render(<ConsoleLinks data={server} />, { wrapper: host.Wrapper });
    expect(await screen.findByText('Live map')).toBeTruthy();
    expect(screen.queryByText('Discord')).toBeNull();
    cleanup();

    render(<NavigationLinks data={server} />, { wrapper: host.Wrapper });
    expect(await screen.findByText('Discord')).toBeTruthy();
    expect(screen.queryByText('Live map')).toBeNull();
});

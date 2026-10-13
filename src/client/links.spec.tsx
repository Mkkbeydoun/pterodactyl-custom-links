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

test('links are real links styled as secondary buttons and open in a new tab safely when asked to', async () => {
    render(<LinkRow links={[link(), link({ id: 2, label: 'Wiki', url: 'https://wiki.example.com', new_tab: false })]} />, {
        wrapper: host.Wrapper,
    });

    const map = (await screen.findByText('Live map')).closest('a')!;
    expect(map.getAttribute('href')).toBe('https://map.example.com/?ip=1.2.3.4');
    expect(map.getAttribute('target')).toBe('_blank');
    expect(map.getAttribute('rel')).toBe('noopener noreferrer');
    expect(map.className.split(' ')).toEqual(expect.arrayContaining(['rxcl:bg-transparent', 'rxcl:border', 'rxcl:px-4', 'rxcl:py-2', 'rxcl:uppercase']));
    expect(map.className).not.toContain('rxcl:bg-primary ');
    const wiki = screen.getByText('Wiki').closest('a')!;
    expect(wiki.getAttribute('href')).toBe('https://wiki.example.com');
    expect(wiki.getAttribute('target')).toBeNull();
    expect(document.querySelector('nav button')).toBeNull();
});

test('the console row has 12px below it and no top margin', async () => {
    host.queryClient.setQueryData(serverLinksQuery(server.attributes.uuid).queryKey, [
        link({ url: 'https://map.example.com/?host=play.example.com' }),
    ]);
    render(<ConsoleLinks data={server} />, { wrapper: host.Wrapper });

    const row = (await screen.findByText('Live map')).closest('nav')!;
    expect(row.className).toContain('rxcl:mb-3');
    expect(row.className).toContain('rxcl:mt-0');
    expect(row.querySelector('a')!.getAttribute('href')).toBe('https://map.example.com/?host=play.example.com');
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

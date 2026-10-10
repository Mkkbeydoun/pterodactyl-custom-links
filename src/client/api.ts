import { queryOptions } from '@tanstack/react-query';
import { http } from '@pterodactyl/sdk';

export type Placement = 'console' | 'navigation' | 'dashboard';

export interface ClientLink {
    id: number;
    label: string;
    url: string;
    icon: string;
    placement: Placement;
    new_tab: boolean;
}

export interface AdminLink {
    id: number;
    label: string;
    url: string;
    icon: string;
    placement: Placement;
    egg_ids: number[];
    new_tab: boolean;
    sort: number;
}

export type LinkInput = Omit<AdminLink, 'id'>;

export interface EggOption {
    id: number;
    name: string;
}

const ADMIN = '/api/admin/extensions/custom-links';

export const dashboardLinksQuery = () =>
    queryOptions({
        queryKey: ['custom-links', 'dashboard'],
        queryFn: async () =>
            (await http.get<{ data: ClientLink[] }>('/api/client/extensions/custom-links/links')).data.data,
        staleTime: 5 * 60_000,
    });

export const serverLinksQuery = (uuid: string) =>
    queryOptions({
        queryKey: ['custom-links', 'server', uuid],
        queryFn: async () =>
            (await http.get<{ data: ClientLink[] }>(`/api/client/servers/${uuid}/extensions/custom-links/links`))
                .data.data,
        staleTime: 5 * 60_000,
    });

export const adminLinksQuery = () =>
    queryOptions({
        queryKey: ['custom-links', 'admin'],
        queryFn: async () => (await http.get<{ data: AdminLink[] }>(`${ADMIN}/links`)).data.data,
    });

export const adminEggsQuery = () =>
    queryOptions({
        queryKey: ['custom-links', 'eggs'],
        queryFn: async () => (await http.get<{ data: EggOption[] }>(`${ADMIN}/eggs`)).data.data,
        staleTime: 60_000,
    });

export async function saveLink(input: LinkInput, id?: number): Promise<AdminLink> {
    const response = id
        ? await http.patch<{ data: AdminLink }>(`${ADMIN}/links/${id}`, input)
        : await http.post<{ data: AdminLink }>(`${ADMIN}/links`, input);

    return response.data.data;
}

export async function deleteLink(id: number): Promise<void> {
    await http.delete(`${ADMIN}/links/${id}`);
}

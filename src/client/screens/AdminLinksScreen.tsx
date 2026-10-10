import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Dialog,
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
    httpErrorToHuman,
    NamedIcon,
    PageContentBlock,
    Table,
    toast,
    useExtensionAction,
} from '@pterodactyl/sdk';
import { adminEggsQuery, adminLinksQuery, deleteLink, saveLink, type AdminLink, type LinkInput } from '../api';
import LinkForm from './LinkForm';

const WHERE: Record<AdminLink['placement'], string> = {
    console: 'Server console',
    navigation: 'Server menu',
    dashboard: 'Dashboard',
};

export default function AdminLinksScreen() {
    const client = useQueryClient();
    const { data = [], isFetching } = useQuery(adminLinksQuery());
    const { data: eggs = [] } = useQuery(adminEggsQuery());
    const [editing, setEditing] = useState<AdminLink | null | undefined>(undefined);
    const [deleting, setDeleting] = useState<AdminLink | null>(null);

    const refresh = () => client.invalidateQueries({ queryKey: ['custom-links'] });

    const save = useMutation({
        mutationFn: ({ input, id }: { input: LinkInput; id?: number }) => saveLink(input, id),
        onSuccess: async () => {
            toast.success('Link saved.');
            setEditing(undefined);
            await refresh();
        },
        onError: (error) => toast.error(httpErrorToHuman(error)),
    });

    const remove = useMutation({
        mutationFn: (id: number) => deleteLink(id),
        onSuccess: async () => {
            toast.success('Link deleted.');
            setDeleting(null);
            await refresh();
        },
        onError: (error) => toast.error(httpErrorToHuman(error)),
    });

    const onSubmit = useExtensionAction('save', async (input: LinkInput) => {
        await save.mutateAsync({ input, id: editing?.id });
    });

    const eggNames = (ids: number[]) =>
        ids.length === 0
            ? 'Every server'
            : ids.map((id) => eggs.find((egg) => egg.id === id)?.name ?? `Egg ${id}`).join(', ');

    return (
        <PageContentBlock title='Custom Links'>
            <div className='rxcl:mb-4 rxcl:flex rxcl:items-center rxcl:justify-between rxcl:gap-4'>
                <p className='rxcl:text-sm rxcl:text-muted-foreground'>
                    Buttons and menu tabs for wikis, Discord, map viewers or store pages, on every server or only on
                    chosen eggs.
                </p>
                <Button className='rxcl:shrink-0' onClick={() => setEditing(null)}>
                    New
                </Button>
            </div>

            <Table
                rows={data}
                keyOf={(link) => String(link.id)}
                isFetching={isFetching}
                emptyState={
                    <Empty>
                        <EmptyHeader>
                            <EmptyTitle>No links yet</EmptyTitle>
                            <EmptyDescription>Add one to show it on server pages or the dashboard.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                }
                columns={[
                    {
                        id: 'label',
                        label: 'Label',
                        cell: (link) => (
                            <span className='rxcl:inline-flex rxcl:items-center rxcl:gap-2'>
                                <NamedIcon name={link.icon} size={16} aria-hidden='true' />
                                {link.label}
                            </span>
                        ),
                    },
                    {
                        id: 'url',
                        label: 'Link',
                        cell: (link) => (
                            <span className='rxcl:block rxcl:max-w-xs rxcl:truncate rxcl:font-mono rxcl:text-xs' title={link.url}>
                                {link.url}
                            </span>
                        ),
                    },
                    { id: 'where', label: 'Where', cell: (link) => WHERE[link.placement] },
                    {
                        id: 'eggs',
                        label: 'Servers',
                        cell: (link) => (link.placement === 'dashboard' ? 'Everyone' : eggNames(link.egg_ids)),
                    },
                    { id: 'sort', label: 'Order', cell: (link) => link.sort },
                    {
                        id: 'actions',
                        label: '',
                        cell: (link) => (
                            <div className='rxcl:flex rxcl:justify-end rxcl:gap-2'>
                                <Button size='small' isSecondary onClick={() => setEditing(link)}>
                                    Edit
                                </Button>
                                <Button.Danger size='small' onClick={() => setDeleting(link)}>
                                    Delete
                                </Button.Danger>
                            </div>
                        ),
                    },
                ]}
            />

            <Dialog
                open={editing !== undefined}
                onClose={() => setEditing(undefined)}
                title={editing ? 'Edit link' : 'New link'}
            >
                {editing !== undefined && (
                    <LinkForm
                        initial={editing}
                        pending={save.isPending}
                        onCancel={() => setEditing(undefined)}
                        onSubmit={onSubmit}
                    />
                )}
            </Dialog>

            <Dialog.Confirm
                open={deleting !== null}
                onClose={() => setDeleting(null)}
                title='Delete link?'
                confirm='Delete'
                pending={remove.isPending}
                onConfirmed={() => deleting && remove.mutate(deleting.id)}
            >
                “{deleting?.label}” will disappear from every page it is shown on.
            </Dialog.Confirm>
        </PageContentBlock>
    );
}

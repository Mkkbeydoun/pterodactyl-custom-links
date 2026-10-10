import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Dialog, Input, Label, NamedIcon, Select, Switch } from '@pterodactyl/sdk';
import { adminEggsQuery, type AdminLink, type LinkInput, type Placement } from '../api';

export const PLACEMENTS: { value: Placement; label: string }[] = [
    { value: 'console', label: 'Button above the server console' },
    { value: 'navigation', label: "Tab in the server's menu" },
    { value: 'dashboard', label: 'Button above the server list' },
];

export const ICONS = [
    'link',
    'external-link',
    'book-open',
    'message-circle',
    'map',
    'globe',
    'gamepad-2',
    'life-buoy',
    'file-text',
    'shopping-cart',
    'chart-column',
    'heart',
    'download',
    'users',
];

const PLACEHOLDERS = ['{server.name}', '{server.ip}', '{server.port}', '{server.uuid}', '{server.identifier}', '{user.username}'];

interface Props {
    initial: AdminLink | null;
    pending: boolean;
    onCancel: () => void;
    onSubmit: (input: LinkInput) => void;
}

export default function LinkForm({ initial, pending, onCancel, onSubmit }: Props) {
    const { data: eggs = [] } = useQuery(adminEggsQuery());
    const [label, setLabel] = useState(initial?.label ?? '');
    const [url, setUrl] = useState(initial?.url ?? 'https://');
    const [icon, setIcon] = useState(initial?.icon ?? 'link');
    const [placement, setPlacement] = useState<Placement>(initial?.placement ?? 'console');
    const [eggIds, setEggIds] = useState<number[]>(initial?.egg_ids ?? []);
    const [newTab, setNewTab] = useState(initial?.new_tab ?? true);
    const [sort, setSort] = useState(String(initial?.sort ?? 0));

    const submit = (event: FormEvent) => {
        event.preventDefault();
        onSubmit({
            label: label.trim(),
            url: url.trim(),
            icon,
            placement,
            egg_ids: placement === 'dashboard' ? [] : eggIds,
            new_tab: newTab,
            sort: Number(sort) || 0,
        });
    };

    return (
        <form onSubmit={submit} className='rxcl:flex rxcl:flex-col rxcl:gap-4'>
            <div className='rxcl:grid rxcl:gap-4 rxcl:sm:grid-cols-2'>
                <div>
                    <Label htmlFor='rxcl-label'>Label</Label>
                    <Input id='rxcl-label' value={label} maxLength={60} required onChange={(e) => setLabel(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor='rxcl-icon'>Icon</Label>
                    <Select
                        id='rxcl-icon'
                        value={icon}
                        options={(ICONS.includes(icon) ? ICONS : [icon, ...ICONS]).map((name) => ({
                            value: name,
                            textLabel: name,
                            label: (
                                <span className='rxcl:inline-flex rxcl:items-center rxcl:gap-2'>
                                    <NamedIcon name={name} size={16} aria-hidden='true' />
                                    {name}
                                </span>
                            ),
                        }))}
                        onChange={(v) => setIcon(String(v))}
                    />
                </div>
            </div>
            <div>
                <Label htmlFor='rxcl-url'>Link</Label>
                <Input
                    id='rxcl-url'
                    value={url}
                    maxLength={500}
                    required
                    pattern='^(https?|steam)://.+'
                    title='Start with http://, https:// or steam://'
                    onChange={(e) => setUrl(e.target.value)}
                />
                <p className='rxcl:mt-1 rxcl:text-xs rxcl:text-muted-foreground'>
                    http, https or steam links. Placeholders: {PLACEHOLDERS.join(', ')}.
                </p>
            </div>
            <div className='rxcl:grid rxcl:gap-4 rxcl:sm:grid-cols-[1fr_8rem]'>
                <div>
                    <Label htmlFor='rxcl-placement'>Where</Label>
                    <Select
                        id='rxcl-placement'
                        value={placement}
                        options={PLACEMENTS}
                        onChange={(v) => setPlacement(v as Placement)}
                    />
                </div>
                <div>
                    <Label htmlFor='rxcl-sort'>Order</Label>
                    <Input id='rxcl-sort' type='number' min={0} max={1000} value={sort} onChange={(e) => setSort(e.target.value)} />
                </div>
            </div>
            {placement !== 'dashboard' && (
                <div>
                    <Label htmlFor='rxcl-eggs'>Only for these eggs (empty for every server)</Label>
                    <Select
                        id='rxcl-eggs'
                        multiple
                        value={eggIds}
                        placeholder='Every egg'
                        options={eggs.map((egg) => ({ value: egg.id, label: egg.name, textLabel: egg.name }))}
                        onChange={(v) => setEggIds(v.map(Number))}
                    />
                </div>
            )}
            <Switch checked={newTab} onChange={setNewTab} label='Open in a new tab' />
            <Dialog.Footer>
                <Button isSecondary onClick={onCancel} disabled={pending}>
                    Cancel
                </Button>
                <Button type='submit' isLoading={pending}>
                    Save
                </Button>
            </Dialog.Footer>
        </form>
    );
}

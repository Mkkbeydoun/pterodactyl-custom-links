import { useQuery } from '@tanstack/react-query';
import { dashboardLinksQuery } from '../api';
import LinkRow from './LinkRow';

export default function DashboardLinks() {
    const { data = [] } = useQuery(dashboardLinksQuery());

    return <LinkRow links={data} className='rxcl:mb-4' />;
}

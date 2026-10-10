import './styles.css';
import { definePterodactylExtension } from '@pterodactyl/sdk';
import DashboardLinks from './components/DashboardLinks';
import { ConsoleLinks, NavigationLinks } from './components/ServerLinks';

export default definePterodactylExtension({
    setup({ slots, screens }) {
        slots.register('dashboard.before', DashboardLinks);
        slots.register('server.console.before', ConsoleLinks);
        slots.register('server.navigation.after', NavigationLinks);
        screens.register('manage', () => import('./screens/AdminLinksScreen'));
    },
});

import {
    Breadcrumbs,
    Typography,
    Link
} from '../components/mui';
import { Link as RouterLink } from 'react-router-dom';

export default function BreadcrumbNav({ links }) {
    return (
        <Breadcrumbs>
            {links.map(({ label, to }, idx) =>
                to ? (
                    <Link key={idx} component={RouterLink} to={to} underline="hover">
                        {label}
                    </Link>
                ) : (
                    <Typography key={idx}>{label}</Typography>
                )
            )}
        </Breadcrumbs>
    );
}

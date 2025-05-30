import {
    Button
} from '../components/mui';

export default function PrimaryButton({ children, ...props }) {
    return (
        <Button color="primary" variant="contained" {...props}>
            {children}
        </Button>
    );
}

import {
    TextField
} from '../components/mui';

export default function FormInput({ label, ...props }) {
    return (
        <TextField
            variant="outlined"
            fullWidth
            label={label}
            size="small"
            {...props}
        />
    );
}

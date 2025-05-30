import {
    Container,
    Stack,
} from '../components/mui';

export default function PageContainer({ children }) {
    return (
        <Container maxWidth="md">
            <Stack spacing={3}>
                {children}
            </Stack>
        </Container>
    );
}

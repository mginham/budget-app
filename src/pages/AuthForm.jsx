import { useState } from "react"
import { loginUser, registerUser } from "../services/authService"
import { useNavigate } from "react-router-dom"
import {
    Box,
    Button,
    TextField,
    Typography
} from '../components/mui';

export default function AuthForm() {
    const [isRegistering, setIsRegistering] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [displayName, setDisplayName] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (isRegistering) {
                await registerUser(email, password, displayName)
                alert("Registration successful!")
            } else {
                await loginUser(email, password)
            }

            navigate("/dashboard")
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <Box
            maxWidth={400}
            mx="auto"
            mt={12}
            p={4}
            boxShadow={3}
            borderRadius={2}
            border={1}
            borderColor="#E0E0E0"
            sx={{
                backgroundColor: 'custom.boxBackground'
            }}
        >
            <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                Budget {isRegistering ? "Register" : "Login"}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={2}>
                    {isRegistering && (
                        <TextField
                            label="Display Name"
                            variant="outlined"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            fullWidth
                            autoComplete="off"
                            inputProps={{
                                autoComplete: 'off',
                            }}
                        />
                    )}

                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="off"
                        inputProps={{
                            autoComplete: 'off',
                        }}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="off"
                        inputProps={{
                            autoComplete: 'off',
                        }}
                    />

                    <Button type="submit" fullWidth>
                        {isRegistering ? "Register" : "Login"}
                    </Button>
                </Box>
            </form>

            <Typography mt={3} textAlign="center">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <Button
                    onClick={() => setIsRegistering((prev) => !prev)}
                    variant="text"
                    sx={{ textDecoration: "underline", minWidth: 0, padding: 0 }}
                >
                    {isRegistering ? "Login" : "Register"}
                </Button>
            </Typography>
        </Box>
    );
}

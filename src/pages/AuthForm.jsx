import { useState } from "react"
import { loginUser, registerUser } from "../services/authService"
import { useNavigate } from "react-router-dom"
import { Box, TextField, Button, Typography } from "@mui/material";

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
            borderColor="grey.300"
        >
            <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                {isRegistering ? "Register" : "Login"}
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
                        />
                    )}

                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {isRegistering ? "Register" : "Login"}
                    </Button>
                </Box>
            </form>

            <Typography mt={3} textAlign="center">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <Button
                    onClick={() => setIsRegistering((prev) => !prev)}
                    variant="text"
                    color="primary"
                    sx={{ textDecoration: "underline", minWidth: 0, padding: 0 }}
                >
                    {isRegistering ? "Login" : "Register"}
                </Button>
            </Typography>
        </Box>
    );
}

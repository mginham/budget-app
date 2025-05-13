import { useState } from "react"
import { loginUser, registerUser } from "../services/authService"
import { useNavigate } from "react-router-dom"

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
        <div className="max-w-md mx-auto mt-12 p-4 shadow-lg border rounded">
            <h2 className="text-xl font-bold mb-4">{isRegistering ? "Register" : "Login"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Display Name"
                        className="w-full border p-2"
                        required
                    />
                )}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full border p-2"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border p-2"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full">
                    {isRegistering ? "Register" : "Login"}
                </button>
            </form>

            <p className="mt-4 text-center">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                    type="button"
                    className="text-blue-600 underline"
                    onClick={() => setIsRegistering((prev) => !prev)}
                >
                    {isRegistering ? "Login" : "Register"}
                </button>
            </p>
        </div>
    )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Login() {
    const [username, setUsername] = useState('')
    const login = useAuthStore((state) => state.login)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        // Prevent more submissions
        e.preventDefault()

        // TODO: ?
        if (username.trim()) {
            login(username)
            navigate('/dashboard')
        }
    }

    return (
        <div className='p-4 max-w-sm mx-auto'>
            <h1 className='text-2xl mb-4'>Login</h1>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={ (e) => setUsername(e.target.value) }
                    className='w-full p-2 border rounded'
                />
                <button
                    type='submit'
                    className='w-full bg-blue-600 text-white p-2 rounded'
                >
                    Login
                </button>
            </form>
        </div>
    )
}

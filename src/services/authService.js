import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth"
import { auth } from "../firebase"

export const registerUser = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName })
    return userCredential.user
}

export const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

export const logoutUser = () => signOut(auth)

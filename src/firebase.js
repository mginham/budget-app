import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore" // TODO: delete?

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbpRielJX5LZlLBqMRYt-DA9P2p1Bz7nk",
    authDomain: "mginham-budget-app.firebaseapp.com",
    projectId: "mginham-budget-app",
    storageBucket: "mginham-budget-app.appspot.app",
    messagingSenderId: "492481216015",
    appId: "1:492481216015:web:24da762550aedcc34bed7a"
}

const app = initializeApp(firebaseConfig)

// Use fetch-only mode (no Listen/WebSocket)
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
})

const auth = getAuth(app)

export { auth, db }

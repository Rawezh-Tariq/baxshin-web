import { useState, useEffect, useContext, createContext } from 'react'
import { getAuth, onAuthStateChanged, signOut as signout, User } from "firebase/auth";
import { setCookie, destroyCookie } from 'nookies'

export default function FirebaseAuthContextProvider({ children }: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthData | null>(null);

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => setCookie(null, 'idToken', token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        }))
        user.getIdTokenResult().then((result) => setUser({ tokenResult: result, user }))
      }
      if (!user) setUser(null)
      setLoading(false)
    });
  }, [])

  return <authContext.Provider value={{ user, loading }}>
    {children}
  </authContext.Provider>;
}

export const useAuth = () => useContext(authContext);

export const signOut = async () => {
  const auth = getAuth()
  destroyCookie(null, 'idToken')
  await signout(auth)
}

const authContext = createContext<UserContext>({
  user: null,
  loading: true
});

export type TIdTokenResult = {
  token: string;
  expirationTime: string;
  authTime: string;
  issuedAtTime: string;
  signInProvider: string | null;
  signInSecondFactor: string | null;
  claims: {
    [key: string]: any;
  };
}

type UserContext = {
  user: AuthData | null,
  loading: boolean
}

type AuthData = {
  tokenResult: TIdTokenResult | null,
  user: User,
}
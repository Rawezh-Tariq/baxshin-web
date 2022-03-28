import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from './firebase/firebaseAuthProvider'


export default function PrivateRoute({ protectedRoutes, children }: {
    protectedRoutes: string[],
    children: React.ReactNode
}) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

    useEffect(() => {
        if (!loading && !user && pathIsProtected) {
            router.push({ pathname: '/signin', query: { redirect: router.pathname } });
        }
    }, [loading, user, pathIsProtected, router]);

    if ((loading || !user) && pathIsProtected) {
        return <div>loading</div>;
    }

    return <div>{children}</div>;
}
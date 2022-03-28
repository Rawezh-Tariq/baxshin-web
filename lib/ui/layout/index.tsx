import { FooterSocial } from './footer'
import { HeaderResponsive } from './header';
import { AppShell } from '@mantine/core';
import { useAuth } from '../../firebase/firebaseAuthProvider';

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    let { user, loading } = useAuth();

    return <AppShell
        padding={0}
        header={<HeaderResponsive
            links={[{ link: '/', label: 'Home', }, { link: '/give', label: 'Give', },]}
            user={{
                name: user?.user.displayName ?? user?.user.phoneNumber ?? 'Unknown',
                image: user?.user.photoURL ?? 'https://ui-avatars.com/api/?name=' + user?.user.displayName + '&background=0D8ABC&color=fff',
            }}
            loggedIn={user != null} />
        }
        styles={(theme) => ({
            main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
    >
        <div className='flex flex-col container mx-auto md:w-11/12 lg:w-4/5 '>
            {children}
        </div>
        < FooterSocial />
    </AppShell >
}
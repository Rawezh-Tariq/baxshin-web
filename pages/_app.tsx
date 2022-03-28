import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { getCookie, setCookies } from 'cookies-next'
import { GetServerSidePropsContext } from 'next'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import rtlPlugin from 'stylis-plugin-rtl'
import 'tailwindcss/tailwind.css'
import FirebaseAuthProvider from '../lib/firebase/firebaseAuthProvider'
import '../lib/firebase/firebaseConfig/init'
import Layout from '../lib/ui/layout'
import PrivateRoute from '../lib/privateRoute'
import { GlobalFonts } from '../lib/ui/global'


// the first method into the app
MyApp.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  // get color theme from cookie
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});

function MyApp(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  // pages the needs a logged in user
  const protectedRoutes = ['/give'];
  // theme state
  const [colorScheme, setColorScheme] = useState(props.colorScheme);

  // a method to change color theme and refresh the website
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    // when color scheme is updated save it to cookie
    setCookies('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };


  return <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
    <GlobalFonts />
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{
        colorScheme,
        dir: 'rtl',
        fontFamily: 'NeoSansArabic, sans serif',
      }}
      emotionOptions={{ key: 'rtl', stylisPlugins: [rtlPlugin] }}>
      <NotificationsProvider>
        <FirebaseAuthProvider>
          <Layout >
            <PrivateRoute protectedRoutes={protectedRoutes}>
              <Component {...pageProps} />
            </PrivateRoute>
          </Layout>
        </FirebaseAuthProvider>
      </NotificationsProvider>
    </MantineProvider>
  </ColorSchemeProvider>
}
export default MyApp


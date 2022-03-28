import type { NextPage } from 'next'
import Head from 'next/head'
import { useAuth } from '../lib/firebase/firebaseAuthProvider'

const Give: NextPage = () => {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <>
      <Head>
        <title>Give</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='h-[83vh]'>

      </div>
    </>
  )
}

export default Give

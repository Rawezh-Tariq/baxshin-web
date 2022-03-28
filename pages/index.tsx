import { getDocs } from '@firebase/firestore'
import { Button, Text, Container, createStyles, Grid, Group, Overlay, ScrollArea, Title } from '@mantine/core'
import { limit, query } from 'firebase/firestore'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PlaceListItem } from '../lib/ui/home/place-list-item'
import { useAuth } from '../lib/firebase/firebaseAuthProvider'
import { placesCol } from '../lib/firebase/firestore/db'
import { Place } from '../lib/firebase/firestore/types/place'


const useStyles = createStyles((theme) => ({
  hero: {
    position: 'relative',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1477511801984-4ad318ed9846?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1,
    position: 'relative',

    [theme.fn.smallerThan('sm')]: {
      height: 600,
      // paddingBottom: theme.spacing.xl * 3,
    },
  },

  title: {
    color: theme.white,
    fontSize: 40,
    fontWeight: 900,
    lineHeight: 1.1,
    fontFamily: 'NeoSansArabic',

    [theme.fn.smallerThan('sm')]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28,
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    marginTop: theme.spacing.xl * 1.5,

    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },
}
));

const Home: NextPage = () => {
  const { user } = useAuth();
  const { classes } = useStyles();
  const [places, setPlaces] = useState([] as Array<Place>);

  useEffect(() => {
    fetchPlaces();
  }, [])

  const fetchPlaces = async () => {
    const places = await getDocs(query(placesCol, limit(10)));
    setPlaces(places.docs.map(doc => doc.data()));
  }

  return (
    <>
      <Head>
        <title>بەخشین</title>
      </Head>

      <main >
        <div className={classes.hero} >
          <Overlay
            gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
            opacity={1}
            zIndex={0}
          />
          <Grid className='md:px-20' >
            <Grid.Col xs={6} >
              <Container className={classes.container}>
                <Image src='/logo.png' width={150} height={150} alt='baxshin logo' objectFit='contain' />
                <Title className={classes.title}>بەخێر بێن بۆ پڕۆژەی بەخشین</Title>
                <Text className={classes.description} size="xl" mt="xl"  >ئەم پڕۆژەیە کارێکی خێر خوازی مەزنە و
                  لە ڕێگەیەوە دەتوانیت کارێکی مرۆڤانە بکەیت
                  ئەویش بە پێدانی یاخوود وەرگرتنی بڕێک دراو
                </Text>
                {!user &&
                  <Group direction='row'>
                    <Link href='/signup' passHref>
                      <Button variant="gradient" size="xl" radius="xl" className={classes.control}>
                        هەژمار دروستبکە
                      </Button>
                    </Link>
                    <Link href='/signin' passHref>
                      <Button variant="subtle" size="xl" radius="xl" className={classes.control}>
                        هەژمارت هەیە؟ داخڵبە
                      </Button>
                    </Link>
                  </Group>}
              </Container>
            </Grid.Col>
            <Grid.Col xs={6} >
              <ScrollArea className='h-[90vh] py-8'>
                <Group grow={true} direction={'column'} p={8}>
                  {places.map((place, i) => {
                    return <PlaceListItem key={place.id} place={place} />
                  })}
                </Group>
              </ScrollArea>
            </Grid.Col>
          </Grid>
        </div>
      </main>
    </>
  )
}

export default Home



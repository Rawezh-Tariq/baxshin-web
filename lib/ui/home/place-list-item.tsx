import React from 'react';
import {
  createStyles,
  Card,
  Overlay,
  CardProps,
  Button,
  Text,
  useMantineTheme,
  Grid,
} from '@mantine/core';
import { getSumOfPlaceDonations, Place } from '../../firebase/firestore/types/place';
import Image from 'next/image';


const useStyles = createStyles((theme) => ({
  card: {
    height: 150,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  content: {
    position: 'absolute',
    padding: theme.spacing.xl,
    zIndex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backdropFilter: 'blur(4px)',
  },

  action: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
  },

  title: {
    color: theme.white,
    fontSize: 25,
    marginBottom: theme.spacing.xs / 2,
  },

  description: {
    fontSize: theme.fontSizes.lg,
    color: theme.white,
    maxWidth: 220,
  },
}));

interface PlaceListItemProps {
  place: Place;
}

export function PlaceListItem({
  place,
  ...others
}: PlaceListItemProps & Omit<CardProps<'div'>, keyof PlaceListItemProps | 'children'>) {

  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  return (
    <Card
      radius="lg"
      style={{ backgroundImage: `url(${place.photoUrl})`, }}
      className={cx(classes.card)}
    >
      <Overlay
        gradient={`linear-gradient(105deg, ${theme.colors.gray[4]} 20%, #312f2f 50%, ${theme.black} 100%)`}
        opacity={0.55}
        zIndex={0}
      />

      <div className={classes.content}>
        <Grid >
          <Grid.Col span={9}>
            <Text size="lg" weight={700} className={classes.title}>
              {place.name}
            </Text>
            <Text className={classes.description}>
              بڕی بەخشین  {place.active_donations ? getSumOfPlaceDonations(place) : 0}
            </Text>

          </Grid.Col>
          <Grid.Col span={3}>
            <Image src={place.photoUrl} alt={place.name} width={100} height={100} objectFit='contain' />
          </Grid.Col>
        </Grid>
      </div>
    </Card>
  );

}
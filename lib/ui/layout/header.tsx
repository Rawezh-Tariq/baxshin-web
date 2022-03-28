import React, { useState } from 'react';
import { createStyles, Header, Container, Group, Burger, Paper, Transition, Text, Menu, Divider, Avatar, UnstyledButton, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import Link from 'next/link';
import { ChevronDown, Heart, Logout, Message, MoonStars, PlayerPause, Settings, Star, Sun, SwitchHorizontal, Trash } from 'tabler-icons-react';
import { signOut } from '../../firebase/firebaseAuthProvider';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
        zIndex: 1,
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },

        [theme.fn.smallerThan('sm')]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },
    userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },
    userMenu: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
                    : theme.colors[theme.primaryColor][0],
            color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
        },
    },
}));

interface HeaderResponsiveProps {
    links: { link: string; label: string }[];
    user: { name: string; image: string };
    loggedIn: boolean;
}

export function HeaderResponsive({ links, user, loggedIn }: HeaderResponsiveProps) {
    const [opened, toggleOpened] = useBooleanToggle(false);
    const [active, setActive] = useState(links[0].link);
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { classes, theme, cx } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const items = links.map((link) => (
        <Link key={link.label}
            href={link.link}>
            <a
                className={cx(classes.link, { [classes.linkActive]: active === link.link })}
                onClick={(event) => {
                    // event.preventDefault();
                    setActive(link.link);
                    toggleOpened(false);
                }}
            >
                {link.label}
            </a>
        </Link>
    ));

    return (
        <Header height={HEADER_HEIGHT} className={classes.root}>
            <Container className={classes.header}>
                <Link href='/'>
                    <a className='text-2xl font-bold ml-2'>
                        بەخشین
                    </a>
                </Link>
                <Group spacing={5} className={classes.links}>
                    {items}
                </Group>
                <Group >
                    <ActionIcon
                        variant="outline"
                        color={dark ? 'yellow' : 'blue'}
                        onClick={() => toggleColorScheme()}
                        title="Toggle color scheme"
                    >
                        {dark ? <Sun size={18} /> : <MoonStars size={18} />}
                    </ActionIcon>
                    <Burger
                        opened={opened}
                        onClick={() => toggleOpened()}
                        className={classes.burger}
                        size="sm"
                    />
                    {
                        loggedIn &&
                        < Menu
                            size={260}
                            placement="end"
                            transition="pop-top-right"
                            className={classes.userMenu}
                            onClose={() => setUserMenuOpened(false)}
                            onOpen={() => setUserMenuOpened(true)}
                            control={
                                <UnstyledButton
                                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                                >
                                    <Group spacing={7}>
                                        <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                                        <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                                            {user.name}
                                        </Text>
                                        <ChevronDown size={12} />
                                    </Group>
                                </UnstyledButton>
                            }
                        >
                            <Menu.Item icon={<Settings size={14} />} >Account settings</Menu.Item>

                            <Menu.Item icon={<Logout size={14} />} onClick={(e: any) => {
                                signOut()
                            }}>Logout</Menu.Item>

                            {/* <Divider />

   <Menu.Label>Danger zone</Menu.Label>
   <Menu.Item icon={<PlayerPause size={14} />}>Pause subscription</Menu.Item>
   <Menu.Item color="red" icon={<Trash size={14} />}>
       Delete account
   </Menu.Item> */}
                        </Menu>

                    }
                </Group>

                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} withBorder style={styles}>
                            {items}
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header >
    );
}
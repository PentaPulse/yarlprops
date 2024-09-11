import { Avatar, Box, CssBaseline, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography, styled, useTheme } from '@mui/material'
import { GlobalStyles, Sheet ,Input,ListItemContent,Stack,Card,Chip,LinearProgress,Button,listItemButtonClasses} from '@mui/joy'
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as React from 'react'
import { useAuth } from '../api/AuthContext'
import ProfileBox from '../components/ProfileBox/ProfileBox';
import { adminMenu, backToHome, merchMenu, userMenu } from '../components/menuLists';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../api/firebase';
import ModeSwitch from '../components/ModeHandler/ModeSwitch';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useColorScheme } from '@mui/joy/styles';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightMode';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function DashboardLayout({ handleMode, children }) {
    const [open, setOpen] = React.useState(false);
    const [adminList, setAdminList] = React.useState([]);
    const [merchantList, setMerchantList] = React.useState([]);
    const { user } = useAuth()
    const theme = useTheme();
    const navigate = useNavigate();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleMenu = (path) => {
        navigate(`/d/${path}`)
        setOpen(false)
    }
    const back = () => {
        navigate('/')
    }
    React.useEffect(() => {
        const fetchAdminList = async () => {
            try {
                const q = await getDocs(query(collection(db, 'admins'), where('approved', '==', true)))
                const list = q.docs.map((doc) => doc.data().uid)
                setAdminList(list);
            } catch (e) {

            }
        }
        const fetchMerchantList = async () => {
            try {
                const q = await getDocs(query(collection(db, 'systemusers'), where('isMerchant', '==', true)))
                const list = q.docs.map((doc) => doc.data().uid)
                setMerchantList(list)
            } catch (e) {

            }
        }
        fetchAdminList()
        fetchMerchantList()
    }, [])

    const drawer = (
        <List >
            {(adminList.includes(user.uid) ? adminMenu : (merchantList.includes(user.uid) ? merchMenu : userMenu)).map((text, index) => (
                <ListItem key={text} disablePadding >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => handleMenu(text[2], text[3])}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            {text[1]}
                        </ListItemIcon>
                        <ListItemText primary={text[0]} sx={{ opacity: { xs: open ? 1 : 0, sm: open ? 1 : 0, md: 1, lg: 1 } }} onClick={() => handleMenu(text[2], text[3])} />
                    </ListItemButton>
                </ListItem>
            ))}
            <ListItem disablePadding >
                <ListItemButton
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                    }}
                    onClick={back}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 24,
                                height: 24,
                                bgcolor: 'inherit'
                            }}
                            alt={backToHome[0]}
                            variant="square"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill={theme.palette.mode === 'light' ? '#000000' : '#ffffff'}
                            >
                                <path d={backToHome[1]} />
                            </svg>
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={backToHome[0]} sx={{ opacity: { xs: open ? 1 : 0, sm: open ? 1 : 0, md: 1, lg: 1 } }} />
                </ListItemButton>
            </ListItem>
        </List>
    )
    return (
        <>
            <Grid container columns={12}>
                <CssBaseline />
                <AppBar position="fixed" open={open} color='inherit'>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box display='flex'>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                sx={{ mr: 2, display: { lg: 'none' } }}
                                onClick={handleDrawerOpen}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap component="div" >
                                logo {/*large screens logo + name*/}
                            </Typography>
                            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}>
                                YarlProps {/*small screens logo*/}
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box display={'flex'} gap={1} >
                            <Tooltip title={`${theme.palette.mode} mode`}>
                                <ModeSwitch handleMode={handleMode} />
                            </Tooltip>
                            <Box sx={{ flexGrow: 1 }} />
                            <ProfileBox />
                        </Box>
                    </Toolbar >
                </AppBar >
                <Grid item size={3}>
                    < Drawer sx={{
                        display: { xs: 'block', sm: 'block', md: 'block', lg: 'none' }
                        , '& .MuiDrawer-paper': { boxSizing: 'border-box', color: 'inherit' },
                    }} variant={open ? "permanent" : 'temporary'} open={open} >
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClose} >
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </DrawerHeader>
                        <Divider />
                        {drawer}
                    </Drawer >
                    < Drawer sx={{
                        display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { boxSizing: 'border-box' },
                    }} variant="permanent" open>
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClose} >
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </DrawerHeader>
                        <Divider />
                        {drawer}
                    </Drawer >

                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={9} sx={{ pt: { xs: 10, sm: 10, md: 10, lg: 10 } }} >
                    <Grid container columns={12} pl={2} columnSpacing={{ xs: 1, sm: 1, md: 2, lg: 2 }} rowSpacing={{ xs: 3, sm: 3, md: 2, lg: 2 }}>
                        {children}
                    </Grid>
                </Grid>
            </Grid >
        </>
    )
}
/** */
export function ColorSchemeToggle(props) {
    const { onClick, sx, ...other } = props;
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
      setMounted(true);
    }, []);
    if (!mounted) {
      return (
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          {...other}
          sx={sx}
          disabled
        />
      );
    }
    return (
      <IconButton
        data-screenshot="toggle-mode"
        size="sm"
        variant="outlined"
        color="neutral"
        {...props}
        onClick={(event) => {
          if (mode === 'light') {
            setMode('dark');
          } else {
            setMode('light');
          }
          onClick?.(event);
        }}
        sx={[
          mode === 'dark'
            ? { '& > *:first-of-type': { display: 'none' } }
            : { '& > *:first-of-type': { display: 'initial' } },
          mode === 'light'
            ? { '& > *:last-of-type': { display: 'none' } }
            : { '& > *:last-of-type': { display: 'initial' } },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <DarkModeRoundedIcon />
        <LightModeIcon />
      </IconButton>
    );
  }
  
function Toggler({
    defaultExpanded = false,
    renderToggle,
    children,
}) {
    const [open, setOpen] = React.useState(defaultExpanded);
    return (
        <React.Fragment>
            {renderToggle({ open, setOpen })}
            <Box
                sx={[
                    {
                        display: 'grid',
                        transition: '0.2s ease',
                        '& > *': {
                            overflow: 'hidden',
                        },
                    },
                    open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
                ]}
            >
                {children}
            </Box>
        </React.Fragment>
    );
}
function closeSidebar() {
    if (typeof window !== 'undefined') {
      document.documentElement.style.removeProperty('--SideNavigation-slideIn');
      document.body.style.removeProperty('overflow');
    }
  }
export function Sidebar() {
    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: { xs: 'fixed', md: 'sticky' },
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                    md: 'none',
                },
                transition: 'transform 0.4s, width 0.4s',
                zIndex: 10000,
                height: '100dvh',
                width: 'var(--Sidebar-width)',
                top: 0,
                p: 2,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Sidebar-width': '220px',
                        [theme.breakpoints.up('lg')]: {
                            '--Sidebar-width': '240px',
                        },
                    },
                })}
            />
            <Box
                className="Sidebar-overlay"
                sx={{
                    position: 'fixed',
                    zIndex: 9998,
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    opacity: 'var(--SideNavigation-slideIn)',
                    backgroundColor: 'var(--joy-palette-background-backdrop)',
                    transition: 'opacity 0.4s',
                    transform: {
                        xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
                        lg: 'translateX(-100%)',
                    },
                }}
                onClick={() => closeSidebar()}
            />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton variant="soft" color="primary" size="sm">
                    <BrightnessAutoRoundedIcon />
                </IconButton>
                <Typography level="title-lg">Acme Co.</Typography>
                <ColorSchemeToggle sx={{ ml: 'auto' }} />
            </Box>
            <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" />
            <Box
                sx={{
                    minHeight: 0,
                    overflow: 'hidden auto',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    [`& .${listItemButtonClasses.root}`]: {
                        gap: 1.5,
                    },
                }}
            >
                <List
                    size="sm"
                    sx={{
                        gap: 1,
                        '--List-nestedInsetStart': '30px',
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                    }}
                >
                    <ListItem>
                        <ListItemButton>
                            <HomeRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Home</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton>
                            <DashboardRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Dashboard</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton
                            role="menuitem"
                            component="a"
                            href="/joy-ui/getting-started/templates/order-dashboard/"
                        >
                            <ShoppingCartRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Orders</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem nested>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton onClick={() => setOpen(!open)}>
                                    <AssignmentRoundedIcon />
                                    <ListItemContent>
                                        <Typography level="title-sm">Tasks</Typography>
                                    </ListItemContent>
                                    <KeyboardArrowDownIcon
                                        sx={[
                                            open ? { transform: 'rotate(180deg)' } : { transform: 'none' },
                                        ]}
                                    />
                                </ListItemButton>
                            )}
                        >
                            <List sx={{ gap: 0.5 }}>
                                <ListItem sx={{ mt: 0.5 }}>
                                    <ListItemButton>All tasks</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>Backlog</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>In progress</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>Done</ListItemButton>
                                </ListItem>
                            </List>
                        </Toggler>
                    </ListItem>
                    <ListItem>
                        <ListItemButton
                            role="menuitem"
                            component="a"
                            href="/joy-ui/getting-started/templates/messages/"
                        >
                            <QuestionAnswerRoundedIcon />
                            <ListItemContent>
                                <Typography level="title-sm">Messages</Typography>
                            </ListItemContent>
                            <Chip size="sm" color="primary" variant="solid">
                                4
                            </Chip>
                        </ListItemButton>
                    </ListItem>
                    <ListItem nested>
                        <Toggler
                            defaultExpanded
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton onClick={() => setOpen(!open)}>
                                    <GroupRoundedIcon />
                                    <ListItemContent>
                                        <Typography level="title-sm">Users</Typography>
                                    </ListItemContent>
                                    <KeyboardArrowDownIcon
                                        sx={[
                                            open ? { transform: 'rotate(180deg)' } : { transform: 'none' },
                                        ]}
                                    />
                                </ListItemButton>
                            )}
                        >
                            <List sx={{ gap: 0.5 }}>
                                <ListItem sx={{ mt: 0.5 }}>
                                    <ListItemButton selected>My profile</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>Create a new user</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>Roles & permission</ListItemButton>
                                </ListItem>
                            </List>
                        </Toggler>
                    </ListItem>
                </List>
                <List
                    size="sm"
                    sx={{
                        mt: 'auto',
                        flexGrow: 0,
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                        '--List-gap': '8px',
                        mb: 2,
                    }}
                >
                    <ListItem>
                        <ListItemButton>
                            <SupportRoundedIcon />
                            Support
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <SettingsRoundedIcon />
                            Settings
                        </ListItemButton>
                    </ListItem>
                </List>
                <Card
                    invertedColors
                    variant="soft"
                    color="warning"
                    size="sm"
                    sx={{ boxShadow: 'none' }}
                >
                    <Stack
                        direction="row"
                        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <Typography level="title-sm">Used space</Typography>
                        <IconButton size="sm">
                            <CloseRoundedIcon />
                        </IconButton>
                    </Stack>
                    <Typography level="body-xs">
                        Your team has used 80% of your available space. Need more?
                    </Typography>
                    <LinearProgress variant="outlined" value={80} determinate sx={{ my: 1 }} />
                    <Button size="sm" variant="solid">
                        Upgrade plan
                    </Button>
                </Card>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar
                    variant="outlined"
                    size="sm"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography level="title-sm">Siriwat K.</Typography>
                    <Typography level="body-xs">siriwatk@test.com</Typography>
                </Box>
                <IconButton size="sm" variant="plain" color="neutral">
                    <LogoutRoundedIcon />
                </IconButton>
            </Box>
        </Sheet>
    );
}
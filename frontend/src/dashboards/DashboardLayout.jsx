import * as React from 'react';
import { AppBar, Avatar, Box, CssBaseline, Divider, Drawer, Grid, IconButton, Input, MenuItem, MenuList, Toolbar, Tooltip, Typography, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../api/AuthContext'
import { adminMenu, merchMenu, userMenu } from '../components/menuLists';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../api/firebase';
import ModeSwitch from '../components/ModeHandler/ModeSwitch';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const drawerWidth = 240;

export default function DashboardLayout({ handleMode, children }) {
  const [open, setOpen] = React.useState(false);
  const [adminList, setAdminList] = React.useState([]);
  const [merchantList, setMerchantList] = React.useState([]);
  const { user, logout } = useAuth()
  const theme = useTheme();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path)
  }
  React.useEffect(() => {
    const fetchAdminList = async () => {
      try {
        const q = await getDocs(query(collection(db, 'admins')))
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
    <>
    
      <Box
        sx={{
          minHeight: 0,
          overflow: 'auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          '& .MuiMenuItem-root': {
            gap: 2
          },
        }}
      >
        <MenuList
          sx={{
            gap: 1,
            '--MuiMenuItem-radius': theme.shape.borderRadius,
            '--MuiMenuItem-insetStart': '30px',
          }}
        >
          {(adminList.includes(user.uid) ? adminMenu : (merchantList.includes(user.uid) ? merchMenu : userMenu)).map((text, index) => (
            <MenuItem onClick={() => handleNavigation(text[2])}>{text[1]} {text[0]}</MenuItem>
          ))}
        </MenuList>

        <MenuList
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--MuiMenuItem-radius': theme.shape.borderRadius,
            '--MuiMenuItem-insetStart': '30px',
            gap: 0.5,
          }}
        >
          <MenuItem onClick={() => handleNavigation('/d/profile')}>
            <SupportRoundedIcon />
            <Typography variant="body1">Profile</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/')}>
            <HomeRoundedIcon />
            <Typography variant="body1">Back to Home</Typography>
          </MenuItem>
        </MenuList>
      </Box>
      <Divider />
      <Box display={'flex'} pb={3}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Avatar src={sessionStorage.getItem('pp')} />
          <Box>
            <Typography >{sessionStorage.getItem('displayName')}</Typography>
            <Typography>{user.email}</Typography>
          </Box>
        </Box>
        <IconButton onClick={logout}>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </>
  )
  const isMobile = theme.breakpoints.down('lg')
  return (
    <>
      <Grid container columns={12}>
        <CssBaseline />
        <AppBar position="fixed" open={open} color='inherit'sx={{
    width: isMobile ? `calc(100% - ${drawerWidth}px)` : '100%',
  }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box display='flex'>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                sx={{ mr: 2, [theme.breakpoints.up('lg')]: { display: 'none' } }}
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
            </Box>
          </Toolbar >
        </AppBar >
        <Grid item size={3}>
          < Drawer sx={{
            [theme.breakpoints.up('lg')]: { display: 'none' },
            display: 'block',      
            width:{drawerWidth}      
          }} variant={'temporary'} open={open} onClose={handleDrawerClose}>
            {/*<DrawerHeader>
              <IconButton onClick={handleDrawerClose} >
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>*/}
            <Divider />
            {drawer}
          </Drawer >
          < Drawer sx={{
            [theme.breakpoints.down('lg')]: { display: 'none' },
            flexShrink: 0,
          }} variant='permanent'>
            {/*<DrawerHeader>
              <IconButton onClick={handleDrawerClose} >
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>*/}
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
/*
export default function DashboardLayout({ handleMode, children }) {
  const theme = useTheme()
  return (
    <>
    <Grid container >
      <Grid item lg={2}>
      <Sidebar handleMode={handleMode} />
      </Grid>
      <Header />
      <Grid item xs={12} sm={12} md={12} sx={{[theme.breakpoints.up('md')]:9}} pt={10}>
        <Grid container columns={12} columnSpacing={{ xs: 1, sm: 1, md: 2, lg: 2 }} rowSpacing={{ xs: 3, sm: 3, md: 2, lg: 2 }}>
          {children}
        </Grid>
      </Grid>
    </Grid>
    </>
  )

}

function Sidebar({ handleMode }) {
  const theme = useTheme();
  const { user, logout } = useAuth()
  const [adminList, setAdminList] = React.useState([]);
  const [merchantList, setMerchantList] = React.useState([]);
  const navigate = useNavigate()

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

  const handleNavigation = (path) => {
    closeSidebar()
    navigate(path)
  }

 return(
  <Drawer open variant='permanent'>    
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton color="primary" size="small" onClick={() => navigate('/')}>
            {/**replace our logo /}
            Yp
          </IconButton>
          <Typography variant="h6">YARLPROPS</Typography>
          <IconButton onClick={handleMode}>
            {theme.palette.mode === 'dark' ? <DarkModeRoundedIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>
        <Input size="small" startAdornment={<SearchRoundedIcon />} placeholder="Search" />
        <Box
          sx={{
            minHeight: 0,
            overflow: 'auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            '& .MuiMenuItem-root': {
              gap: 1.5,
            },
          }}
        >
          <MenuList
            sx={{
              gap: 1,
              '--MuiMenuItem-radius': theme.shape.borderRadius,
              '--MuiMenuItem-insetStart': '30px',
            }}
          >
            {(adminList.includes(user.uid) ? adminMenu : (merchantList.includes(user.uid) ? merchMenu : userMenu)).map((text, index) => (
              <MenuItem onClick={() => handleNavigation(text[2])}>{text[1]} {text[0]}</MenuItem>
            ))}
          </MenuList>

          <MenuList
            sx={{
              mt: 'auto',
              flexGrow: 0,
              '--MuiMenuItem-radius': theme.shape.borderRadius,
              '--MuiMenuItem-insetStart': '30px',
              gap: 0.5,
            }}
          >
            <MenuItem onClick={() => handleNavigation('/d/profile')}>
              <SupportRoundedIcon />
              <Typography variant="body1">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/')}>
              <HomeRoundedIcon />
              <Typography variant="body1">Back to Home</Typography>
            </MenuItem>
          </MenuList>
        </Box>
        <Divider />
        <Box display={'flex'} pb={3}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Avatar src={sessionStorage.getItem('pp')} />
            <Box>
              <Typography >{sessionStorage.getItem('displayName')}</Typography>
              <Typography>{user.email}</Typography>
            </Box>
          </Box>
          <IconButton onClick={logout}>
            <LogoutRoundedIcon />
          </IconButton>
        </Box>
  </Drawer>
 )
}

function Header() {
  const theme = useTheme()
  return (
    <Paper
      sx={{
        [theme.breakpoints.up('md')]: { display: 'none' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        width: '100vw',
        height: 'var(--Header-height)',
        zIndex: (theme) => theme.zIndex.drawer -1 ,
        p: 2,
        gap: 1,
        borderBottom: '1px solid',
        borderColor: 'background.level1',
        boxShadow: 'sm',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Header-height': '52px',
            [theme.breakpoints.up('md')]: {
              '--Header-height': '0px',
            },
          },
        })}
      />
      <IconButton
        onClick={() => toggleSidebar()}
        variant="outlined"
        color="neutral"
        size="sm"
      >
        <MenuRoundedIcon />
      </IconButton>
    </Paper>
  );
}
*/
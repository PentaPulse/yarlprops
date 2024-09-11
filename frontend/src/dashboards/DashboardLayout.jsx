import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Input,
  MenuItem,
  Divider,
  GlobalStyles,
  useTheme,
  MenuList,
  Avatar,
  Grid,
  Paper,
  Drawer,
} from '@mui/material';
import {
  BrightnessAutoRounded as BrightnessAutoRoundedIcon,
  SearchRounded as SearchRoundedIcon,
  SupportRounded as SupportRoundedIcon,
  LogoutRounded as LogoutRoundedIcon,
  DarkModeRounded as DarkModeRoundedIcon,
  LightMode as LightModeIcon,
  MenuRounded as MenuRoundedIcon,
  HomeRounded as HomeRoundedIcon
} from '@mui/icons-material';
import { useAuth } from '../api/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../api/firebase';
import { adminMenu, merchMenu, userMenu } from '../components/menuLists';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout({ handleMode, children }) {
  return (
    <><Grid container>
      <Grid item lg={2}>
      <Sidebar handleMode={handleMode} />
      </Grid>
      <Header />
      <Grid item xs={12} sm={12} md={12} lg={9} pt={10}>
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
            {/**replace our logo */}
            <BrightnessAutoRoundedIcon />
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
        <Box display={'flex'}>
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

function closeSidebar() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn');
    document.body.style.removeProperty('overflow');
  }
}

function openSidebar() {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
  }
}

function toggleSidebar() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn');
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}
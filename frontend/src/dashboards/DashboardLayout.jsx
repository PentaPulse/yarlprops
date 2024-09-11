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
      <Sidebar handleMode={handleMode} />
      <Header/>
      <Grid item xs={12} sm={12} md={12} lg={9} sx={{ pt: { xs: 10, sm: 10, md: 10, lg: 10 } }} >
        <Grid container columns={12} pl={2} columnSpacing={{ xs: 1, sm: 1, md: 2, lg: 2 }} rowSpacing={{ xs: 3, sm: 3, md: 2, lg: 2 }}>
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


  return (
    <>
      <Box
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
          borderColor: theme.palette.divider,
        }}
      >
        <GlobalStyles
          styles={(theme) => ({
            ':root': {
              '--Sidebar-width': '220px',
              [theme.breakpoints.up('md')]: {
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
            backgroundColor: theme.palette.background.default,
            transition: 'opacity 0.4s',
            transform: {
              xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
              lg: 'translateX(-100%)',
            },
          }}
          onClick={() => closeSidebar()}
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton color="primary" size="small" onClick={()=>navigate('/')}>
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
              <MenuItem onClick={() => navigate(text[2])}>{text[1]} {text[0]}</MenuItem>
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
            <MenuItem onClick={()=>navigate('/d/profile')}>
              <SupportRoundedIcon />
              <Typography variant="body1">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={()=>navigate('/')}>
              <HomeRoundedIcon/>
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
      </Box>
    </>
  );
}

function Header() {
  return (
    <Paper
      sx={{
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        width: '100vw',
        height: 'var(--Header-height)',
        zIndex: 9998,
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
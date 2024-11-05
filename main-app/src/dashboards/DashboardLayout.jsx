import * as React from 'react';
import { Avatar, Box, CssBaseline, Divider, Grid, IconButton, MenuItem, MenuList, Toolbar, Tooltip, Typography, useTheme, styled } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../api/AuthContext'
import { additionalMenu, bothMenu, merchMenu, userMenu } from '../components/menuLists';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../api/firebase';
import ModeSwitch from '../components/ModeHandler/ModeSwitch';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Notifications from '../components/Notifications/Notifications';


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
  const [merchantList, setMerchantList] = React.useState([]);
  const [customerList, setCustomerList] = React.useState([]);
  const [orderList,setOrderList]=React.useState(false)
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
    setOpen(false)
  }
  React.useEffect(() => {
    const fetchMerchantList = async () => {
      try {
        const mq = await getDocs(query(collection(db, 'systemusers'), where('isMerchant', '==', true)))
        const mlist = mq.docs.map((doc) => doc.data().uid)
        setMerchantList(mlist)
        const cq = await getDocs(query(collection(db, 'systemusers'), where('isMerchant', '==', false)))
        const clist = cq.docs.map((doc) => doc.data().uid)
        setCustomerList(clist)
      } catch (e) {

      }
    }
    fetchMerchantList()
    const fetchOrderLists=async()=>{
      try{
        const qsnapshot = await getDocs(collection(db,"systemusers",user.uid,'orders'))
        setOrderList(qsnapshot.size>0)
      }catch(e){}
    }
    fetchOrderLists()
  }, [orderList])

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
          {(merchantList.includes(user.uid) ? (orderList?bothMenu:merchMenu) : customerList.includes(user.uid) ? userMenu : [])
            .map((text, index) => (
              <MenuItem key={index} onClick={() => handleNavigation(text[2])}>
                {text[1]} {text[0]}
              </MenuItem>
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
        ><MenuItem onClick={() => handleNavigation('/d/notifications')}>
            <SupportRoundedIcon />
            <Typography variant="body1">Notifications</Typography>
          </MenuItem>
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
      <Box display={'flex'} pb={3} justifyContent={'space-between'} mb={6}>
        <Box display={'flex'} justifyContent={'space-between'} ml={2}>
          <Avatar src={sessionStorage.getItem('pp')} />
          <Box pl={1}>
            <Typography>{sessionStorage.getItem('displayName')}</Typography>
            <Typography
              sx={{
                maxWidth: '150px', // set the max width
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user.email}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={logout}>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </>
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
              
              <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="YarlProps logo" 
                            style={{ 
                                height: '70px',
                                width: '70px',
                                 marginRight: '20px',
                                 borderRadius: '60%', 
                                 border: '2px solid #ccc'
                                  }} />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box display={'flex'} gap={1} >              
              <Tooltip title={`${theme.palette.mode} mode`}>
                <ModeSwitch handleMode={handleMode} />
              </Tooltip>
              <Notifications/>
            </Box>
          </Toolbar >
        </AppBar >
        <Grid item size={3}>
          < Drawer sx={{
            display: { xs: 'block', sm: 'block', md: 'block', lg: 'none' }
            , '& .MuiDrawer-paper': { boxSizing: 'border-box', color: 'inherit' },
          }} variant={open ? "permanent" : 'temporary'} open={open} onClose={handleDrawerClose}>
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
          }} variant="permanent" open >
            <DrawerHeader sx={{ zIndex: theme.zIndex.appBar - 1 }} />
            <Divider />
            {drawer}
          </Drawer >

        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={9} mt={3} ml={3} sx={{ pt: { xs: 10, sm: 10, md: 10, lg: 10 } }} >
          <Grid container flexDirection={'column'} columns={12} columnSpacing={{ xs: 1, sm: 1, md: 2, lg: 2 }} rowSpacing={{ xs: 3, sm: 3, md: 2, lg: 2 }}>
            {children}
          </Grid>
        </Grid>
      </Grid >
    </>
  )
}
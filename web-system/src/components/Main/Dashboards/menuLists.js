//icons
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import CommentIcon from '@mui/icons-material/Comment';
import BadgeIcon from '@mui/icons-material/Badge';
import StoreIcon from '@mui/icons-material/Store';

//Admin imports
import AdminOverview from './Admin/AdminOverview'
import AdminUsers from './Admin/AdminUsers'
import AdminProducts from './Admin/AdminProducts'
//seller imports
import SellerOverview from './Seller/SellerOverview'
import SellerOrders from './Seller/SellerOrders'
import SellerProducts from './Seller/SellerProducts'
//renter imports
import RenterOverview from './Renter/RenterOverview'
import RenterOrders from './Renter/RenterOrders'
import RenterProducts from './Renter/RenterProducts'
//user imports
import UserOverview from './User/UserOverview'
import ContactusReqs from './Admin/ContactusReqs'
import Admins from './Admin/Admins'

//common
import Profile from './UserProfile'

export const adminMenu = [
    ['Overview', <DashboardIcon />],
    ['Admins', <SupervisorAccountIcon />],
    ['Users', <GroupIcon />],
    ['Products', <InventoryIcon />],
    ['Contact us requests', <CommentIcon />],
    ['My Profile', <BadgeIcon />],
]
export const sellerMenu = [
    ['Overview', <DashboardIcon />],
    ['Products', <InventoryIcon />],
    ['Orders', <StoreIcon />],
    ['My Profile', <BadgeIcon />],
]
export const renterMenu = [
    ['Overview', <DashboardIcon />],
    ['Products', <InventoryIcon />],
    ['Orders', <StoreIcon />],
    ['My Profile', <BadgeIcon />],
]
export const userMenu = [
    ['Overview', <DashboardIcon />],
    ['My Profile', <BadgeIcon />],
]
//boards
export const adminBoard = [<AdminOverview />, <Admins />, <AdminUsers />, <AdminProducts />, <ContactusReqs />, <Profile />]
export const sellerBoard = [<SellerOverview />, <SellerOrders />, <SellerProducts />, <Profile />]
export const renterBoard = [<RenterOverview />, <RenterOrders />, <RenterProducts />, <Profile />]
export const userBoard = [<UserOverview />, <Profile />]

export const backToHome = ['Back to Home', "M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM13.92 16.13H9C8.59 16.13 8.25 15.79 8.25 15.38C8.25 14.97 8.59 14.63 9 14.63H13.92C15.2 14.63 16.25 13.59 16.25 12.3C16.25 11.01 15.21 9.97 13.92 9.97H8.85L9.11 10.23C9.4 10.53 9.4 11 9.1 11.3C8.95 11.45 8.76 11.52 8.57 11.52C8.38 11.52 8.19 11.45 8.04 11.3L6.47 9.72C6.18 9.43 6.18 8.95 6.47 8.66L8.04 7.09C8.33 6.8 8.81 6.8 9.1 7.09C9.39 7.38 9.39 7.86 9.1 8.15L8.77 8.48H13.92C16.03 8.48 17.75 10.2 17.75 12.31C17.75 14.42 16.03 16.13 13.92 16.13Z"]
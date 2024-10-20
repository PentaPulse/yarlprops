//icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import CommentIcon from '@mui/icons-material/Comment';
import StoreIcon from '@mui/icons-material/Store';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import CarRentalIcon from '@mui/icons-material/CarRental';

export const adminMenu = [
    ['Overview', <DashboardIcon />, 'overview'],
    ['Site Manager',<CommentIcon/>,'site'],
    ['Admins', <AdminPanelSettingsIcon />, 'adminlist'],
    ['Merchants',<StoreIcon/>,'merchantlist'],
    ['Customers', <GroupIcon />, 'customerlist'],
    ['Products', <InventoryIcon />, 'productlist'],
    ['Rentals', <CarRentalIcon />, 'rentallist'],
    ['Services', <MiscellaneousServicesIcon />, 'servicelist'],
    ['Contactus reqs', <CommentIcon />, 'contactreqs'],
]
export const productFilters = {
    "categories":
    {
        "Vehicles":
            ["Bicycle", "Bike"],
        "Furnitures":
            ["Table", "Chair", "Bed"]
    }
}
export const rentalFilters = {
    "categories":
    {
        "Vehicles":
            ["Bicycle", "Bike"],
        "Furnitures":
            ["Table", "Chair", "Bed"],
        'Bordims':
            ["Boys", "Girls"]
    }
}
export const serviceFilters = {
    "categories":
    {
        "Food":
            ["Cake", "Meals"],
        "Saloon":
            ["Boys", "Girls", "Both"]
    }
}
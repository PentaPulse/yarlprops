//icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import CarRentalIcon from '@mui/icons-material/CarRental';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


export const merchMenu = [
    ['Overview', <DashboardIcon />, 'overview'],
    ['My Products', <InventoryIcon />, 'myproducts'],
    ['My Rentals', <CarRentalIcon />, 'myrentals'],
    ['My Services', <MiscellaneousServicesIcon />, 'myservices'],
    ['Customer Orders', <StoreIcon />, 'custorders'],
    ['Feedback Center', <FeedbackIcon />, 'mrfeedback'],


]
export const userMenu = [
    ['Overview', <DashboardIcon />, 'overview'],
    ['My Orders',< ShoppingCartIcon/>,'orders'],
    ['Feedbacks',<FeedbackIcon/>,'feedback'],
   
]

export const bothMenu=[
    ['Overview', <DashboardIcon />, 'overview'],
    ['My Products', <InventoryIcon />, 'myproducts'],
    ['My Rentals', <CarRentalIcon />, 'myrentals'],
    ['My Services', <MiscellaneousServicesIcon />, 'myservices'],
    ['Customer Orders', <StoreIcon />, 'custorders'],
    ['My Orders',< ShoppingCartIcon/>,'orders'],
    ['Feedbacks',<FeedbackIcon/>,'feedback'],
]

export const backToHome = ['Back to Home', "M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM13.92 16.13H9C8.59 16.13 8.25 15.79 8.25 15.38C8.25 14.97 8.59 14.63 9 14.63H13.92C15.2 14.63 16.25 13.59 16.25 12.3C16.25 11.01 15.21 9.97 13.92 9.97H8.85L9.11 10.23C9.4 10.53 9.4 11 9.1 11.3C8.95 11.45 8.76 11.52 8.57 11.52C8.38 11.52 8.19 11.45 8.04 11.3L6.47 9.72C6.18 9.43 6.18 8.95 6.47 8.66L8.04 7.09C8.33 6.8 8.81 6.8 9.1 7.09C9.39 7.38 9.39 7.86 9.1 8.15L8.77 8.48H13.92C16.03 8.48 17.75 10.2 17.75 12.31C17.75 14.42 16.03 16.13 13.92 16.13Z"]

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
            ["Boys", "Girls", "Both"],
        "Vehicals":
            ["Three Wheel", "Bike"]
    }
}
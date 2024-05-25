import { Box, Grid, MenuItem, MenuList, Paper } from '@mui/material'
import * as React from 'react'
import Profile from './UserProfile'
import Overview from './Overview'
import Sellers from './Sellers'
import Renters from './Renters'
import Products from './Products'
import Users from './Users'
import { onAuthStateChanged } from 'firebase/auth'
import { authUser } from '../../../backend/autharization'
import { useNavigate } from 'react-router-dom'
//import { adminList } from '../../../backend/db/users'

//only for debugging
let email = authUser.currentUser.email
const admins =[email]
const sellers =['']
const users =['']

//menus
const adminMenu = ['Overview','Sellers','Renters','Products','Users','My Profile','Sign out']
const sellerRenterMenu = ['Overview','Products','My Profile','Sign out']
const userMenu = ['Overview','My Profile','Sign out']

//boards
const adminBoard = [<Overview/>,<Sellers/>,<Renters/>,<Products/>,<Users/>,<Profile/>]
const sellerBoard = [<Overview/>,<Products/>,<Profile/>]
const userBoard = [<Overview/>,<Profile/>]

function Structure() {
    //const [admin,setAdmin]=React.useState(false);
    const [board, setBoard] = React.useState(0)
    const [status, setStatus] = React.useState('')
    const navigate = useNavigate()
    React.useEffect(() => {
        onAuthStateChanged(authUser, user => {
            if (user) {
                email = user.email
                if (admins.includes(user.email)) {
                    setStatus('admin')
                } else if(sellers.includes(user.email)){
                    setStatus('seller')
                } else if(users.includes(user.email)){
                    setStatus('user')
                }
            } else{
                navigate('/')
            }
        })
    })
    return (
        <>
            <Box >
                <Grid container spacing={2} columns={{ xs: 2, sm: 4, md: 12, lg: 12 }}>
                    <Grid justifyContent="center" alignItems="center" item xs={2} sm={4} md={3} lg={3}>
                        <Paper>
                            <MenuList variant='selectedMenu'>
                                {status==='admin'&& adminMenu.map((item,index)=>(
                                    <MenuItem key={index} sx={{ height: '5rem' , textAlign:'center'}} onClick={()=>setBoard(index)}>{item}</MenuItem>
                                ))}
                                {status==='seller'&& sellerRenterMenu.map((item,index)=>(
                                    <MenuItem key={index}  sx={{ height: '5rem' }} onClick={()=>setBoard(index)}>{item}</MenuItem>
                                ))}
                                {status==='user'&& userMenu.map((item,index)=>(
                                    <MenuItem key={index}  sx={{ height: '5rem' }} onClick={()=>setBoard(index)}>{item}</MenuItem>
                                ))}
                            </MenuList>
                        </Paper>
                    </Grid>
                    <Grid item md={9}>
                        <Paper sx={{ height: '100%' }}>
                            {status==='admin'&& adminBoard.map((boardComponent,index)=>(
                                board===index && boardComponent
                            ))}
                            {status==='seller'&& sellerBoard.map((boardComponent,index)=>(
                                board===index && boardComponent
                            ))}
                            {status==='user'&& userBoard.map((boardComponent,index)=>(
                                board===index && boardComponent
                            ))}
                            
                        </Paper>
                    </Grid>
                </Grid>
            </Box >
        </>
    )
}

export default Structure
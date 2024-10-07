import { useTheme } from "@emotion/react";
import { Grid, Skeleton, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";


export default function DbError({ home }) {
    const theme = useTheme();
    const [count, setCount] = useState(6)

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        if (home) {
            setCount(3)
        } else {
            if (isMobile) {
                setCount(3)
            } else if (isTablet) {
                setCount(4)
            }
            else{
                setCount(6)
            }
        }
    }, [isMobile, isTablet,home])
    return (<>
        {Array.from(new Array(count)).map((_, index) => (
            <Grid item xs={24} sm={12} md={12} lg={8} key={index}>
                <Skeleton variant='rectangular' sx={{
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    position: 'relative',
                    height: isMobile ? '18rem' : isTablet ? '22rem' : '24rem',
                    width: '100%'
                }} />
            </Grid>
        ))}
    </>
    );
}
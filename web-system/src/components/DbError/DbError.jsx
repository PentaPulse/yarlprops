import { Grid, Skeleton } from "@mui/material";


export default function DbError({items}) {
    return (<>
        {Array.from(new Array(items)).map((_, index) => (
            <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                <Skeleton variant='rectangular' height={300} />
            </Grid>
        ))}
    </>
    );
}
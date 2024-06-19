import { Grid, Paper } from '@mui/material';
import * as React from 'react';

export default function Profile() {
  const [text, setText] = React.useState("");

  const mainUser = {
    // DEFAULT VALUES
    title: "CEO of Apple",
    dt1: 32,
    dt2: 40,
    dt3: 50,
    firstName: text,
    lastName: "Doe",
    midName: "Baker",
    gender: "female",
    phone: "932-555-4247",
    email: "janedoe@gmail.com",
    pass: "password123"
  };

  const fullName = `${mainUser.firstName} ${mainUser.lastName}`;

  return (
    <>
      {/* BACKGROUND */}
      <Grid container direction="column" sx={{ overflowX: "hidden" }}>
        <Grid item xs={12} md={6}>
          <img
            alt="avatar"
            style={{
              width: "100vw",
              height: "35vh",
              objectFit: "cover",
              objectPosition: "50% 50%",
              position: "relative"
            }}
            src="https://iris2.gettimely.com/images/default-cover-image.jpg"
          />
        </Grid>

        {/* COMPONENTS */}
        <Grid
          container
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{
            position: "absolute",
            top: "20vh",
            px: { xs: 0, md: 7 }
          }}
        >
          {/* PROFILE CARD */}
          <Grid item md={3}>
            <ProfileCard
              name={fullName}
              sub={mainUser.title}
              dt1={mainUser.dt1}
              dt2={mainUser.dt2}
              dt3={mainUser.dt3}
            />
          </Grid>

          {/* SETTINGS CARD */}
          <Grid item md={9}>
            <SettingsCard
              expose={(v) => setText(v)}
              firstName={mainUser.firstName}
              lastName={mainUser.lastName}
              midName={mainUser.midName}
              phone={mainUser.phone}
              email={mainUser.email}
              pass={mainUser.pass}
              gender={mainUser.gender}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

// Dummy ProfileCard and SettingsCard components for demonstration purposes
const ProfileCard = ({ name, sub, dt1, dt2, dt3 }) => (
  <Paper>
    <h2>{name}</h2>
    <h3>{sub}</h3>
    <p>dt1: {dt1}</p>
    <p>dt2: {dt2}</p>
    <p>dt3: {dt3}</p>
  </Paper>
);

const SettingsCard = ({ expose, firstName, lastName, midName, phone, email, pass, gender }) => (
  <Paper>
    <h2>Settings</h2>
    <p>First Name: {firstName}</p>
    <p>Last Name: {lastName}</p>
    <p>Middle Name: {midName}</p>
    <p>Phone: {phone}</p>
    <p>Email: {email}</p>
    <p>Password: {pass}</p>
    <p>Gender: {gender}</p>
    <input type="text" onChange={(e) => expose(e.target.value)} />
  </Paper>
);
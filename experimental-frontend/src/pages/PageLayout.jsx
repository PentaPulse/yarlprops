import * as React from 'react';
import Divider from '@mui/material/Divider';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';

export default function PageLayout({ mode, toggleColorMode, children }) {
  return (
    <>
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      {children}
      <Divider />
      <Footer />
    </>
  );
}
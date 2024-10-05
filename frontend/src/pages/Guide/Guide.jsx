import React from 'react'
import { 
  Typography, 
  Container, 
  TextField, 
  Grid, 
  Card, 
  CardContent, 
  Link,
  Box,
  InputAdornment,
  Modal,
  Backdrop,
  Fade,
  Button
} from '@mui/material';
import { Search as SearchIcon, X as CloseIcon} from 'lucide-react';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';


const guidData = [
  {
    question: "Can I purchase more than one of each item in the merch drops?",
    answer: "During the first merch drop of the Retro Grimace Pool Float, fans are limited to one per person. For the Free & Easy Market, innisfree and Kid Cudi merch drops, there are...",
    readMore: true,
    icon: <AccountCircleIcon sx={{ fontSize: 40, color: '#1e3a8a' }} />
  },
  {
    question: "Can I access the app using my smartwatch?",
    answer: "The app is not currently compatible with smartwatches.",
    readMore: true,
    icon: <EmailIcon sx={{ fontSize: 40, color: '#1e3a8a' }} />
  },
  {
    question: "I'm doing a paper. Can you answer some questions about yarlprops's for me?",
    answer: "All the information about Yarlprops that can be shared is available on yarlprops corporate website.",
    readMore: true,
    icon: <SmsIcon sx={{ fontSize: 40, color: '#1e3a8a' }} />
  },
  {
    question: "My promotion or discount was not applied?",
    answer: "We’re sorry about that. To review your receipt with a customer service representative, first identify who was handling your delivery—Uber Eats, DoorDash or Grubhub. Check the bottom of the receipt in your email to find out the vendor.",
    readMore: true,
    icon: <AccountCircleIcon sx={{ fontSize: 40, color: '#1e3a8a' }} />
  },
  {
    question: "Do I Need a Yarlprop's Login to Sign into Yarlprop's Wi-Fi?",
    answer: "No, you will not need a special login for McDonald’s Wi-Fi. Simply accept the terms of agreement in order to sign into McDonald’s internet services.Visit the McDonald's Merchandise website Golden Arches Unlimited to order McDonald's apparel online. For in-store shopping call your local McDonald's by using the McDonald's Restaurant Locator to find a restaurant, and ask for product avail...",
    readMore: true,
    icon: <EmailIcon sx={{ fontSize: 40, color: '#1e3a8a' }} />
  },
  {
    question: "Where can I buy Yarlprop's t-shirts/hats/gear?",
    answer: "Visit the Yarlprop's Merchandise website Golden Arches Unlimited to order Yarlprop's apparel online. For in-store shopping call your local Yarlprop's by using the Yarlprop's Restaurant Locator to find a restaurant, and ask for product avail...",
    readMore: true,
    icon: <SmsIcon sx={{ fontSize: 40, color: '#1e3a8a' }} />
  }
];


const Guide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);

  const filteredFAQs = guidData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (faq) => {
    setSelectedFAQ(faq);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFAQ(null);
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Get your questions answered
        </Typography>
        <Typography variant="body1" paragraph>
          Find answers to the most commonly asked questions below. Search for topics you're interested in or sort by category. If you still can't find the answer you are loocking for just  
          <Link href="/contact" underline="hover">
             {' Contact Us'}
          </Link> .
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for a question"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" sx={{ mb: 2 }}>
          {filteredFAQs.length} results found
        </Typography>
        <Grid container spacing={3}>
          {filteredFAQs.map((faq, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: 290 }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ mb: 2 }}>{faq.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {faq.question}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    paragraph 
                    sx={{ 
                      flexGrow: 1, 
                      overflow: 'auto',
                      mb: 1,
                      '&::-webkit-scrollbar': {
                        width: '0.4em'
                      },
                      '&::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.1)',
                        outline: '1px solid slategrey'
                      }
                    }}

                  >
                    {faq.answer}
                  </Typography>
                  {faq.readMore && (
                    <Button 
                      color="primary" 
                      onClick={() => handleOpenModal(faq)}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Read more
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <Button 
              onClick={handleCloseModal}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </Button>
            {selectedFAQ && (
              <>
                <Box sx={{ mb: 2 }}>{selectedFAQ.icon}</Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {selectedFAQ.question}
                </Typography>
                <Typography variant="body1">
                  {selectedFAQ.answer}
                </Typography>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

    </Box>
  );
};
export default Guide;

import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Paper,
  ThemeProvider,
  createTheme,
  Container,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { blue } from '@mui/material/colors';
import { useEffect } from 'react';
import { getGuide } from '../../api/db/guide';

const FAQSection = ({ title, faqs }) => {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState({});

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleFeedback = (index, isUseful) => {
    if (!feedback[index]) {
      setFeedback(prev => ({
        ...prev,
        [index]: isUseful
      }));
    }
  };

  return (
    <Box px={{ xs: 2, sm: 3, md: 4 }}>
      <Paper elevation={0} sx={{
        padding: '24px',
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)'
      }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: blue[700]
          }}
        >
          {title}
        </Typography>
        {faqs.map((faq, index) => {
          const isExpanded = expanded === `panel${index}`;
          return (
            <Accordion
              key={index}
              expanded={isExpanded}
              onChange={handleChange(`panel${index}`)}
              sx={{
                marginBottom: '16px',
                '&.MuiPaper-root': {
                  '&:before': {
                    display: 'none',
                  },
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}
                sx={{
                  minHeight: 80,
                  '&.Mui-expanded': {
                    minHeight: 80,
                    backgroundColor: blue[50]
                  },
                  '&:hover': {
                    backgroundColor: blue[50]
                  }
                }}
              >
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ mb: 3, padding: '24px' }}>{faq.answer}</Typography>
                {isExpanded && (
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant={feedback[index] === true ? "contained" : "outlined"}
                        sx={{
                          backgroundColor: feedback[index] === true ? blue[700] : 'transparent',
                          color: feedback[index] === true ? 'white' : blue[700],
                          borderColor: blue[700],
                          '&:hover': {
                            backgroundColor: feedback[index] === true ? blue[800] : blue[50],
                            borderColor: blue[700],
                          },
                          minWidth: '100px',
                          padding: '8px 16px'
                        }}
                        onClick={() => handleFeedback(index, true)}
                        disabled={feedback[index] !== undefined}
                      >
                        Useful
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant={feedback[index] === false ? "contained" : "outlined"}
                        sx={{
                          backgroundColor: feedback[index] === false ? blue[700] : 'transparent',
                          color: feedback[index] === false ? 'white' : blue[700],
                          borderColor: blue[700],
                          '&:hover': {
                            backgroundColor: feedback[index] === false ? blue[800] : blue[50],
                            borderColor: blue[700],
                          },
                          minWidth: '100px',
                          padding: '8px 16px'
                        }}
                        onClick={() => handleFeedback(index, false)}
                        disabled={feedback[index] !== undefined}
                      >
                        Not
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Paper>
    </Box>
  );
};

export default function Guide() {
  const [customerFAQs, setCustomerFAQs] = useState([])
  const [merchantFAQs, setMerchantFAQs] = useState([])

  useEffect(() => {
    const fetchDetails = async () => {
      const cdata = await getGuide('customers')
      setCustomerFAQs(cdata)
      const mdata = await getGuide('merchants')
      setMerchantFAQs(mdata)
    }
    fetchDetails()
  }, [])
  return (
    <Container maxWidth="xl">
      <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
        <Grid item xs={12} sm={12} md={6}>
          <FAQSection title="Customer" faqs={customerFAQs} />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <FAQSection title="Merchant" faqs={merchantFAQs} />
        </Grid>
      </Grid>
    </Container>
  );
};
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';

const data = [
  { name: 'Renter 1', amount: 400 },
  { name: 'Renter 2', amount: 300 },
  { name: 'Renter 3', amount: 500 },
  { name: 'Renter 4', amount: 200 },
  { name: 'Renter 5', amount: 278 },
  { name: 'Renter 6', amount: 189 },
];

const ChartContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const MonthlyRegistrationChart = () => {
  return (
    <ChartContainer maxWidth="md">
      <ChartTitle variant="h4" component="h1" align="center">
        Monthly Registration Amount vs Renter's Name
      </ChartTitle>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: '#8884d8' }} />
          <YAxis tick={{ fill: '#8884d8' }} />
          <Tooltip contentStyle={{ backgroundColor: '#8884d8', color: '#fff' }} />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" barSize={50} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MonthlyRegistrationChart;

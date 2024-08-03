//"mongodb+srv://Cluster33761:X2dxeXpaUktf@cluster33761.q1ofbfy.mongodb.net/yarlprops?retryWrites=true&w=majority"

const express = require('express');
const userRouter = require('./routes/users');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

const whitelist = ['https://yarlprops.web.app', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors({origin:'https://yarlprops.web.app'}));

const port = 5000;

mongoose.connect("mongodb+srv://Cluster33761:X2dxeXpaUktf@cluster33761.q1ofbfy.mongodb.net/yarlprops?retryWrites=true&w=majority")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', userRouter);

app.get('/api/test', (req, res) => {
  res.send('CORS is configured properly!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

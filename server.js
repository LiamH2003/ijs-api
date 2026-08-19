const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB verbonden'))
  .catch(err => console.error(err));

app.get('/', (req, res) => res.send('API draait'));
app.use('/admin', authRoutes);
app.use('/orders', orderRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route niet gevonden' }));

app.listen(process.env.PORT || 3000, () => console.log('Server gestart'));
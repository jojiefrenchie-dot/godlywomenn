require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const imagesRouter = require('./routes/images');
const articlesRouter = require('./routes/articles');
const marketplaceRouter = require('./routes/marketplace');
const usersRouter = require('./routes/users');

const { router: authRouter } = require('./routes/auth');

app.use('/api/images', imagesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.send('Express + MongoDB backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

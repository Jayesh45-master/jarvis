const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const sequelize = require('./db');              // Sequelize instance
const User = require('./models/User');          // Sequelize model definition

const app = express();

// Gemini AI Init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro-latest",
  generationConfig: {
    temperature: 0.9,
    topP: 1,
    topK: 32,
    maxOutputTokens: 2048,
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
  })
);

// Passport Config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Sync Sequelize DB
sequelize.sync({ alter: true })  // or { force: true } for full wipe
  .then(() => console.log('✅ Database synced'))
  .catch((err) => console.error('❌ Error syncing database:', err));

// Routes
app.use('/auth', require('./routes/authroutes'));


// Gemini Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      reply: text,
      status: 'success'
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      error: 'Error processing your message',
      details: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

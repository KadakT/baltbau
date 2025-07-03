const express = require('express');
const path = require('path');
const helmet = require('helmet');
const app = express();

// Use helmet
app.use(helmet());

// Set a custom CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "https:"],           
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
    },
  })
);

// Static files
const oneMonth = 1000 * 60 * 60 * 24 * 30; 

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: oneMonth, 
  setHeaders: function (res, path) {
    if (path.endsWith('.html') || path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

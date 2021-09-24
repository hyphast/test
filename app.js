const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json());
app.use(cookieParser());

const whitelist = ['http://localhost:3000', 'https://bubnovskiy-admin-panel.netlify.app', 'http://localhost:3001'];
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use((req, res, next) => {
  res.append('Access-Control-Expose-Headers', 'Content-Range');
  next();
});

app.use('/api', require('./routes/index'));
app.use('/api/admin', require('./routes/admin'));

app.use(errorMiddleware);

// if (process.env.NODE_ENV === 'production') {
//   app.use('/', express.static(path.join(__dirname, '..', 'client', 'build')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
//   })
// }

const PORT = config.get('port') || 5000;

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}

start();
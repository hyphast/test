const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = 5000;

async function start() {
    const mongoUri = "mongodb+srv://admin:admin@cluster0.0xl8a.mongodb.net/app?retryWrites=true&w=majority";
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}

start();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

const app = express();
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

const configMongo = process.env.DATABASE_URL;
const port = process.env.PORT;

mongoose.connect(configMongo,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use(cors());

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


app.listen(port);
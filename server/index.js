const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload = require('express-fileupload')
const userRoutes = require('./Routes/userRoutes')
const postRoutes = require('./Routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(upload())
app.use('/Uploads', express.static(__dirname + '/Uploads'));

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

app.use(notFound)
app.use(errorHandler)


const dbConnect = async () => {
    try {
        await connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};
dbConnect()


const startServer = () => {
    app.listen(port, () => {
        console.log(`Server running on port http://localhost:${port} `);
    });
};
startServer()


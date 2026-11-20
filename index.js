
require('dotenv').config();

const express = require('express');
const sequelize = require('./config/database');

require('./models');

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Assignment 5 API is running'
    });
});

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        console.log('Database connected and tables created successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Database connection error:', error);
    });

const express = require("express");
const cors = require("cors");
const app = express();
const dbconfig = require('./db');
const restaurantsRoute = require('./routes/restaurantsRoute');
const usersRoute = require('./routes/usersRoute');
const ordersRoute = require('./routes/ordersRoute');
const foodItemsRoute = require('./routes/fooditemsRoute');
const paymentsRoute = require('./routes/paymentsRoute');

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/restaurants', restaurantsRoute);
app.use('/api/users', usersRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/fooditems', foodItemsRoute);
app.use('/api/payments', paymentsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`Server running on port ${port}`));

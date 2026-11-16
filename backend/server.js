require("dotenv").config();
const express = require("express");
const cors = require("cors");
const activitiesRoutes = require("./src/routes/activities.routes");
const authRoutes = require('./src/routes/auth.routes');
const eventsRoutes = require('./src/routes/events.routes');
const staysRoutes = require('./src/routes/stays.routes');
const bookingRoutes = require('./src/routes/bookings.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/stays', staysRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventsRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRoutes);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


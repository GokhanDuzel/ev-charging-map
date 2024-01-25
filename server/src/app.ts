import express from 'express';
import chargingStationsRoutes from "./routes/chargingStationRoutes"
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

// Define your routes and middleware here
app.use('/api', chargingStationsRoutes);

export default app;



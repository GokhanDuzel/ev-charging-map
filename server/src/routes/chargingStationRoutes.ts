// chargingStationsRoutes.ts
import { Router } from 'express';
import { getFirst10ChargingStations } from '../controllers/chargingStationController';

const router = Router();

// Route to get the first 10 charging stations
router.get('/charging-stations', getFirst10ChargingStations);

export default router;

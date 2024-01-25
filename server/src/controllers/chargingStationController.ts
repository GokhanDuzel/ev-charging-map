// chargingStationsController.ts
import { Request, Response } from 'express';
import axios from 'axios';

// Define your Open Charge Map API URL and API key
const OPEN_CHARGE_MAP_API_URL = 'https://api.openchargemap.io/v3/poi'; // Replace with your API URL
const API_KEY = process.env.OPEN_CHARGE_MAP_API_KEY; // Replace with your API key

// Controller function to get the first 10 charging stations
export async function getFirst10ChargingStations(req: Request, res: Response): Promise<void> {

  try {
    const params = {
      key: API_KEY,
      maxresults: 500,
      countrycode: 'CA',
      latitude: 45.4215,
      longitude: -75.6972,
    };
    // Make an HTTP GET request to the Open Charge Map API
    const response = await axios.get(OPEN_CHARGE_MAP_API_URL, { params });
    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      // Parse the JSON response data
      const data = response.data;
      // Extracting specific fields from each station
      const stations = data.map((station: { AddressInfo: { Latitude: any; Longitude: any; }; ID: any; }) => {
        if (station.AddressInfo) {
          return [
            station.ID, 
            station.AddressInfo.Latitude, 
            station.AddressInfo.Longitude
          ];
        }
        return null;
      }).filter((station: null) => station !== null);

      // Send the processed data as response
      res.json(stations);
    } else {
      // Handle non-200 responses
      res.status(response.status).json({ error: 'API request failed' });
    }
  } catch (error) {
    // Handle errors (e.g., network issues, response status 4xx/5xx)
    console.error(error);
    res.status(500).json({ error: 'API request error' });
  }
};
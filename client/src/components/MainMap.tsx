import { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";

const MainMap = () => {
  async function fetchChargingStations() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/charging-stations"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Convert the data to the expected format
      const formattedData = data.map((item: number[], index: number) => ({
        key: index.toString(), // Use index as the key or choose another unique identifier
        lat: item[1], // Extract latitude from the array
        lng: item[2], // Extract longitude from the array
      }));

      return formattedData;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchChargingStations().then((data) => {
      setStations(data);
      console.log(data);
    });
  }, []);

  const position = { lat: 45.4215, lng: -75.6972 };

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ''}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map zoom={9} center={position} mapId={"d8c604afef3c7d81"}>
          <Markers points={stations} />
        </Map>
      </div>
    </APIProvider>
  );
};

export default MainMap;

type Point = { key: string; lat: number; lng: number };
type Props = { points: Point[] };

const Markers = ({ points }: Props) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers])

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if(marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    })
  };

  console.log(markers);

  return (
    <>
      {points.map((point) => (
        <AdvancedMarker position={point} key={point.key} ref={marker => setMarkerRef(marker, point.key)}>
          <Pin />
        </AdvancedMarker>
      ))}
    </>
  );
};

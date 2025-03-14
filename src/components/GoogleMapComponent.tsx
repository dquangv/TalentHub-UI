import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import api from "../api/axiosConfig";

interface Location {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 10.818892554353637,
  lng: 106.68576034065369,
};

const getClusterStyle = (count: number) => ({
  textColor: "white",
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="#4F46E5"/>
      <circle cx="20" cy="20" r="16" fill="#6366F1"/>
    </svg>
  `)}`,
  height: 40,
  width: 40,
  textSize: 14,
  anchorText: [0, 0],
});

const singleMarkerStyle = {
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#EF4444"/>
      <text x="16" y="21" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">1</text>
    </svg>
  `)}`,
  scaledSize: { width: 32, height: 32 },
};

const GoogleMapComponent = () => {
  const [points, setPoints] = useState<Location[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/v1/account/locations");
        const data: any = response;
        const validLocations = data?.data.filter(
          (location: any) => location.lat !== 0 && location.lng !== 0
        );
        setPoints(validLocations);
      } catch (err) {
        setError("Error fetching locations");
        console.error("Error fetching locations:", err);
      }
    };

    fetchLocations();
  }, []);

  const options = {
    gridSize: 60,
    maxZoom: 16,
    minimumClusterSize: 2,
    zoomOnClick: true,
    averageCenter: true,
    styles: [getClusterStyle(1)],
    calculator: (markers: google.maps.Marker[]) => {
      const count = markers.length;
      return {
        text: count.toString(),
        index: 1,
        title: `${count} người dùng`,
      };
    },
  };

  const mapOptions = {
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
    minZoom: 4, // Country level
    maxZoom: 16, // District level
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <LoadScript googleMapsApiKey="AIzaSyAR6uR3hZso8GoKWHfWTVlJRwda_4BO-oU">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          options={mapOptions}
        >
          <MarkerClusterer options={options}>
            {(clusterer) => (
              <>
                {points.map((point, index) => (
                  <Marker
                    key={`${point.lat}-${point.lng}-${index}`}
                    position={{ lat: point.lat, lng: point.lng }}
                    clusterer={clusterer}
                    icon={singleMarkerStyle}
                  />
                ))}
              </>
            )}
          </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
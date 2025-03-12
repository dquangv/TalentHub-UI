import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import api from "@/api/axiosConfig";

interface Location {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 10.818892554353637,
  lng: 106.68576034065369,
};

const clusterStyles = [
  {
    textColor: "white",
    url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
    height: 53,
    width: 53,
    textSize: 16,
    anchorText: [0, 0],
  },
];

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
    gridSize: 30,
    maxZoom: 15,
    minimumClusterSize: 2,
    styles: clusterStyles,
    zoomOnClick: true,
    averageCenter: true,
    calculator: (markers: google.maps.Marker[], numStyles: number) => {
      const count = markers.length;
      return {
        text: count.toString(),
        index: Math.min(Math.floor(Math.log10(count)), numStyles - 1),
        title: `${count} người dùng trong khu vực này`,
      };
    },
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
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          <MarkerClusterer options={options}>
            {(clusterer) => (
              <>
                {points.map((point, index) => (
                  <Marker
                    key={`${point.lat}-${point.lng}-${index}`}
                    position={{ lat: point.lat, lng: point.lng }}
                    clusterer={clusterer}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      scaledSize: new google.maps.Size(30, 30),
                    }}
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

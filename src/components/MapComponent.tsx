import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "400px",
};

var center = {
  lat: 10.818892554353637, 
  lng: 106.68576034065369,
};


const GoogleMapComponent = ({ otherLocation }: any) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null, label: "" });
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<any[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!userInfo || !userInfo.lat || !userInfo.lng) {
      navigate("/login");
      return;
    }

    setUserLocation({ lat: userInfo.lat, lng: userInfo.lng, label: "You" });
    setPoints((prev) => [...prev, otherLocation]);
  }, [otherLocation, navigate]);

  const handleMarkerClick = (point) => {
    setSelectedPoint(point);
  };
  console.log("userLocation ", userLocation)
  console.log("otherLocation ", otherLocation)
  return (
    <LoadScript googleMapsApiKey="AIzaSyAR6uR3hZso8GoKWHfWTVlJRwda_4BO-oU">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation.lat ? userLocation : center}
        zoom={userLocation.lat ? 15 : 10}
      >
        {userLocation.lat && (
          <Marker
            position={{ lat: userLocation.lat, lng: userLocation.lng }}
            label="You"
          />
        )}

        {points.map((point, index) => (
          <Marker
            key={index}
            position={{ lat: point.lat, lng: point.lng }}
            label={point.label}
            onClick={() => handleMarkerClick(point)}
          />
        ))}

        {userLocation.lat && !loading && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "white",
              padding: "10px",
            }}
          >
            <h3>Vị trí hiện tại:</h3>
            <p>Địa chỉ: {userAddress}</p>
          </div>
        )}

        {selectedPoint && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              backgroundColor: "white",
              padding: "10px",
            }}
          >
            <h3>Thông tin điểm đã chọn:</h3>
            <p>Điểm: {selectedPoint.label}</p>
            <p>
              Vị trí: {selectedPoint.lat}, {selectedPoint.lng}
            </p>
          </div>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;

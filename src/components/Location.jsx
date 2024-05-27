import { useEffect, useState } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import Weather from "./Weather";
import { GOOGLE_MAPS_API_KEY } from "../config";

const Location = () => {
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (loc) => {
          setLocationData({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          });
        },
        (error) => console.log("error", error),
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
  }, []);

  const handleMapClick = (event) => {
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    setLocationData({ lat, lng });
  };

  return (
    <div>
      {locationData ? (
        <div className="card">
          <div className="card__map">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={{ ...locationData }}
                zoom={15}
                onClick={handleMapClick}
              >
                <Marker position={{ ...locationData }}></Marker>
              </GoogleMap>
            </LoadScript>
          </div>
          <Weather location={locationData} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Location;

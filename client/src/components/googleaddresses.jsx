import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// API Keys (should be moved to environment variables in production)
const LOCATIONIQ_TOKEN = "pk.2facabff1fbb7c3da67ac5b80179b3e3";
const GOOGLE_MAP_API_KEY = "AIzaSyAMPrwC9ii-4QvIRA_75CbxSp-6keDC6aM";

// Map container styles
const containerStyle = {
  width: "100%",
  height: "400px",
  marginTop: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const LocationMap = () => {
  // State management
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationMethod, setLocationMethod] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });

  // Fetch address when coordinates change
  useEffect(() => {
    if (coords) {
      fetchAddress(coords.lat, coords.lng);
      setLastUpdated(new Date());
    }
  }, [coords]);

  // Main location acquisition function
  const getCurrentLocation = async () => {
    setLoading(true);
    setLocationMethod(null);
    
    try {
      // Try high-accuracy GPS first
      try {
        const gpsPosition = await getGeoLocationPosition({ highAccuracy: true });
        setLocationMethod("High Accuracy GPS");
        updatePosition(gpsPosition);
        return;
      } catch (gpsError) {
        console.log("High accuracy GPS failed, trying standard accuracy");
      }

      // Try standard accuracy GPS
      try {
        const gpsPosition = await getGeoLocationPosition({ highAccuracy: false });
        setLocationMethod("Standard GPS");
        updatePosition(gpsPosition);
        return;
      } catch (standardGpsError) {
        console.log("Standard GPS failed, trying WiFi positioning");
      }

      // Fallback to WiFi positioning
      try {
        const wifiPosition = await getWifiPosition();
        setLocationMethod("WiFi/Cell Tower");
        updatePosition(wifiPosition);
      } catch (wifiError) {
        throw new Error("All location methods failed");
      }
    } catch (error) {
      console.error("Location error:", error);
      alert("Couldn't get precise location. Please try manual selection.");
    } finally {
      setLoading(false);
    }
  };

  // Wrapper for geolocation API
  const getGeoLocationPosition = (options = {}) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Timeout"));
      }, 20000);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timer);
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        },
        {
          enableHighAccuracy: options.highAccuracy || false,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  };

  // WiFi positioning fallback
  const getWifiPosition = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_MAP_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ considerIp: true })
        }
      );
      const data = await response.json();
      return {
        lat: data.location.lat,
        lng: data.location.lng
      };
    } catch (error) {
      console.error("WiFi positioning failed:", error);
      // Final fallback - use IP-based location from LocationIQ
      const ipResponse = await fetch(
        `https://us1.locationiq.com/v1/ip.php?key=${LOCATIONIQ_TOKEN}&format=json`
      );
      const ipData = await ipResponse.json();
      return {
        lat: parseFloat(ipData.lat),
        lng: parseFloat(ipData.lon)
      };
    }
  };

  // Update position state
  const updatePosition = (position) => {
    setCoords({ lat: position.lat, lng: position.lng });
  };

  // Reverse geocoding to get address
  const fetchAddress = async (lat, lon) => {
    try {
      setAddress("Fetching address...");
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_TOKEN}&lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      setAddress(data.display_name || "Address not available");
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      setAddress("Error fetching address");
    }
  };

  // Address search autocomplete
  const handleSearchChange = async (e) => {
    const input = e.target.value;
    setSearchAddress(input);
    
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_TOKEN}&q=${input}&limit=5&format=json`
      );
      const data = await res.json();
      const results = data.map((item) => ({
        label: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
      setSuggestions(results);
    } catch (err) {
      console.error("Autocomplete error:", err);
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (sugg) => {
    setCoords({ lat: sugg.lat, lng: sugg.lng });
    setAddress(sugg.label);
    setSearchAddress(sugg.label);
    setSuggestions([]);
    setLocationMethod("Manual Selection");
  };

  // Handle map clicks
  const handleMapClick = async (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setCoords({ lat: newLat, lng: newLng });
    setLocationMethod("Map Selection");
    await fetchAddress(newLat, newLng);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#333", marginBottom: "20px" }}>Location Finder</h2>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ position: "relative", marginBottom: "15px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Search address..."
              value={searchAddress}
              onChange={handleSearchChange}
              style={{ 
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
            <button 
              onClick={getCurrentLocation} 
              style={{ 
                padding: "10px 15px",
                backgroundColor: "#4285F4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
                minWidth: "140px"
              }}
              disabled={loading}
            >
              {loading ? (
                <span>Locating...</span>
              ) : (
                <span>Use My Location</span>
              )}
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                listStyle: "none",
                padding: 0,
                margin: 0,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "0 0 4px 4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                zIndex: 100,
              }}
            >
              {suggestions.map((sugg, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSuggestionClick(sugg)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    fontSize: "14px",
                    transition: "background 0.2s",
                    ":hover": {
                      backgroundColor: "#f5f5f5"
                    }
                  }}
                >
                  {sugg.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {loading && (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px",
          marginBottom: "15px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px"
        }}>
          <div style={{ width: "20px", height: "20px", border: "3px solid #f3f3f3", borderTop: "3px solid #3498db", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <span>Acquiring location ({locationMethod || 'best available method'})...</span>
        </div>
      )}

      {coords && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ 
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            borderLeft: "4px solid #4285F4"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <div>
                <strong style={{ color: "#555" }}>Location Source:</strong> {locationMethod}
              </div>
              <div>
                <strong style={{ color: "#555" }}>Last Updated:</strong> {lastUpdated?.toLocaleTimeString()}
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div>
                <strong style={{ color: "#555" }}>Latitude:</strong> {coords.lat.toFixed(6)}
              </div>
              <div>
                <strong style={{ color: "#555" }}>Longitude:</strong> {coords.lng.toFixed(6)}
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <strong style={{ color: "#555" }}>Address:</strong> {address}
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <a
              href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                padding: "8px 12px",
                backgroundColor: "#34a853",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <span>Open in Google Maps</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>

          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={coords}
              zoom={15}
              onClick={handleMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                styles: [
                  {
                    featureType: "poi",
                    stylers: [{ visibility: "off" }]
                  }
                ]
              }}
            >
              <Marker 
                position={coords} 
                icon={{
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeColor: "#fff",
                  strokeWeight: 1,
                  scale: 1.5
                }}
              />
            </GoogleMap>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LocationMap;
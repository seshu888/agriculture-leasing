import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const greenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapLocation {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  price?: number;
}

export interface MultipleLocationsMapProps {
  locations: MapLocation[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

const AP_CENTER: [number, number] = [16.0, 80.5];

const MultipleLocationsMap = ({
  locations,
  height = '400px',
  center = AP_CENTER,
  zoom = 8,
}: MultipleLocationsMapProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (locations.length === 0) return null;
  if (!mounted) {
    return (
      <div
        style={{
          height,
          width: '100%',
          borderRadius: 12,
          background: '#e8f5e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2e7d32',
          fontWeight: 600,
        }}
      >
        Loading map…
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '12px', minHeight: 300 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={greenIcon}>
          <Popup>
            <strong>{loc.title}</strong>
            {loc.price != null && (
              <div style={{ marginTop: 4 }}>₹{loc.price.toLocaleString()}/acre</div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MultipleLocationsMap;

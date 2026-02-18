import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapViewProps {
  latitude: number;
  longitude: number;
  title?: string;
  height?: string;
  zoom?: number;
  greenMarker?: boolean;
}

const MapView = ({
  latitude,
  longitude,
  title,
  height = '300px',
  zoom = 14,
  greenMarker = true,
}: MapViewProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
      center={[latitude, longitude]}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '12px', minHeight: 200 }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={greenMarker ? greenIcon : DefaultIcon}>
        {title != null && title !== '' && <Popup>{title}</Popup>}
      </Marker>
    </MapContainer>
  );
};

export default MapView;

'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Navigation, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

export default function MapPage() {
  const [radius, setRadius] = useState(5);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [position, setPosition] = useState<[number, number]>([40.7128, -74.0060]); // Default NYC

  const handleEnableLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setLocationEnabled(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationEnabled(true); // Fallback to default
        }
      );
    } else {
      setLocationEnabled(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><MapPin className="h-8 w-8 text-primary" /> Nearby Wishes</h1>
          <p className="text-white/60 mt-1">Discover and fulfill wishes in your local area (100% Free OpenStreetMap)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="glass">
            <CardHeader><CardTitle className="text-lg">Filters</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">Search Radius</label>
                <div className="flex gap-2">
                  {[1, 5, 10].map((r) => (
                    <button key={r} onClick={() => setRadius(r)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${radius === r ? 'bg-primary text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                      {r}km
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Privacy First</p>
                    <p className="text-xs text-white/60 mt-1">Your exact location is never shared. Only an approximate radius is shown to others.</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleEnableLocation} className="w-full flex items-center justify-center gap-2">
                <Navigation className="h-4 w-4" /> {locationEnabled ? 'Location Active' : 'Enable Location'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="glass h-[600px] p-0 overflow-hidden relative">
            {locationEnabled ? (
              <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    <div className="text-gray-800">
                      <p className="font-bold">Your Approximate Location</p>
                      <p className="text-sm">Searching within {radius}km radius</p>
                    </div>
                  </Popup>
                </Marker>
                {/* Mock nearby wish marker */}
                <Marker position={[position[0] + 0.01, position[1] + 0.01]}>
                  <Popup>
                    <div className="text-gray-800">
                      <p className="font-bold">Gaming Laptop Wish</p>
                      <p className="text-sm">$850 / $1500 fulfilled</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-darker/50">
                <div className="text-center p-8">
                  <MapPin className="h-16 w-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Location Required</h3>
                  <p className="text-white/60 mb-6 max-w-md">Enable location access to see wishes near you. We use free OpenStreetMap and respect your privacy.</p>
                  <Button onClick={handleEnableLocation}>Enable Location</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
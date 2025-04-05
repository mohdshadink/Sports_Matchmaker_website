import React, { useState } from 'react';
import { MapPin, Calendar, Users, Trophy, Search, Mail, MessageSquare, ShoppingBasket as Basketball, FolderRoot as Football, Ticket as Cricket, Plus, ChevronDown, Instagram, Twitter, Facebook } from 'lucide-react';

function App() {
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [isJoinGameOpen, setIsJoinGameOpen] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null, address: '' });
  const [locationError, setLocationError] = useState('');

  const handleGetLocation = () => {
    setLocationError('');
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          setLocation({
            lat: latitude,
            lng: longitude,
            address: data.display_name
          });
        } catch (error) {
          console.error("Error getting location address:", error);
          setLocationError("Could not get address. Please enter it manually.");
          setLocation({
            lat: latitude,
            lng: longitude,
            address: ''
          });
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access was denied. Please enable location permissions or enter your location manually.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable. Please try again or enter your location manually.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again or enter your location manually.");
            break;
          default:
            setLocationError("An error occurred while getting your location. Please try again or enter your location manually.");
        }
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } else {
      setLocationError("Geolocation is not supported by your browser. Please enter your location manually.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-green-500 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80")',
            filter: 'brightness(0.6)'
          }}
        ></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl font-bold text-white mb-6">Gamefind</h1>
          <p className="text-2xl text-white mb-12">Find, Join, or Host Games Near You</p>
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => setIsCreateGameOpen(true)}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Create a Game
            </button>
            <button 
              onClick={() => setIsJoinGameOpen(true)}
              className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Search size={20} />
              Join a Game
            </button>
          </div>
        </div>
      </section>

      {/* Create Game Form */}
      {isCreateGameOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold mb-6">Create a Game</h2>
            <form className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium mb-2">Game Type</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Basketball, name: 'Basketball' },
                    { icon: Football, name: 'Football' },
                    { icon: Cricket, name: 'Cricket' },
                  ].map((sport) => (
                    <button
                      key={sport.name}
                      type="button"
                      className="p-4 border rounded-lg hover:border-blue-500 flex flex-col items-center gap-2"
                    >
                      <sport.icon size={24} />
                      <span>{sport.name}</span>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Or enter custom game type..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Can't find your sport? Enter it manually!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Players</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter number of players"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Game Type</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>Casual Game</option>
                    <option>Tournament</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border rounded-lg"
                      placeholder="Share your location or enter manually"
                      value={location.address}
                      onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <MapPin size={20} />
                    </button>
                  </div>
                  {locationError && (
                    <div className="p-3 bg-red-50 rounded-lg text-sm text-red-700">
                      ⚠️ {locationError}
                    </div>
                  )}
                  {location.lat && location.lng && !locationError && (
                    <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      📍 Location shared successfully! Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Add any special notes..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
                >
                  Create Game
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateGameOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Game Modal */}
      {isJoinGameOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold mb-6">Join a Game</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    placeholder="Enter game code or search by location..."
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">
                    Basketball
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">
                    Football
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">
                    Cricket
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
                    More...
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleGetLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <MapPin size={18} />
                    Use My Location
                  </button>
                  <span className="text-gray-500">or</span>
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="Enter location manually"
                  />
                </div>

                {locationError && (
                  <div className="p-3 bg-red-50 rounded-lg text-sm text-red-700">
                    ⚠️ {locationError}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Games Nearby</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">Friendly Basketball Match</h4>
                        <p className="text-sm text-gray-600">Central Park Court</p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">3 spots left</span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        Today, 5:00 PM
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        5v5
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy size={16} />
                        Casual
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">Weekend Football Tournament</h4>
                        <p className="text-sm text-gray-600">Community Sports Complex</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">1 spot left</span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        Tomorrow, 2:00 PM
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        11v11
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy size={16} />
                        Tournament
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsJoinGameOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">About Gamefind</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Find Games</h3>
              <p className="text-gray-600">Discover sports games happening in your area and join players with similar interests.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <p className="text-gray-600">Build a community of local players and make new friends through sports.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Compete</h3>
              <p className="text-gray-600">Organize tournaments or join casual games to stay active and have fun.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Send Message
              </button>
            </form>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <p className="flex items-center gap-3">
                    <Mail size={20} className="text-blue-600" />
                    support@gamefind.com
                  </p>
                  <p className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-blue-600" />
                    Live chat available 24/7
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200">
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2025 Gamefind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
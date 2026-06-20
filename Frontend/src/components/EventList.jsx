import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const EventList = () => {
   const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getEvents = async () => {
    try {
      const response = await fetch(
        `https://assignment-qusi18q1j-ratnesh-pals-projects.vercel.app`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch events"
        );
      }

      setEvents(data.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  // Loading UI
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>

        <h2 className="mt-5 text-2xl font-bold text-indigo-700">
          Loading Events...
        </h2>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-red-50">
        <div className="text-7xl">❌</div>

        <h2 className="mt-4 text-3xl font-bold text-red-600">
          Something Went Wrong
        </h2>

        <p className="mt-2 text-lg text-red-500">
          {error}
        </p>

        <button
          onClick={getEvents}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-8">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
        🎟️ Available Events
      </h1>

      {events.length === 0 ? (
        <div className="text-center text-2xl font-semibold text-gray-600 mt-20">
          No Events Available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <h2 className="text-2xl font-bold mb-4">
                {event.name}
              </h2>

              <div className="space-y-3">
                <p className="bg-white/20 p-3 rounded-lg">
                  📍 <strong>Venue:</strong> {event.venue}
                </p>

                <p className="bg-white/20 p-3 rounded-lg">
                  📅 <strong>Date:</strong> {event.date}
                </p>

                <p className="bg-white/20 p-3 rounded-lg">
                  ⏰ <strong>Time:</strong> {event.time}
                </p>

                <p className="bg-white/20 p-3 rounded-lg">
                  💺 <strong>Total Seats:</strong>{" "}
                  {event.totalSeats}
                </p>
              </div>

              <button onClick={()=>{
                 navigate(`/event/${event._id}`)
              }} className="w-full mt-6 bg-white text-purple-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition">
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
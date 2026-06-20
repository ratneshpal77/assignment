import { useState, useEffect } from "react";

const SeatGrid = ({ seats = [] }) => {
  console.log("Seats received:", seats);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatData, setSeatData] = useState(seats);
  const [reservation, setReservation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!reservation) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          alert("Reservation Expired");

          setReservation(null);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  useEffect(() => {
    setSeatData(seats);
  }, [seats]);

  const handleSeatClick = (seat) => {
    if (seat.status !== "available") return;

    setSelectedSeats((prev) => {
      const exists = prev.includes(seat.seatNumber);

      if (exists) {
        return prev.filter((s) => s !== seat.seatNumber);
      }

      return [...prev, seat.seatNumber];
    });
  };

  const confirmBooking = async () => {
    try {
      if (!reservation?._id) {
        return alert("No active reservation found");
      }

      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: reservation._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Update reserved seats to booked
      setSeatData((prev) =>
        prev.map((seat) =>
          reservation.seatNumbers.includes(seat.seatNumber)
            ? { ...seat, status: "booked" }
            : seat,
        ),
      );

      alert("✅ Booking Confirmed Successfully");

      setReservation(null);
      setTimeLeft(0);
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  const reserveSeats = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "6a34e438d443a69f80335f17",
          eventId: seatData[0]?.eventId,
          seatNumbers: selectedSeats,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSeatData((prev) =>
        prev.map((seat) =>
          selectedSeats.includes(seat.seatNumber)
            ? { ...seat, status: "reserved" }
            : seat,
        ),
      );

      setSelectedSeats([]);

      setReservation(data.reservation);
      setTimeLeft(10);

      alert("Seats Reserved Successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {reservation && (
        <div className="max-w-md mx-auto mb-8 bg-yellow-100 border border-yellow-400 rounded-xl p-4 text-center">
          <h2 className="text-xl font-bold text-yellow-700">
            Reservation Active
          </h2>

          <p className="text-5xl font-bold text-red-600 mt-2">{timeLeft}s</p>

          <p className="mt-2 text-gray-600">
            Complete booking before timer expires
          </p>
        </div>
      )}
      <h1 className="text-4xl font-bold text-center mb-10">
        Select Your Seats
      </h1>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-10 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-yellow-400 rounded"></div>
          <span>Reserved</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded"></div>
          <span>Booked</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4 max-w-4xl mx-auto">
        {seats.length === 0 ? (
          <div className="col-span-full text-center text-xl text-gray-500">
            No Seats Available
          </div>
        ) : (
          seatData.map((seat) => {
            const isSelected = selectedSeats.includes(seat.seatNumber);

            let color = "bg-green-500 hover:bg-green-600";

            if (seat.status === "reserved") {
              color = "bg-yellow-400 cursor-not-allowed";
            }

            if (seat.status === "booked") {
              color = "bg-red-500 cursor-not-allowed";
            }

            if (isSelected) {
              color = "bg-blue-500";
            }

            return (
              <button
                key={seat._id}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.status !== "available"}
                className={`${color} text-white font-bold py-3 rounded-lg transition duration-300`}
              >
                {seat.seatNumber}
              </button>
            );
          })
        )}
      </div>

      {/* Selected Seats */}
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold mb-3">Selected Seats</h2>

        <p className="text-lg">
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "No seats selected"}
        </p>

        {reservation && (
          <button
            onClick={confirmBooking}
            className="ml-4 mt-5 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirm Booking
          </button>
        )}

        <button
          onClick={reserveSeats}
          disabled={selectedSeats.length === 0}
          className={`mt-5 px-8 py-3 rounded-lg text-white ${
            selectedSeats.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Reserve Seats
        </button>
      </div>
    </div>
  );
};

export default SeatGrid;

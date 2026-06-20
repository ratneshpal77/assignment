import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SeatGrid from "./SeatGrid";

const SeatSelectionPage = () => {
  const { id } = useParams();
  const [seats, setSeats] = useState([]);

  useEffect(() => {
  fetch(`http://localhost:3000/api/events/${id}/seats`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Full API Response:", data);
      setSeats(data.seats || []);
    })
    .catch((err) => console.log(err));
}, [id]);

  return <SeatGrid seats={seats} eventId={id} />;
};

export default SeatSelectionPage;
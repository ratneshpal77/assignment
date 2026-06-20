import { BrowserRouter, Routes, Route } from "react-router-dom";

import EventList from "./components/EventList.jsx";

import SeatGrid from "./components/SeatGrid.jsx";
import SeatSelectionPage from "./components/SeatSelectedPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventList />} />

        <Route path="/event/:id" element={<SeatSelectionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

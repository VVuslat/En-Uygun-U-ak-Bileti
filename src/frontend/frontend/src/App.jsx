import React, { useState } from 'react';
function App() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFlights([]);
    try {
      const response = await fetch(
        `http://localhost:5001/api/flights?origin=${origin}&destination=${destination}&date=${date}`
      );
      if (!response.ok) throw new Error("Veri alınamadı");
      const data = await response.json();
      setFlights(data);
    } catch (err) {
      setError("Uçuşlar alınamadı. Lütfen tekrar deneyin.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #eee" }}>
      <h1 style={{ textAlign: "center", color: "#1976d2" }}>En Uygun Uçak Bileti</h1>
      <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Kalkış (örn: IST)"
          required
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Varış (örn: ESB)"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} style={{ background: "#1976d2", color: "#fff", border: 0, borderRadius: 6, padding: 10, fontWeight: 600 }}>
          {loading ? "Aranıyor..." : "Uçuş Ara"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}
      {flights.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2>Uygun Uçuşlar</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {flights.map((flight, idx) => (
              <li key={idx} style={{ marginBottom: 16, background: "#f5f5f5", borderRadius: 8, padding: 12 }}>
                <b>{flight.origin}</b> → <b>{flight.destination}</b> | {flight.date} | <span style={{ color: "#1976d2" }}>{flight.price}₺</span>
                {flight.link && (
                  <a href={flight.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 16, color: "#388e3c" }}>
                    Satın Al
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

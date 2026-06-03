import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import CityForm from "./components/CityForm";
import "./App.css";

const MIN_CITIES = 5;
const MAX_CITIES = 10;

export default function App() {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [editing, setEditing] = useState(null); // weather row or null
  const [adding, setAdding] = useState(false);

  async function loadWeather() {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await axios.get("/api/weather");
      setWeather(res.data);
    } catch (err) {
      setLoadError(
        err?.response?.data?.error ||
          "Failed to load weather. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather();
  }, []);

  const count = weather.length;
  const canAdd = count < MAX_CITIES;
  const canDelete = count > MIN_CITIES;

  async function handleAdd(data) {
    const res = await axios.post("/api/cities", data);
    setWeather((prev) => [...prev, res.data.weather]);
    setAdding(false);
  }

  async function handleEdit(data) {
    const res = await axios.put(`/api/cities/${editing.id}`, data);
    setWeather((prev) =>
      prev.map((w) => (w.id === editing.id ? res.data.weather : w)),
    );
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this city?")) return;
    try {
      await axios.delete(`/api/cities/${id}`);
      setWeather((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to delete city.");
    }
  }

  const editingInitial = useMemo(
    () =>
      editing
        ? { name: editing.city, lat: editing.lat, lon: editing.lon }
        : null,
    [editing],
  );

  return (
    <div className="app">
      <header>
        <h1>Weather Dashboard</h1>
        <p className="subtitle">
          {count} of {MAX_CITIES} cities (min {MIN_CITIES})
        </p>
      </header>

      {loadError && <div className="error banner">{loadError}</div>}

      <section className="toolbar">
        {!adding && !editing && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            disabled={!canAdd}
            title={canAdd ? "" : `Maximum ${MAX_CITIES} cities.`}
          >
            + Add City
          </button>
        )}
        <button type="button" onClick={loadWeather} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </section>

      {adding && (
        <section className="form-panel">
          <h2>Add City</h2>
          <CityForm
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
            submitLabel="Add City"
          />
        </section>
      )}

      {editing && (
        <section className="form-panel">
          <h2>Edit {editing.city}</h2>
          <CityForm
            initial={editingInitial}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
            submitLabel="Save Changes"
          />
        </section>
      )}

      <section className="grid">
        {loading && weather.length === 0 ? (
          <p>Loading weather…</p>
        ) : (
          weather.map((w) => (
            <WeatherCard
              key={w.id}
              city={w}
              canDelete={canDelete}
              onEdit={() => setEditing(w)}
              onDelete={() => handleDelete(w.id)}
            />
          ))
        )}
      </section>
    </div>
  );
}

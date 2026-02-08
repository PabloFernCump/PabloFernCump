import React, { useState, useEffect } from 'react';
import '../../styles/BookingStepTime.css';

interface Props {
  sport: string;
  date: string;
  onSelectTime: (time: string, courts: any[]) => void;
}

const BookingStepTime: React.FC<Props> = ({ sport, date, onSelectTime }) => {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // EFECTO: Llamar al backend al cargar el componente
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        // Usamos la ruta que probamos en Thunder Client
        const response = await fetch(`http://localhost:3000/api/reservations/availability?sport=${sport}&date=${date}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Importante: Enviamos el token
          }
        });
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error("Error al cargar disponibilidad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [sport, date]);

  if (loading) return <p className="loading-text">Buscando pistas libres...</p>;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-2">Horas disponibles</h2>
      <p className="text-slate-400 mb-6">Selecciona el turno para el {date}</p>

      <div className="time-grid">
        {slots.map((slot, index) => (
          <button
            key={index}
            disabled={!slot.available}
            className={`time-slot-btn ${slot.available ? 'available' : 'disabled'}`}
            onClick={() => onSelectTime(slot.time, slot.courts)}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingStepTime;
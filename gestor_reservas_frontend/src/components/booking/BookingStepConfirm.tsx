import React, { useState } from 'react';
import '../../styles/BookingStepConfirm.css';

interface Props {
  bookingData: any;
  availableCourts: any[];
  onSuccess: () => void;
}

const BookingStepConfirm: React.FC<Props> = ({ bookingData, availableCourts, onSuccess }) => {
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalBooking = async () => {
    if (!selectedCourtId) return;

    try {
      setIsSubmitting(true);
      
      // Construimos el objeto para el backend
      const finalData = {
        court_id: selectedCourtId,
        date: bookingData.date,
        start_time: bookingData.time,
        // Calculamos end_time (asumiendo 1h 30min de duración)
        end_time: calculateEndTime(bookingData.time) 
      };

      const response = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(finalData)
      });

      if (response.ok) {
        onSuccess(); // Avisamos al padre que todo salió bien
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función auxiliar para sumar 1:30h
  const calculateEndTime = (startTime: string) => {
    const [h, m] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + 90);
    return date.toTimeString().substring(0, 5);
  };

  return (
    <div className="confirm-container">
      <h2 className="text-2xl font-bold text-white">Elige tu pista</h2>
      <p className="text-slate-400 mb-4">Pistas disponibles para las {bookingData.time}</p>

      <div className="courts-list">
        {availableCourts.map((court) => (
          <div 
            key={court.id}
            className={`court-option ${selectedCourtId === court.id ? 'selected' : ''}`}
            onClick={() => setSelectedCourtId(court.id)}
          >
            <div className="court-info">
              <h4>{court.name}</h4>
              <p>{court.type} - Interior</p>
            </div>
            {selectedCourtId === court.id && <span className="text-emerald-400">✓</span>}
          </div>
        ))}
      </div>

      <button 
        className="btn-final-confirm"
        disabled={!selectedCourtId || isSubmitting}
        onClick={handleFinalBooking}
      >
        {isSubmitting ? 'Procesando...' : 'Confirmar Reserva Ahora'}
      </button>
    </div>
  );
};

export default BookingStepConfirm;
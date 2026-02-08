//Este archivo es el "Director de Orquesta"

import React, { useState } from 'react';
import BookingStepSport from '../../components/booking/BookingStepSport';
import BookingStepDate from '../../components/booking/BookingStepDate';
import BookingStepTime from '../../components/booking/BookingStepTime';
import BookingStepConfirm from '../../components/booking/BookingStepConfirm'; // <--- NUEVO: Importamos el paso de confirmación final
import '../../styles/BookingPage.css';

// Definimos los pasos posibles para tener un código limpio
type BookingStep = 'sport' | 'date' | 'time' | 'confirm' | 'success'; // <--- ACTUALIZADO: Añadido 'success'

const BookingPage: React.FC = () => {
  // ESTADO: En qué paso estamos
  const [currentStep, setCurrentStep] = useState<BookingStep>('sport');
  
  // ESTADO: Datos que el usuario va eligiendo
  const [bookingData, setBookingData] = useState({
    sport: '',
    date: '',
    time: '',
    courtId: null
  });

  // NUEVO: Estado para guardar temporalmente las pistas disponibles que vienen del Paso 3
  const [tempCourts, setTempCourts] = useState<any[]>([]);

  // Función para manejar la selección del deporte (Paso 1)
  const handleSportSelect = (selectedSport: string) => {
    setBookingData({ ...bookingData, sport: selectedSport });
    setCurrentStep('date'); // Automáticamente pasamos al siguiente paso: la fecha
  };

  /**
   * NUEVO: Maneja la selección de la fecha (Paso 2)
   * Recibe un objeto Date, lo formatea a YYYY-MM-DD y avanza al paso de horas.
   */
  const handleDateSelect = (date: Date) => {
  // se usa este truco para mantener la fecha local
  //Esto asegura que si marcas el 20 en el calendario, se guarde el "20" independientemente de la zona horaria.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const formattedDate = `${year}-${month}-${day}`; // Genera "YYYY-MM-DD" real
  
  setBookingData({ ...bookingData, date: formattedDate });
  setCurrentStep('time');
};

  /**
   * NUEVO: Maneja la selección de la hora (Paso 3)
   * Recibe la hora seleccionada y la lista de pistas disponibles en ese momento.
   */
  const handleTimeSelect = (time: string, availableCourts: any[]) => {
    setBookingData({ ...bookingData, time: time });
    
    // ACTUALIZADO: Guardamos las pistas disponibles para que el Paso 4 pueda mostrarlas
    setTempCourts(availableCourts);
    setCurrentStep('confirm'); 
  };

  // Renderizado condicional según el paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 'sport':
        return <BookingStepSport onSelectSport={handleSportSelect} />;
      case 'date':
        // ACTUALIZADO: Ahora renderiza el componente de calendario real
        return <BookingStepDate onSelectDate={handleDateSelect} />;
      case 'time':
        // NUEVO: Renderiza el componente que consulta la API para traer las horas
        return (
          <BookingStepTime 
            sport={bookingData.sport} 
            date={bookingData.date} 
            onSelectTime={handleTimeSelect} 
          />
        );
      case 'confirm':
        // NUEVO: Renderiza el componente final de selección de pista y envío a BD
        return (
          <BookingStepConfirm 
            bookingData={bookingData} 
            availableCourts={tempCourts} 
            onSuccess={() => setCurrentStep('success')} // Si el POST es exitoso, vamos a success
          />
        );
      case 'success':
        // NUEVO: Pantalla de éxito tras confirmar la reserva
        return (
          <div className="success-container">
            <div className="success-icon">
              <div className="success-check">L</div> {/* Este es un truco CSS para el check */}
            </div>
            <h2 className="success-title">¡Reserva Confirmada!</h2>
            <p className="success-message">
              Tu pista ha sido reservada con éxito. <br />
              Te hemos enviado los detalles a tu correo.
            </p>
            <div className="success-actions">
              <button
                onClick={() => window.location.href = '/mis-reservas'}
                className="btn-primary"
              >
                Ver mis reservas
              </button>
              <button
                onClick={() => setCurrentStep('sport')}
                className="btn-secondary"
              >
                Hacer otra reserva
              </button>
            </div>
          </div>
        );
      // Añadiremos los demás pasos en las siguientes sesiones
      default:
        return <BookingStepSport onSelectSport={handleSportSelect} />;
    }
  };

  return (
    <div className="booking-page-container">
      {/* Indicador de progreso visual */}
      <div className="booking-progress-bar">
        <div className={`progress-dot ${currentStep === 'sport' ? 'active' : ''}`}></div>
        <div className={`progress-dot ${currentStep === 'date' ? 'active' : ''}`}></div>
        <div className={`progress-dot ${currentStep === 'time' ? 'active' : ''}`}></div>
        <div className={`progress-dot ${['confirm', 'success'].includes(currentStep) ? 'active' : ''}`}></div>
      </div>

      {/* Título dinámico según el paso */}
      <h1 className="text-white text-4xl font-extrabold text-center">
        {currentStep === 'success' ? '¡Todo listo!' : 'Reserva tu Pista'}
      </h1>

      <div className="booking-content-card">
        {renderStep()}
      </div>

      {/* Botón para volver atrás (solo si no estamos en el primer paso o en éxito) */}
      {currentStep !== 'sport' && currentStep !== 'success' && (
        <button 
          // ACTUALIZADO: Lógica para retroceder paso a paso
          onClick={() => {
            if (currentStep === 'date') setCurrentStep('sport');
            if (currentStep === 'time') setCurrentStep('date');
            if (currentStep === 'confirm') setCurrentStep('time');
          }}
          className="mt-6 text-slate-400 hover:text-white transition-colors"
        >
          ← Volver atrás
        </button>
      )}
    </div>
  );
};

export default BookingPage;
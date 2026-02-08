//Componente de FECHA

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Estilos base de la librería
import '../../styles/BookingStepDate.css'; // Nuestros estilos personalizados

interface Props {
  onSelectDate: (date: Date) => void;
}

const BookingStepDate: React.FC<Props> = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Función que se ejecuta al cambiar la fecha en el calendario
  const onChange = (value: any) => {
    setSelectedDate(value);
  };

  // Al confirmar, enviamos la fecha al componente padre
  const handleConfirm = () => {
    onSelectDate(selectedDate);
  };

  return (
    <div className="date-step-container">
      <h2 className="text-2xl font-bold text-white mb-6">Selecciona el día</h2>
      
      <Calendar 
        onChange={onChange} 
        value={selectedDate}
        minDate={new Date()} // Evita que reserven en el pasado
        locale="es-ES"      // Idioma en español
      />

      <button className="btn-continue" onClick={handleConfirm}>
        Ver horas disponibles
      </button>
    </div>
  );
};

export default BookingStepDate;
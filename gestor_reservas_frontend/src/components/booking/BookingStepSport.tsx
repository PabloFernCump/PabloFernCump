import React from 'react';
import '../../styles/BookingStepSport.css'; // Importamos los estilos externos

// Definimos la interfaz para las props que recibe el componente
interface Props {
  onSelectSport: (sport: string) => void; // Función que se ejecuta al elegir un deporte
}

const BookingStepSport: React.FC<Props> = ({ onSelectSport }) => {
  return (
    <div className="booking-step-container">
      {/* Título de la sección */}
      <h2 className="booking-title">¿Qué deporte vas a practicar?</h2>
      
      <div className="sport-grid">
        
        {/* OPCIÓN: PÁDEL */}
        <div 
          className="sport-card padel" 
          onClick={() => onSelectSport('Padel')} // Al hacer clic, enviamos 'Padel' al estado padre
        >
          <span className="sport-icon">🎾</span>
          <h3 className="sport-name">PÁDEL</h3>
          <p className="sport-desc">Pistas de cristal panorámicas con iluminación LED.</p>
        </div>

        {/* OPCIÓN: TENIS */}
        <div 
          className="sport-card tenis" 
          onClick={() => onSelectSport('Tenis')} // Al hacer clic, enviamos 'Tenis' al estado padre
        >
          <span className="sport-icon">🎾</span>
          <h3 className="sport-name">TENIS</h3>
          <p className="sport-desc">Superficie de resina rápida y tierra batida.</p>
        </div>

      </div>
    </div>
  );
};

export default BookingStepSport;
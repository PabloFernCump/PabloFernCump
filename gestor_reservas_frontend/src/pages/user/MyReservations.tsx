//Pagina donde el usuario podra ver sus reservas

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- NUEVO IMPORT: Para poder navegar entre páginas
import '../../styles/MyReservations.css';

const MyReservations: React.FC = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // <--- NUEVA CONSTANTE: Inicializamos el navegador

    useEffect(() => {
        fetchMyReservations();
    }, []);

    const fetchMyReservations = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/reservations/my-reservations', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: number) => {
        if (!window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api/reservations/${id}/cancel`, {
                method: 'PUT', // <--- DEBE SER PUT PARA COINCIDIR CON EL BACKEND
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Actualizamos el estado local para que la tarjeta se marque como cancelada
                setReservations(prev => prev.map(res =>
                    res.id === id ? { ...res, status: 'cancelled' } : res
                ));
                alert("Reserva cancelada con éxito");
            } else {
                // Si el backend responde pero con error (ej: 404 o 500)
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "No se pudo cancelar"}`);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Fallo de conexión con el servidor");
        }
    };

    if (loading) return <div className="loading">Cargando tus partidos...</div>;

    return (
        <div className="my-reservations-container">
            {/* NUEVO BOTÓN: Permite al usuario regresar al Dashboard principal */}
            <button onClick={() => navigate('/dashboard')} className="btn-back">
                ← Volver al Panel
            </button>

            <h1>Mis Reservas</h1>
            <div className="reservations-list">
                {reservations.length === 0 ? (
                    <p className="no-data">Aún no tienes ninguna reserva. ¡Anímate a jugar!</p>
                ) : (
                    reservations.map((res) => (
                        <div key={res.id} className={`reservation-card ${res.status}`}>
                            <div className="res-info">
                                <h3>{res.court_name}</h3>
                                <p className="res-type">{res.court_type} - Interior</p>
                                <div className="res-details">
                                    <span>📅 {new Date(res.date).toLocaleDateString()}</span>
                                    <span>⏰ {res.start_time.substring(0, 5)} - {res.end_time.substring(0, 5)}</span>
                                </div>
                            </div>
                            <div className="res-status-zone">
                                <span className={`status-badge ${res.status}`}>
                                    {res.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                                </span>
                                {res.status === 'confirmed' && (
                                    <button onClick={() => handleCancel(res.id)} className="btn-cancel">
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyReservations;
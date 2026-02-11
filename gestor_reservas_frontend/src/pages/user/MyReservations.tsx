//Pagina donde el usuario podra ver sus reservas

import React, { useEffect, useState } from 'react';
import '../../styles/MyReservations.css';

const MyReservations: React.FC = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
            const response = await fetch(`http://localhost:3000/api/reservations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                // Actualizamos la lista localmente
                setReservations(reservations.map(res => 
                    res.id === id ? { ...res, status: 'cancelled' } : res
                ));
            }
        } catch (error) {
            alert("No se pudo cancelar la reserva");
        }
    };

    if (loading) return <div className="loading">Cargando tus partidos...</div>;

    return (
        <div className="my-reservations-container">
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
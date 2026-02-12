// Pagina donde el usuario podra ver sus reservas organizadas por proximidad

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/MyReservations.css';

const MyReservations: React.FC = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setReservations(prev => prev.map(res =>
                    res.id === id ? { ...res, status: 'cancelled' } : res
                ));
                alert("Reserva cancelada con éxito");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "No se pudo cancelar"}`);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Fallo de conexión con el servidor");
        }
    };

    // --- LÓGICA DE FILTRADO Y ORDENACIÓN (NUEVO) ---

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Ajustamos a medianoche para comparar solo fechas

    // 1. Próximas: Fecha hoy o futura Y no cancelada (Ordenadas de más cercana a más lejana)
    const upcomingReservations = reservations
        .filter(res => new Date(res.date) >= now && res.status === 'confirmed')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 2. Historial: Fecha pasada O estado cancelado (Ordenadas de más reciente a más antigua)
    const pastReservations = reservations
        .filter(res => new Date(res.date) < now || res.status === 'cancelled')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (loading) return <div className="loading">Cargando tus partidos...</div>;

    return (
        <div className="my-reservations-container">
            <button onClick={() => navigate('/dashboard')} className="btn-back">
                ← Volver al Panel
            </button>

            <h1>Mi Agenda Deportiva</h1>

            {/* SECCIÓN 1: PRÓXIMOS PARTIDOS */}
            <section className="reservations-section">
                <h2 className="section-title">🎾 Próximas Citas</h2>
                <div className="reservations-grid">
                    {upcomingReservations.length === 0 ? (
                        <p className="no-data">No tienes partidos próximos. ¡Reserva tu pista!</p>
                    ) : (
                        upcomingReservations.map((res) => (
                            <div key={res.id} className="reservation-card next-match">
                                <div className="res-date-badge">
                                    <span className="day">{new Date(res.date).getDate()}</span>
                                    <span className="month">
                                        {new Date(res.date).toLocaleString('es-ES', { month: 'short' }).toUpperCase()}
                                    </span>
                                </div>
                                <div className="res-info">
                                    <h3>{res.court_name}</h3>
                                    <p className="res-time">⏰ {res.start_time.substring(0, 5)} - {res.end_time.substring(0, 5)}</p>

                                    {/* MODIFICACIÓN: Clase dinámica según el deporte */}
                                    <p className={`res-type-label ${res.court_type.toLowerCase()}`}>
                                        {res.court_type}
                                    </p>
                                </div>
                                <div className="res-actions">
                                    <button onClick={() => handleCancel(res.id)} className="btn-cancel-card">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* SECCIÓN 2: HISTORIAL (Solo se muestra si hay datos) */}
            {pastReservations.length > 0 && (
                <section className="reservations-section history-section">
                    <h2 className="section-title">📋 Historial de Reservas</h2>
                    <div className="history-list">
                        {pastReservations.map((res) => (
                            <div key={res.id} className={`history-item ${res.status}`}>
                                <div className="history-info">
                                    <span className="history-date">{new Date(res.date).toLocaleDateString()}</span>
                                    <span className="history-court">{res.court_name}</span>
                                    <span className="history-time">{res.start_time.substring(0, 5)}</span>
                                </div>
                                <span className={`history-status ${res.status}`}>
                                    {res.status === 'confirmed' ? 'Jugada' : 'Cancelada'}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default MyReservations;
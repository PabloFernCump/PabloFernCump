import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../../styles/userManagement.css';
import '../../styles/statistics.css';

const StatisticsPage = () => {
    const navigate = useNavigate();

    // Estados para almacenar los datos del backend
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e67e22'];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                }
            } catch (error) {
                console.error("Error al cargar estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="admin-management-container">
                <p style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando estadísticas reales...</p>
            </div>
        );
    }

    // Si no hay datos, mostramos un mensaje (prevención de errores)
    if (!data) return null;

    return (
        <div className="admin-management-container">
            <nav className="management-nav">
                <button className="btn-back-nav" onClick={() => navigate('/dashboard')}>
                    ← Volver
                </button>
                <h2>Panel de Estadísticas Reales</h2>
            </nav>

            <main className="management-content">
                {/* 1. Tarjetas de Resumen Rápido (KPIs) */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Socios Totales</h3>
                        <p className="stat-value">{data.globalKPIs.totalUsuarios}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Reservas Totales</h3>
                        <p className="stat-value">{data.globalKPIs.totalReservas}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pistas Activas</h3>
                        <p className="stat-value">{data.globalKPIs.totalPistas}</p>
                    </div>
                </div>

                {/* 2. Gráficos Dinámicos */}
                <div className="charts-container">

                    {/* Gráfico de Barras: Actividad Semanal */}
                    <div className="chart-box">
                        <h3>Reservas (Últimos 7 días)</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.dailyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfico de Barras: Previsión Próximos 7 días */}
                    <div className="chart-box">
                        <h3>Previsión de Ocupación (Próximos 7 días)</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.upcomingData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                {/* Usamos un color diferente (Púrpura) para diferenciar "Previsión" de "Pasado" */}
                                <Bar dataKey="total" fill="#9b59b6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfico Circular: Popularidad por Deporte */}
                    <div className="chart-box">
                        <h3>Uso por Deporte</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={data.sportData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {data.sportData.map((_entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                            {data.sportData.map((item: any, index: number) => (
                                <span key={item.name} style={{ color: COLORS[index % COLORS.length], fontWeight: 'bold', fontSize: '0.8rem' }}>
                                    ● {item.name}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default StatisticsPage;
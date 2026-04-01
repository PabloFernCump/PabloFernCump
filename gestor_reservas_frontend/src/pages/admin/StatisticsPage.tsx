import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Añadimos AreaChart y Area para el nuevo gráfico de picos de afluencia
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import '../../styles/userManagement.css';
import '../../styles/statistics.css';

const StatisticsPage = () => {
    const navigate = useNavigate();

    // Estados originales
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // --- NUEVOS ESTADOS PARA FILTROS ---
    const [filterDay, setFilterDay] = useState<number>(-1); // -1 significa "Cualquier día"
    const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1); // Mes actual por defecto

    const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e67e22'];

    // Carga inicial de todas las estadísticas
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Nota: Tu backend ahora debería devolver también hourlyData en esta ruta inicial
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

    // --- EFECTO PARA ACTUALIZAR SOLO EL GRÁFICO HORARIO CUANDO CAMBIAN LOS FILTROS ---
    useEffect(() => {
        const updateHourlyStats = async () => {
            if (!data) return;
            try {
                // CAMBIO AQUÍ: La URL debe terminar en /hourly-filtered, no en /hourly
                const response = await fetch(`http://localhost:3000/api/admin/stats/hourly-filtered?day=${filterDay}&month=${filterMonth}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                if (response.ok) {
                    const hourlyResult = await response.json();
                    // Actualizamos solo la parte de hourlyData
                    setData((prev: any) => ({ ...prev, hourlyData: hourlyResult }));
                }
            } catch (error) {
                console.error("Error al filtrar horas:", error);
            }
        };

        updateHourlyStats();
    }, [filterDay, filterMonth]);

    if (loading) {
        return (
            <div className="admin-management-container">
                <p style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando estadísticas reales...</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="admin-management-container">
            <nav className="management-nav">
                <button className="btn-back-nav" onClick={() => navigate('/dashboard')}>
                    ← Volver
                </button>
                <h2>Panel de Business Intelligence</h2>
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


                {/* NUEVO GRÁFICO: PICOS DE AFLUENCIA (Ocupa todo el ancho) */}
                <div className="chart-box full-width" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>Picos de Afluencia por Horario</h3>

                        {/* Selectores de Filtro */}
                        <div className="filters-container" style={{ display: 'flex', gap: '10px' }}>
                            <select
                                value={filterDay}
                                onChange={(e) => setFilterDay(Number(e.target.value))}
                                className="select-filter"
                                title="Filtrar por día de la semana"
                                aria-label="Filtrar por día de la semana"
                            >
                                <option value={-1}>Cualquier día</option>
                                <option value={2}>Lunes</option>
                                <option value={3}>Martes</option>
                                <option value={4}>Miércoles</option>
                                <option value={5}>Jueves</option>
                                <option value={6}>Viernes</option>
                                <option value={7}>Sábado</option>
                                <option value={1}>Domingo</option>
                            </select>

                            <select
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(Number(e.target.value))}
                                className="select-filter"
                                title="Filtrar por mes"
                                aria-label="Filtrar por mes"
                            >
                                <option value={1}>Enero</option>
                                <option value={2}>Febrero</option>
                                <option value={3}>Marzo</option>
                                <option value={4}>Abril</option>
                                <option value={5}>Mayo</option>
                                <option value={6}>Junio</option>
                                <option value={7}>Julio</option>
                                <option value={8}>Agosto</option>
                                <option value={9}>Septiembre</option>
                                <option value={10}>Octubre</option>
                                <option value={11}>Noviembre</option>
                                <option value={12}>Diciembre</option>
                            </select>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data.hourlyData || []}>
                            <defs>
                                <linearGradient id="colorHour" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f39c12" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f39c12" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
                            <YAxis allowDecimals={false} />
                            <Tooltip labelFormatter={(h) => `Hora: ${h}:00`} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#f39c12"
                                fillOpacity={1}
                                fill="url(#colorHour)"
                                name="Reservas"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="charts-container">
                    {/* Gráfico 1: Actividad Pasada */}
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

                    {/* Gráfico 2: Previsión Futura */}
                    <div className="chart-box">
                        <h3>Previsión de Ocupación (Próximos 7 días)</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.upcomingData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="total" fill="#9b59b6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>



                    {/* Gráfico 4: Popularidad Deporte */}
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
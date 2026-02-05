import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/form.css'; // Importamos el nuevo CSS

const EditCourtPage = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        surface: '',
        opening_time: '',
        closing_time: '',
        active: 1
    });

    useEffect(() => {
        const fetchCourt = async () => {
            try {
                // Obtenemos los datos actuales de la pista
                const response = await api.get(`/courts/${id}`);
                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                setError('No se pudo cargar la información de la pista');
                setLoading(false);
            }
        };
        fetchCourt();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'active' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Actualizamos en la base de datos a través del backend
            await api.put(`/courts/${id}`, formData);
            alert('Pista actualizada correctamente');
            navigate('/admin/courts'); 
        } catch (err) {
            setError('Error al intentar guardar los cambios');
        }
    };

    if (loading) return <div className="form-container">Cargando datos...</div>;

    return (
        <div className="form-container">
            <div className="form-card">
                <h2>Editar Instalación</h2>
                
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre de la Pista</label>
                        <input 
                            id="name"
                            name="name" 
                            type="text"
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Tipo de Deporte</label>
                        <input 
                            id="type"
                            name="type" 
                            type="text"
                            value={formData.type} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="surface">Superficie</label>
                        <input 
                            id="surface"
                            name="surface" 
                            type="text"
                            value={formData.surface} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="opening_time">Hora Apertura (HH:MM)</label>
                        <input 
                            id="opening_time"
                            name="opening_time" 
                            type="time" 
                            step="1" // Para soportar el formato TIME de MySQL
                            value={formData.opening_time} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="closing_time">Hora Cierre (HH:MM)</label>
                        <input 
                            id="closing_time"
                            name="closing_time" 
                            type="time" 
                            step="1"
                            value={formData.closing_time} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="active">Estado de la Pista</label>
                        <select 
                            id="active"
                            name="active" 
                            value={formData.active} 
                            onChange={handleChange}
                        >
                            <option value={1}>Activa / Disponible</option>
                            <option value={0}>Mantenimiento / Inactiva</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-submit">Guardar Cambios</button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/courts')} 
                        className="btn-cancel"
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCourtPage;
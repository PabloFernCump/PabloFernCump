import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../../styles/form.css'; // Reutilizamos los estilos

const AddCourtPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Estado inicial vacío para una nueva pista
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        surface: '',
        opening_time: '08:00:00', // Valores por defecto sugeridos
        closing_time: '22:00:00',
        active: 1
    });

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
            // Enviamos un POST para crear el nuevo registro
            await api.post('/courts', formData);
            alert('Pista creada con éxito');
            navigate('/courts'); // Volvemos al panel de gestión
        } catch (err) {
            setError('Error al crear la pista. Revisa los datos.');
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2>Añadir Nueva Instalación</h2>
                
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre de la Pista</label>
                        <input 
                            id="name"
                            name="name" 
                            type="text"
                            placeholder="Ej: Pista de Tenis 1"
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
                            placeholder="Ej: Tenis, Pádel..."
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
                            placeholder="Ej: Césped, Tierra Batida..."
                            value={formData.surface} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="opening_time">Hora Apertura</label>
                        <input 
                            id="opening_time"
                            name="opening_time" 
                            type="time" 
                            step="1"
                            value={formData.opening_time} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="closing_time">Hora Cierre</label>
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
                        <label htmlFor="active">Estado Inicial</label>
                        <select 
                            id="active"
                            name="active" 
                            value={formData.active} 
                            onChange={handleChange}
                        >
                            <option value={1}>Disponible</option>
                            <option value={0}>No disponible (Mantenimiento)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-submit">Crear Pista</button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/courts')} 
                        className="btn-cancel"
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCourtPage;
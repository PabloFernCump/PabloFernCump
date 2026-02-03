import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios'; // <--- Importante: Añadimos la conexión a la API
import '../styles/login.css'; // <--- Usamos los mismos estilos que el Login

// 1. Definimos una interfaz para que TypeScript sepa qué campos tiene el formulario
interface RegisterFormData {
  name: string;
  apellidos: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  // 2. Le decimos al useState que use esa interfaz
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    apellidos: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 3. Corregimos la función para que TypeScript no se queje al usar [e.target.name]
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value // Al usar la interfaz arriba, TypeScript ya permite esto
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos que van al servidor:", formData);
    setError(''); // Limpiamos errores anteriores

    try {
      console.log("Registrando usuario:", formData);
      
      // --- CÓDIGO AÑADIDO: La llamada real al backend ---
      const response = await api.post('/auth/register', formData);
      
      console.log("Respuesta exitosa:", response.data);
      alert("¡Usuario registrado con éxito!");
      navigate('/login'); // Redirigimos al login tras el éxito
      // -------------------------------------------------

    } catch (err: any) {
      console.error("Error en el registro:", err);
      // Si el backend devuelve un mensaje de error, lo capturamos aquí
      const serverMessage = err.response?.data?.message || 'Error al conectar con el servidor';
      setError(serverMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Crear Nueva Cuenta</h2>
        
        {/* Mostramos el error si existe y no es el específico de "ya registrado" */}
        {error && error !== 'El usuario ya existe' && (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        )}

        {error === 'El usuario ya existe' ? (
          <div className="error-container">
            <p className="error-msg">Este correo ya está registrado.</p>
            <div className="error-actions">
              <Link to="/login" className="btn-link">Ir al Login</Link>
              <button className="btn-link" onClick={() => navigate('/forgot-password')}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                id="apellidos"
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary">Registrarse</button>
          </form>
        )}

        <p className="footer-text">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
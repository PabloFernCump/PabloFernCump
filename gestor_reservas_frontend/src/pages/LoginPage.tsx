import { useState } from 'react';
import api from '../api/axios'; // La instancia de Axios con la URL base
import { useAuth } from '../auth/AuthContext'; // Hook para acceder a la función login()
import '../styles/login.css'; // Estilos específicos para esta página

const LoginPage = () => {
  // 1. Estados locales para capturar lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Extraemos la función login del contexto global
  const { login } = useAuth();

  /**
   * handleSubmit: Se ejecuta al hacer clic en "Entrar" o pulsar Enter.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de HTML)

    try {
      /**
       * Petición POST al backend. 
       * Gracias a nuestra config de Axios, solo ponemos '/auth/login'
       */
      const response = await api.post('/auth/login', {
        email,
        password
      });

      /**
       * Si el servidor responde con éxito, ejecutamos login().
       * Esto guarda el token en localStorage y actualiza el estado global.
       */
      login(response.data.token);
      alert('Login correcto');
      
      // Aquí podrías añadir un: navigate('/admin') para redirigir automáticamente
      
    } catch (error) {
      /**
       * Si el servidor devuelve un error (401, 404, etc.), 
       * mostramos el aviso de credenciales incorrectas.
       */
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      {/* El evento onSubmit en el form permite que funcione también al pulsar "Enter" */}
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Gestor de Reservas</h2>

        <input
          type="email"
          placeholder="Email"
          value={email} // Vinculamos el input con el estado
          onChange={e => setEmail(e.target.value)} // Actualizamos el estado al escribir
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // La instancia de Axios con la URL base
import { useAuth } from '../auth/AuthContext'; // Hook para acceder a la función login()
import '../styles/login.css'; // Estilos específicos para esta página

const RegisterPage = () => {
  // 1. Estados locales para capturar lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Extraemos la función login del contexto global
  const { login } = useAuth();

  /**
   * 3. INICIALIZACIÓN DEL HOOK
   * useNavigate es una función de react-router-dom que nos permite 
   * cambiar la URL de la página sin que el usuario haga clic.
   */
  const navigate = useNavigate();

  /**
   * handleSubmit: Se ejecuta al hacer clic en "Entrar" o pulsar Enter.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de HTML)
  
  // añado este codigo extra para debugear (asi nos sale en la teminal):
  console.log("Enviando login con:", { email, password });

    try {
      /**
       * Petición POST al backend. 
       * Gracias a nuestra config de Axios, solo ponemos '/auth/login'
       */
      const response = await api.post('/auth/login', {
        email,
        password
      });

      /** 1
       * Si el servidor responde con éxito, ejecutamos login().
       * Esto guarda el token en localStorage y actualiza el estado global.
       */
      //login(response.data.token);
      //alert('Login correcto');

      /**
       ******** Actualización: IMPORTANTE:
       * Extraemos 'token' y 'role_id' de la respuesta del servidor.
       * Asegúrate de que tu Backend envíe exactamente esos nombres.
       */
      const { token, role_id } = response.data;
      // Guardamos ambos en nuestro nuevo Contexto
      login(token, role_id);
      
      /** 2
       * REDIRECCIÓN
       * Una vez que el login es exitoso y tenemos el token,
       * "empujamos" al usuario hacia la ruta '/dashboard'.
       * El componente ProtectedRoute en el router detectará que 
       * ya estamos autenticados y nos dejará pasar.
       */
      navigate('/dashboard');
      
      
    } catch (error) {
      /**
       * Si el servidor devuelve un error (401, 404, etc.), 
       * mostramos el aviso de credenciales incorrectas.
       */
      console.error('Error en el login:', error);
      alert('Credenciales incorrectas. Por favor, revisa tu email y contraseña.');
  
  alert('Credenciales incorrectas o error en el servidor');
    }
  };

    return (
    <div className="login-container">
      {/* El evento onSubmit en el form permite que funcione también al pulsar "Enter" */}
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Gestor de Reservas</h2>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
           value={email} // Vinculamos el input con el estado
            onChange={e => setEmail(e.target.value)} // Actualizamos el estado al escribir
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Contraseña"
           value={password}
           onChange={e => setPassword(e.target.value)}
            required
           />
        </div>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default RegisterPage;
/**
 * Usamos una Arrow Function (const App = () => ...) ya que es el estándar 
 * actual en proyectos con Vite y TypeScript.
 */
const App = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Gestor de Reservas</h1>
      <p>Panel de Administración en desarrollo</p>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        border: '1px dashed #666',
        borderRadius: '8px' 
      }}>
        <p>Estado: Esperando conexión con el Backend (Puerto 3000)</p>
      </div>
    </div>
  );
};

export default App;

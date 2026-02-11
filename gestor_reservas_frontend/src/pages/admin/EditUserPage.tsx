import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/userManagement.css'; 
import '../../styles/editUser.css'; 

const EditUserPage = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    role_id: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            nombre: data.nombre || '',
            apellidos: data.apellidos || '',
            email: data.email || '',
            role_id: data.role_id || 1
          });
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("¡Cambios guardados!");
        navigate('/admin/users');
      }
    } catch (error) {
      alert("Error al guardar");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) navigate('/admin/users');
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  if (loading) return <div className="admin-management-container"><p className="loading-text">Cargando datos del socio...</p></div>;

  return (
    <div className="admin-management-container">
      <nav className="management-nav">
        <button type="button" className="btn-back-nav" onClick={() => navigate('/admin/users')}>
          ← Volver
        </button>
        <h2>Configuración de Socio</h2>
      </nav>

      <main className="edit-user-container">
        <div className="edit-user-card">
          <form onSubmit={handleSave} className="edit-user-form">
            
            <div className="form-field">
              <label htmlFor="nombre">Nombre</label>
              <input 
                id="nombre"
                type="text" 
                value={formData.nombre} 
                onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                required 
              />
            </div>

            <div className="form-field">
              <label htmlFor="apellidos">Apellidos</label>
              <input 
                id="apellidos"
                type="text" 
                value={formData.apellidos} 
                onChange={(e) => setFormData({...formData, apellidos: e.target.value})} 
                required 
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                id="email"
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>

            <div className="form-field">
              <label htmlFor="role">Rol del Sistema</label>
              <select 
                id="role"
                value={formData.role_id} 
                onChange={(e) => setFormData({...formData, role_id: Number(e.target.value)})}
              >
                <option value={1}>Usuario Estándar</option>
                <option value={2}>Administrador</option>
              </select>
            </div>

            <button type="submit" className="btn-add-user">
              Guardar Cambios
            </button>

            <button type="button" onClick={handleDelete} className="btn-delete">
              Eliminar Permanentemente
            </button>

          </form>
        </div>
      </main>
    </div>
  );
};

export default EditUserPage;
// Página de Gestión de Usuarios para el Admin

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import '../../styles/userManagement.css'; // <--- Nuevo archivo de estilos

// Definimos la forma del usuario para TypeScript
interface User {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  role_id: number;
}

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { roleId } = useAuth(); // Usamos roleId para evitar la advertencia de "no usado"

  // 1. Cargar usuarios desde la BBDD
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Hacemos la petición real a tu backend
        const response = await fetch('http://localhost:3000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Importante para la seguridad
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data); // <--- Aquí guardamos los usuarios reales en el estado
        } else {
          console.error("Error al obtener usuarios del servidor");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-management-container">
      <nav className="management-nav">
        {/* Usamos el título centrado que acordamos en el CSS */}
        <button className="btn-back-nav" onClick={() => navigate('/dashboard')}>
          ← Volver
        </button>
        <h2>Gestión de Usuarios</h2>
      </nav>

      <main className="management-content">
        <div className="table-card">
          <div className="table-header">
            <h3>Listado de Socios</h3>
            <button className="btn-add-user" onClick={() => navigate('/register')}>
              + Nuevo Usuario
            </button>
          </div>

          {loading ? (
            <p className="loading-text">Cargando usuarios...</p>
          ) : (
            <div className="table-responsive">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(u => (
                      <tr key={u.id}>
                        <td>{u.nombre} {u.apellidos}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role_id === 2 ? 'admin' : 'user'}`}>
                            {u.role_id === 2 ? 'Admin' : 'Usuario'}
                          </span>
                        </td>
                        <td>
                          {/* ACTUALIZADO: Ahora redirige a la página de edición con el ID del usuario */}
                          <button 
                            className="btn-edit" 
                            onClick={() => navigate(`/admin/edit-user/${u.id}`)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="empty-row">
                        No hay usuarios registrados todavía.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserManagementPage;
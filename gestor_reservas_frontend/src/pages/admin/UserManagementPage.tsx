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

  // 1. Cargar usuarios (Aquí llamarás a tu API después)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar usuarios");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="admin-management-container">
      <nav className="management-nav">
        <h1>Gestión de Usuarios (Admin ID: {roleId})</h1>
        <button className="btn-back-nav" onClick={() => navigate('/dashboard')}>
          ← Volver
        </button>
      </nav>

      <main className="management-content">
        <div className="table-card">
          <div className="table-header">
            <h2>Listado de Socios</h2>
            <button className="btn-add-user" onClick={() => navigate('/register')}>
              + Nuevo Usuario
            </button>
          </div>

          <hr className="divider" />

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
                        <td><span className={`badge ${u.role_id === 2 ? 'admin' : 'user'}`}>
                          {u.role_id === 2 ? 'Admin' : 'Usuario'}
                        </span></td>
                        <td>
                          <button className="btn-edit">Editar</button>
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
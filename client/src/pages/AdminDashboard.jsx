import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import ProjectsList from '../components/ProjectsList.jsx';
import TeacherStudentsList from '../components/TeacherStudentsList.jsx';
import axios from 'axios';

function AdminDashboard() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const handleDeleteAccount = async () => {
      if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
          try {
              const token = localStorage.getItem('token');
              const config = {
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              };
              await axios.delete('http://localhost:5000/users/delete', config);
              alert("Your account has been deleted.");
              handleLogout();
          } catch (err) {
              alert("Failed to delete account.");
          }
      }
  };

  return (
    <div>
      <h2>Welcome, Admin {user?.username}</h2>
      <p>This is your admin dashboard.</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDeleteAccount} style={{ backgroundColor: '#d9534f' }}>
        Delete Account
      </button>

      <TeacherStudentsList />

      <ProjectsList isAdmin={true} />
    </div>
  );
}

export default AdminDashboard;
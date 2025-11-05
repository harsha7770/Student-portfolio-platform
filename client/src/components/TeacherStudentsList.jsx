import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext.jsx';

function TeacherStudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useContext(UserContext);

  const fetchStudents = async () => {
    setError('');
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.get('http://localhost:5000/teachers/students', config);
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return <p>Loading students...</p>;
  }

  return (
    <div>
      <h3>My Students</h3>
      {error && <p className="error">{error}</p>}
      <ul>
        {students.length > 0 ? (
          students.map(student => (
            <li key={student._id}>
              <h4>{student.username}</h4>
              <p>Roll Number: {student.rollNumber || "Not Provided"}</p>
            </li>
          ))
        ) : (
          <p>You have no students assigned yet.</p>
        )}
      </ul>
    </div>
  );
}

export default TeacherStudentsList;
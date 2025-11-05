import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext.jsx';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [registrationCode, setRegistrationCode] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [message, setMessage] = useState('');

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:5000/users/login' : 'http://localhost:5000/users/register';

    let payload;
    if (isLogin) {
      payload = { username, password };
    } else if (role === 'student') {
      payload = { username, password, role, registrationCode, rollNumber };
    } else { // admin
      payload = { username, password, role, registrationCode };
    }

    try {
      const response = await axios.post(url, payload);
      setMessage(response.data.message || 'Success!');
      if (isLogin) {
        const { token, user } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setUser(user);
      }
    } catch (error) {
      setMessage(error.response.data.error || 'Something went wrong!');
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {!isLogin && (
          <>
            <div>
              <label>Register as:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="admin">Teacher/Admin</option>
              </select>
            </div>
            {role === 'student' && (
              <>
                <div>
                  <label>Enter Teacher Registration Code:</label>
                  <input
                    type="text"
                    value={registrationCode}
                    onChange={(e) => setRegistrationCode(e.target.value)}
                    placeholder="Enter teacher code"
                    required
                  />
                </div>
                <div>
                  <label>Enter Roll Number:</label>
                  <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="Enter unique roll number"
                      required
                  />
                </div>
              </>
            )}
            {role === 'admin' && (
              <div>
                <label>Enter Registration Code:</label>
                <input
                    type="text"
                    value={registrationCode}
                    onChange={(e) => setRegistrationCode(e.target.value)}
                    placeholder="Enter a unique registration code"
                    required
                />
              </div>
            )}
          </>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
}

export default AuthPage;
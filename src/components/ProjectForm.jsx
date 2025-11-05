import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext.jsx';

function ProjectForm({ onProjectAdded, projectToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description);
      setMediaUrl(projectToEdit.mediaUrl);
    }
  }, [projectToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const projectData = { title, description, mediaUrl };

    try {
      if (projectToEdit) {
        const url = `http://localhost:5000/projects/${projectToEdit._id}`;
        await axios.put(url, projectData, config);
        setSuccess('Project updated successfully!');
      } else {
        const url = 'http://localhost:5000/projects/add';
        await axios.post(url, projectData, config);
        setSuccess('Project added successfully!');
      }
      setTimeout(() => {
        onProjectAdded();
      }, 1000);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{projectToEdit ? 'Edit Project' : 'Add New Project'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Media URL:</label>
          <input type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : (projectToEdit ? 'Update' : 'Add Project')}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default ProjectForm;
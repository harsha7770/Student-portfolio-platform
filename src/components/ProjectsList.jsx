import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext.jsx';
import ProjectForm from './ProjectForm.jsx';

function ProjectsList({ isAdmin }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserContext);

  const fetchProjects = async () => {
    setError('');
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const url = isAdmin ? 'http://localhost:5000/projects/all' : 'http://localhost:5000/projects/';
      const response = await axios.get(url, config);
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectAdded = () => {
    setShowForm(false);
    setProjectToEdit(null);
    fetchProjects();
  };

  const handleEdit = (project) => {
    setProjectToEdit(project);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      await axios.delete(`http://localhost:5000/projects/${id}`, config);
      alert('Project deleted successfully!');
      fetchProjects();
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div>
      {showForm ? (
        <ProjectForm onProjectAdded={handleProjectAdded} projectToEdit={projectToEdit} />
      ) : (
        <>
          {!isAdmin && <button onClick={() => setShowForm(true)}>Add New Project</button>}
          <h3>{isAdmin ? 'All Student Projects' : 'My Projects'}</h3>
          {error && <p className="error">{error}</p>}
          <ul>
            {projects.map(project => (
              <li key={project._id}>
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                {isAdmin && <p><strong>Owner:</strong> {project.owner?.username}</p>}
                {project.mediaUrl && (
                    <p>
                        <strong>Media Link: </strong>
                        <a href={project.mediaUrl} target="_blank" rel="noopener noreferrer">
                            View Project
                        </a>
                    </p>
                )}
                {!isAdmin && (
                  <>
                    <button onClick={() => handleEdit(project)}>Edit</button>
                    <button onClick={() => handleDelete(project._id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ProjectsList;
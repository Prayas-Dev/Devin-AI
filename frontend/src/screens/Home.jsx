import React, { useContext, useState } from 'react';
import { UserContext } from '../context/user.context';
import axios from "../config/axios";

const Home = () => {
  const { user } = useContext(UserContext) || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProjectName('');
    setError('');
  };

  const createProject = (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('Project name cannot be empty.');
      return;
    }
    axios.post('/projects/create', { name: projectName })
      .then((res) => {
        console.log(res);
        setIsModalOpen(false);
        setProjectName('');
      })
      .catch((error) => {
        console.log(error);
        setError('Failed to create the project. Please try again.');
      });
  };

  return (
    <main className="p-4">
      <div className="projects">
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-4 border rounded-md border-slate-300 project"
        >
          New Project
          <i className="ml-2 ri-link"></i>
        </button>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div 
            className="w-1/3 p-6 bg-white rounded-md shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="block w-full p-2 mt-1 border-gray-300 rounded-md"
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 bg-gray-300 rounded-md"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white bg-blue-600 rounded-md ${!projectName.trim() && 'opacity-50 cursor-not-allowed'}`}
                  disabled={!projectName.trim()}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;

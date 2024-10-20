// src/components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import CreateTaskModal from "./CreateTaskModal";

interface User {
  _id: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: {
    _id: string;
    email: string;
  };
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    if (role === "admin") {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const logout = () => {
    // Clear the token and role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Redirect to the login page or homepage
    navigate("/login");
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [role]);

  const deleteTask = async (taskId: string) => {
    try {
      await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          {role === "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create Task
            </button>
          )}
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {isModalOpen && (
        <CreateTaskModal
          users={users}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={fetchTasks}
          token={token!}
        />
      )}

      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks assigned to you.</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    Assigned to: {task.assignedTo?.email}
                  </p>
                </div>
                <div className="space-x-2">
                  {role === "admin" ? (
                    <>
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTaskStatus(task._id, e.target.value)
                        }
                        className="border rounded p-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded ${
                        task.status === "completed"
                          ? "bg-green-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      {task.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

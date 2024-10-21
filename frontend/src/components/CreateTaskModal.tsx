import React, { useState } from "react";

interface CreateTaskModalProps {
  users: Array<{ _id: string; email: string }>;
  onClose: () => void;
  onTaskCreated: () => void;
  token: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  users,
  onClose,
  onTaskCreated,
  token,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [creating, setCreating] = useState(false); // State for tracking task creation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true); // Set creating to true when starting the task creation

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            assignedTo,
          }),
        }
      );

      if (response.ok) {
        onTaskCreated();
        onClose();
      } else {
        // Optionally handle the error response
        console.error("Failed to create task");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false); // Reset creating state when the request is complete
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assign To</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                creating ? "bg-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={creating} // Disable the button when creating
            >
              {creating ? "Creating..." : "Create"} {/* Show loading text */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;

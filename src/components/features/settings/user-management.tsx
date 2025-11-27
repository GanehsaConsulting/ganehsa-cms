"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaTrash, FaPlus, FaLock } from "react-icons/fa6";
import { AiFillEdit } from "react-icons/ai";

export const UserManagement = ({ token }: { token: string }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "AUTHOR",
  });

  const fetchUsers = async () => {
    setLoading(true);
    setUnauthorized(false); // Reset unauthorized state
    
    try {
    //   console.log("Fetching users with token:", token ? "Token exists" : "No token");
    //   console.log("Token value:", token?.substring(0, 20) + "...");
      
      const res = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store' 
      });
      
    //   console.log("Response status:", res.status);
    //   console.log("Response headers:", res.headers);
      
      // Parse response body
      const data = await res.json();
      console.log("Response data:", data);
      
      // Check HTTP status code
      if (res.status === 401 || res.status === 403) {
        console.log("❌ Unauthorized - status", res.status);
        setUnauthorized(true);
        // toast.error(data.message || "Unauthorized access");
        return;
      }

      if (!res.ok) {
        console.log("❌ Response not OK:", res.status);
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      // Check success flag
      if (data.success) {
        console.log("✅ Successfully fetched users:", data.data?.length || 0);
        setUsers(data.data || []);
        setUnauthorized(false);
      } else {
        console.log("❌ API returned success: false", data.message);
        // Only set unauthorized for specific messages
        if (data.message?.toLowerCase().includes("unauthorized") || 
            data.message?.toLowerCase().includes("super admin")) {
          setUnauthorized(true);
        }
        // toast.error(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("❌ Error in fetchUsers:", err);
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      
      // Don't automatically set unauthorized on network errors
      if (errMsg.toLowerCase().includes("unauthorized") || 
          errMsg.toLowerCase().includes("401") ||
          errMsg.toLowerCase().includes("403")) {
        setUnauthorized(true);
      }
      
    //   toast.error("Failed to fetch users: " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      console.log("No token available");
      setUnauthorized(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      console.log("Submitting form to:", url, "Method:", method);
      
      // Don't send empty password on edit
      const submitData: any = { ...formData };
      if (editingUser && !submitData.password) {
        delete submitData.password;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      console.log("Submit response status:", response.status);

      if (response.status === 401 || response.status === 403) {
        setUnauthorized(true);
        const errorData = await response.json();
        toast.error(errorData.message || "Unauthorized access");
        return;
      }

      const result = await response.json();
      console.log("Submit result:", result);

      if (result.success) {
        toast.success(
          editingUser
            ? "User updated successfully"
            : "User created successfully"
        );
        setShowModal(false);
        setEditingUser(null);
        setFormData({ email: "", name: "", password: "", role: "AUTHOR" });
        fetchUsers();
      } else {
        toast.error(result.message || "Operation failed");
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name || "",
      password: "", // Password dikosongkan saat edit
      role: user.role,
    });
    setShowModal(true);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Delete response status:", response.status);

      if (response.status === 401 || response.status === 403) {
        setUnauthorized(true);
        const errorData = await response.json();
        toast.error(errorData.message || "Unauthorized access");
        return;
      }

      const result = await response.json();
      console.log("Delete result:", result);

      if (result.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error in handleDelete:", err);
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", name: "", password: "", role: "AUTHOR" });
    setEditingUser(null);
    setShowModal(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-300/30 text-red-700 border-red-500/50";
      case "ADMIN":
        return "bg-blue-500/10 text-blue-300 border-mainColor/50";
      case "AUTHOR":
        return "bg-green-500/20 text-green-300 border-green-500/50";
      case "VIEWER":
        return "bg-purple-500/20 text-purple-300 border-purple-500/50";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  console.log("Current state - unauthorized:", unauthorized, "loading:", loading, "users count:", users.length);

  return (
    <>
      {!unauthorized ? (
        <div className="space-y-4">
          {/* Header dengan tombol Add User */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white text-lg font-semibold">User Management Settings</h2>
              <p className="text-white/60 text-sm">
                Manage all users in the system
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-mainColor hover:bg-mainColor/70 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="text-sm" />
              Add User
            </button>
          </div>

          {/* User Table */}
          <div className="bg-white/10 border border-white/20 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-white">Loading users...</div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-white/60">No users found</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-4 text-white/80 font-medium">
                        User
                      </th>
                      <th className="text-left p-4 text-white/80 font-medium">
                        Role
                      </th>
                      <th className="text-left p-4 text-white/80 font-medium">
                        Created
                      </th>
                      <th className="text-left p-4 text-white/80 font-medium">
                        Articles
                      </th>
                      <th className="text-left p-4 text-white/80 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="p-4">
                          <div>
                            <div className="text-white font-medium">
                              {user.name || "No Name"}
                            </div>
                            <div className="text-white/60 text-sm">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-4 text-white/70 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-white/70 text-sm">
                          {user._count?.articles || 0}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-white hover:text-mainColor hover:bg-white/10 rounded transition-colors"
                              title="Edit User"
                            >
                              <AiFillEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete User"
                              disabled={user.role === "SUPER_ADMIN"}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/10 border border-white/20 rounded-xl h-fit flex flex-col justify-between items-center py-10">
          <p className="flex items-center justify-center text-5xl opacity-30">
            <FaLock className="text-white/80" />
          </p>
          <h1 className="text-white/80 text-9xl font-bold opacity-20 mb-4">401</h1>
          <h2 className="text-3xl text-white/80 font-semibold mb-4">Unauthorized</h2>
          <p className="text-lightColor/70 mb-8">
            This feature only works for "super admin" roles
          </p>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/20 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white text-lg font-semibold mb-4">
              {editingUser ? "Edit User" : "Add New User"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-mainColor"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-mainColor"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Password {editingUser && "(leave empty to keep current)"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-mainColor"
                  placeholder={editingUser ? "••••••••" : "Enter password"}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-mainColor"
                >
                  <option value="VIEWER">Viewer</option>
                  <option value="AUTHOR">Author</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-mainColor hover:bg-mainColor/70 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingUser
                    ? "Update User"
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
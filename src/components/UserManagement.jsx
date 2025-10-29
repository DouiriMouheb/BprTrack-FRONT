import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit2, Trash2, Mail, Shield, Calendar, AlertCircle, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllUsers, updateUser, deleteUser } from '../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      await deleteUser(userId);
      toast.success(`User "${username}" deleted successfully`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete user: ' + error.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      roles: user.roles || []
    });
    setShowEditModal(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, {
        username: editingUser.username,
        email: editingUser.email,
        roles: editingUser.roles,
        isActive: editingUser.isActive
      });
      toast.success('User updated successfully');
      setShowEditModal(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] rounded-xl">
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[hsl(var(--text-black))]">User Management</h2>
            <p className="text-sm text-[hsl(var(--text-black))/0.6]">
              Manage user accounts and permissions ({users.length} users)
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-[hsl(var(--text-black))/0.4]" size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-[hsl(var(--border-black))] rounded-xl 
                     focus:outline-none focus:border-[hsl(var(--red))] transition-colors
                     text-[hsl(var(--text-black))] font-medium bg-white"
            placeholder="Search by username or email..."
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--red))]"></div>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-12">
          <div className="text-center">
            <AlertCircle className="mx-auto text-[hsl(var(--text-black))/0.3]" size={48} />
            <p className="mt-4 text-[hsl(var(--text-black))/0.6] font-medium">
              {searchTerm ? 'No users found matching your search' : 'No users available'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50 border-b-2 border-[hsl(var(--border-black))/0.1]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[hsl(var(--text-black))] uppercase tracking-wider whitespace-nowrap">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[hsl(var(--text-black))] uppercase tracking-wider whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[hsl(var(--text-black))] uppercase tracking-wider whitespace-nowrap">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[hsl(var(--text-black))] uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-[hsl(var(--text-black))] uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border-black))/0.1]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="font-medium text-[hsl(var(--text-black))]">
                          {user.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-[hsl(var(--text-black))/0.7]">
                        <Mail size={16} />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                                 bg-[hsl(var(--red))/0.1] text-[hsl(var(--red))]"
                      >
                        <Shield size={12} />
                        {user.roles && user.roles.length > 0 ? user.roles[0] : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-[hsl(var(--border-black))] animate-slideUp max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditingUser(null);
              }}
              className="absolute top-4 right-4 z-10 p-2 text-[hsl(var(--text-black))/0.4] hover:text-[hsl(var(--red))] hover:bg-[hsl(var(--red))/0.1] rounded-lg transition-all"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="p-6 border-b-2 border-[hsl(var(--border-black))/0.1] bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
              <div className="flex items-center gap-3 pr-8">
                <div className="p-3 bg-[hsl(var(--red))] rounded-xl shadow-lg">
                  <Edit2 className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[hsl(var(--text-black))]">Edit User</h2>
                  <p className="text-sm text-[hsl(var(--text-black))/0.6]">Update user information</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4 bg-white">
              <div>
                <label className="block text-sm font-bold text-[hsl(var(--text-black))] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[hsl(var(--border-black))] rounded-xl 
                           focus:outline-none focus:border-[hsl(var(--red))] transition-colors
                           text-[hsl(var(--text-black))] font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[hsl(var(--text-black))] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[hsl(var(--border-black))] rounded-xl 
                           focus:outline-none focus:border-[hsl(var(--red))] transition-colors
                           text-[hsl(var(--text-black))] font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[hsl(var(--text-black))] mb-2">
                  Role
                </label>
                <select
                  value={editingUser.roles && editingUser.roles.length > 0 ? editingUser.roles[0] : 'User'}
                  onChange={(e) => setEditingUser({ ...editingUser, roles: [e.target.value] })}
                  className="w-full px-4 py-3 border-2 border-[hsl(var(--border-black))] rounded-xl 
                           focus:outline-none focus:border-[hsl(var(--red))] transition-colors
                           text-[hsl(var(--text-black))] font-medium bg-white appearance-none cursor-pointer"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[hsl(var(--text-black))] mb-2">
                  Status
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={editingUser.isActive}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                    className="w-5 h-5 text-[hsl(var(--red))] border-2 border-[hsl(var(--border-black))] rounded focus:ring-[hsl(var(--red))]"
                  />
                  <span className="text-[hsl(var(--text-black))] font-medium">Active User</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 py-3 border-2 border-[hsl(var(--border-black))] text-[hsl(var(--text-black))] rounded-xl font-bold
                           hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="flex-1 py-3 bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] text-white rounded-xl font-bold
                           shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

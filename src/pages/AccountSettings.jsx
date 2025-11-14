import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser as firebaseDeleteUser
} from 'firebase/auth';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function AccountSettings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState(currentUser?.email || '');
  const [emailPassword, setEmailPassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  // Reauthenticate user
  const reauthenticate = async (password) => {
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch (err) {
      toast.error('Invalid password');
      return false;
    }
  };

  // Reauthenticate user
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setLoadingPassword(true);

    try {
      // Reauthenticate
      const isValid = await reauthenticate(currentPassword);
      if (!isValid) {
        setLoadingPassword(false);
        return;
      }

      // Update password
      await updatePassword(currentUser, newPassword);
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully! 🔒');
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoadingPassword(false);
    }
  };

  // Change Email
  const handleChangeEmail = async (e) => {
    e.preventDefault();

    if (!newEmail) {
      showMessage('Email is required', 'error');
      return;
    }

    if (newEmail === currentUser.email) {
      showMessage('This is already your email', 'error');
      return;
    }

    if (!emailPassword) {
      showMessage('Password is required', 'error');
      return;
    }

    setLoadingEmail(true);

    try {
      // Reauthenticate
      const isValid = await reauthenticate(emailPassword);
      if (!isValid) return;

      // Update email
      await updateEmail(currentUser, newEmail);
      
      setEmailPassword('');
      showMessage('Email changed successfully! ✅');
    } catch (err) {
      console.error('Error changing email:', err);
      if (err.code === 'auth/email-already-in-use') {
        showMessage('Email is already in use', 'error');
      } else {
        showMessage(`Error: ${err.message}`, 'error');
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (deleteConfirm !== 'DELETE') {
      showMessage('Type "DELETE" to confirm', 'error');
      return;
    }

    setLoadingDelete(true);

    try {
      // Delete user from Firebase
      await firebaseDeleteUser(currentUser);
      
      showMessage('Account deleted successfully', 'success');
      setTimeout(() => {
        navigate('/signup');
      }, 2000);
    } catch (err) {
      console.error('Error deleting account:', err);
      if (err.code === 'auth/requires-recent-login') {
        showMessage('Please log out and log in again before deleting your account', 'error');
      } else {
        showMessage(`Error: ${err.message}`, 'error');
      }
    } finally {
      setLoadingDelete(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 active:text-blue-800 active:scale-95 mb-8 transition-all duration-75 px-2 py-2 rounded hover:bg-blue-50 active:bg-blue-100"
        >
          <FaArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${messageType === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}

          {/* Change Password Section */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
              >
                {loadingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Change Email Section */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Email</h2>
            
            <form onSubmit={handleChangeEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (to confirm)
                </label>
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loadingEmail}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
              >
                {loadingEmail ? 'Updating...' : 'Update Email'}
              </button>
            </form>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <FaExclamationTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-red-900 mb-6">Delete Account</h2>
                
                <p className="text-sm text-red-700 mb-4">
                  ⚠️ <strong>Warning:</strong> This action cannot be undone. All your data, trips, and entries will be permanently deleted.
                </p>

                <form onSubmit={handleDeleteAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-red-900 mb-2">
                      Type "DELETE" to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Type DELETE"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingDelete || deleteConfirm !== 'DELETE'}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium transition-colors"
                  >
                    {loadingDelete ? 'Deleting...' : 'Delete My Account'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import authService from '../../services/authService';

const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    try {
      await authService.register(formData.username, formData.email, formData.password);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => {
          onRegisterSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm text-center">{success}</p>}
       <input
        type="text"
        name="username"
        value={formData.username}
        onChange={onChange}
        placeholder="Username"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder="Email Address"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
        placeholder="Password"
        minLength="6"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out font-semibold">
        Sign Up
      </button>
    </form>
  );
};

export default RegisterForm;


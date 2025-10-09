import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {isLoginView ? (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h2>
            <LoginForm />
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <span
                className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                onClick={toggleView}
              >
                Sign Up
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>
            <RegisterForm onRegisterSuccess={() => setIsLoginView(true)} />
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <span
                className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                onClick={toggleView}
              >
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;


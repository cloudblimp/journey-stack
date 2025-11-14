import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { FaCamera, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ trips: 0, entries: 0 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Load current display name
    setDisplayName(currentUser.displayName || '');
    
    // Load profile picture if exists
    if (currentUser.photoURL) {
      setProfileImagePreview(currentUser.photoURL);
    }

    // Load travel stats
    loadTravelStats();
  }, [currentUser, navigate]);

  const loadTravelStats = async () => {
    try {
      setLoading(true);
      
      // Count trips
      const tripsRef = collection(db, 'trips');
      const tripsQuery = query(tripsRef, where('userId', '==', currentUser.uid));
      const tripsSnapshot = await getDocs(tripsQuery);
      
      // Count entries
      const entriesRef = collection(db, 'entries');
      const entriesQuery = query(entriesRef, where('userId', '==', currentUser.uid));
      const entriesSnapshot = await getDocs(entriesQuery);
      
      setStats({
        trips: tripsSnapshot.size,
        entries: entriesSnapshot.size
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      let photoURL = currentUser.photoURL;

      // Upload new profile image if selected
      if (profileImage) {
        const fileName = `${currentUser.uid}-profile-${Date.now()}`;
        const imageRef = ref(storage, `profile-pictures/${currentUser.uid}/${fileName}`);
        await uploadBytes(imageRef, profileImage);
        photoURL = await getDownloadURL(imageRef);
      }

      // Update Firebase profile
      await updateProfile(currentUser, {
        displayName: displayName || currentUser.email,
        photoURL: photoURL
      });

      setProfileImage(null);
      setMessage('Profile updated successfully! ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  const userInitial = currentUser.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <FaArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          {/* Profile Picture Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Profile Picture
            </label>
            <div className="flex items-center space-x-8">
              {/* Current Avatar */}
              <div className="relative">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                    {userInitial}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaCamera className="h-5 w-5" />
                    <span>Upload Picture</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Display Name Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Travel Stats Section */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded-lg">
            <div>
              <p className="text-gray-600 text-sm">Total Trips</p>
              <p className="text-3xl font-bold text-blue-600">
                {loading ? <FaSpinner className="animate-spin" /> : stats.trips}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Entries</p>
              <p className="text-3xl font-bold text-blue-600">
                {loading ? <FaSpinner className="animate-spin" /> : stats.entries}
              </p>
            </div>
          </div>

          {/* Email Display (Read-only) */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-2">To change your email, go to Account Settings</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

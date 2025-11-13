import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useActivities } from '../hooks/useActivities';

export default function EditActivityModal({ isOpen, onClose, activity, onActivityUpdated }) {
  const [activityData, setActivityData] = useState({
    title: '',
    type: 'Activity',
    date: '',
    time: '00:00',
    location: '',
    description: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { updateActivity, deleteActivity } = useActivities();

  const activityTypes = [
    { icon: '↗', label: 'Activity' },
    { icon: '🏨', label: 'Accommodation' },
    { icon: '🍽', label: 'Food & Dining' },
    { icon: '✈', label: 'Transport' },
    { icon: '...', label: 'Other' }
  ];

  // Initialize form with activity data
  useEffect(() => {
    console.log('EditActivityModal - isOpen:', isOpen, 'activity:', activity);
    if (activity && isOpen) {
      const dateTime = new Date(activity.dateTime);
      const date = dateTime.toISOString().split('T')[0];
      const time = dateTime.toTimeString().slice(0, 5);

      setActivityData({
        title: activity.title || '',
        type: activity.type || 'Activity',
        date: date,
        time: time,
        location: activity.location || '',
        description: activity.description || ''
      });
    }
  }, [activity, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeSelect = (type) => {
    setActivityData(prev => ({
      ...prev,
      type: type
    }));
    setIsDropdownOpen(false);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (!activityData.title) {
      alert('Please enter activity title');
      return;
    }

    if (!activityData.date) {
      alert('Please select a date');
      return;
    }

    const dateTime = `${activityData.date}T${activityData.time}`;

    try {
      await updateActivity(activity.id, {
        title: activityData.title,
        type: activityData.type,
        dateTime: dateTime,
        location: activityData.location,
        description: activityData.description
      });

      console.log('Activity updated successfully');
      onActivityUpdated?.();
      onClose();
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('Failed to update activity: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivity(activity.id);
        console.log('Activity deleted successfully');
        onActivityUpdated?.();
        onClose();
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity: ' + error.message);
      }
    }
  };

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Activity</h2>
            <p className="text-sm text-gray-600 mt-1">Update the details of your activity</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveChanges} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={activityData.title}
              onChange={handleChange}
              placeholder="e.g., Visit Eiffel Tower"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-all"
            />
          </div>

          {/* Type Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Type</label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{activityTypes.find(t => t.label === activityData.type)?.icon}</span>
                  {activityData.type}
                </span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10">
                {activityTypes.map((type) => (
                  <button
                    key={type.label}
                    type="button"
                    onClick={() => {
                      handleTypeSelect(type.label);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-gray-900">{type.label}</span>
                    {activityData.type === type.label && (
                      <svg className="w-5 h-5 ml-auto text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
              <div className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 border-2 border-gray-300 flex items-center justify-between cursor-not-allowed">
                <span className="text-gray-900 font-medium">
                  {activityData.date ? new Date(activityData.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 'Select a day'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Time (optional)</label>
              <input
                type="time"
                name="time"
                value={activityData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Location (optional)</label>
            <input
              type="text"
              name="location"
              value={activityData.location}
              onChange={handleChange}
              placeholder="Where is this activity?"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description (optional)</label>
            <textarea
              name="description"
              value={activityData.description}
              onChange={handleChange}
              placeholder="Add notes, booking details, or other information..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

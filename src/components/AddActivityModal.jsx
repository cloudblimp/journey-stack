import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getCurrentISTDateTime } from '../utils/dateUtils';

export default function AddActivityModal({ isOpen, onClose, tripId, selectedDate, onAddActivity }) {
  const [activityData, setActivityData] = useState({
    title: '',
    type: 'Activity',
    date: selectedDate || '',
    time: getCurrentISTDateTime().split('T')[1] || '00:00',
    location: '',
    description: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Update date when selectedDate prop changes
  useEffect(() => {
    setActivityData(prev => ({
      ...prev,
      date: selectedDate || ''
    }));
  }, [selectedDate]);

  const activityTypes = [
    { icon: '↗', label: 'Activity' },
    { icon: '🏨', label: 'Accommodation' },
    { icon: '🍽', label: 'Food & Dining' },
    { icon: '✈', label: 'Transport' },
    { icon: '...', label: 'Other' }
  ];

  const resetForm = () => {
    setActivityData({
      title: '',
      type: 'Activity',
      date: selectedDate || '',
      time: getCurrentISTDateTime().split('T')[1] || '00:00',
      location: '',
      description: ''
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activityData.title) {
      alert('Please enter activity title');
      return;
    }

    if (!activityData.date) {
      alert('Please select a date');
      return;
    }

    // Combine date and time
    const dateTime = `${activityData.date}T${activityData.time}`;

    try {
      await onAddActivity({
        title: activityData.title || '',
        type: activityData.type || 'Activity',
        dateTime: dateTime || '',
        location: activityData.location || '',
        description: activityData.description || ''
      });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 rounded-xl max-w-2xl w-full shadow-2xl border border-emerald-500/30 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-500/20">
          <div>
            <h2 className="text-2xl font-bold text-white">New Activity</h2>
            <p className="text-sm text-emerald-200/70 mt-1">Add a new activity to your trip itinerary</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-400/60 hover:text-emerald-400"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={activityData.title}
              onChange={handleChange}
              placeholder="e.g., Visit Eiffel Tower"
              className="w-full px-4 py-3 bg-slate-800/50 rounded-lg border border-emerald-500/30 text-white placeholder-emerald-200/40 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Type Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-2">Type</label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-4 py-3 bg-slate-800/50 border-2 border-emerald-500/30 rounded-lg text-left flex items-center justify-between hover:border-emerald-500/50 hover:bg-slate-800 transition-all text-emerald-100"
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
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 border-2 border-emerald-500/30 rounded-lg shadow-2xl z-10 backdrop-blur-xl">
                {activityTypes.map((type) => (
                  <button
                    key={type.label}
                    type="button"
                    onClick={() => {
                      handleTypeSelect(type.label);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-emerald-500/10 transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-emerald-500/20 last:border-b-0 text-emerald-100"
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span>{type.label}</span>
                    {activityData.type === type.label && (
                      <svg className="w-5 h-5 ml-auto text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
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
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Date</label>
              <div className="w-full px-4 py-3 bg-slate-800/50 rounded-lg border-2 border-emerald-500/30 flex items-center justify-between cursor-not-allowed">
                <span className="text-emerald-100 font-medium">
                  {activityData.date ? new Date(activityData.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 'Select a day'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Time (optional)</label>
              <input
                type="time"
                name="time"
                value={activityData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 rounded-lg border border-emerald-500/30 text-white focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-2">Location (optional)</label>
            <input
              type="text"
              name="location"
              value={activityData.location}
              onChange={handleChange}
              placeholder="Where is this activity?"
              className="w-full px-4 py-3 bg-slate-800/50 rounded-lg border border-emerald-500/30 text-white placeholder-emerald-200/40 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-2">Description (optional)</label>
            <textarea
              name="description"
              value={activityData.description}
              onChange={handleChange}
              placeholder="Add notes, booking details, or other information..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-800/50 rounded-lg border border-emerald-500/30 text-white placeholder-emerald-200/40 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-emerald-200 bg-slate-800/50 border border-emerald-500/30 rounded-lg hover:bg-slate-800 hover:border-emerald-500/50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-all font-medium"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

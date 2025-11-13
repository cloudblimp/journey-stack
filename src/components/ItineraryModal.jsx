import React, { useState, useMemo } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import AddActivityModal from './AddActivityModal';
import { useActivities } from '../hooks/useActivities';

export default function ItineraryModal({ isOpen, onClose, trip, activities = [] }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [checkedEntries, setCheckedEntries] = useState({});
  const { createActivity } = useActivities();

  const activityTypes = [
    { icon: '↗', label: 'Activity', color: 'bg-blue-100 text-blue-700' },
    { icon: '🏨', label: 'Accommodation', color: 'bg-orange-100 text-orange-700' },
    { icon: '🍽', label: 'Food & Dining', color: 'bg-red-100 text-red-700' },
    { icon: '✈', label: 'Transport', color: 'bg-green-100 text-green-700' },
    { icon: '...', label: 'Other', color: 'bg-gray-100 text-gray-700' }
  ];

  // Format date to YYYY-MM-DD in local timezone (not UTC)
  const formatDateToKey = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  };

  // Calculate trip days - simplified
  const tripDays = useMemo(() => {
    try {
      if (!trip?.startDate || !trip?.endDate) return [];

      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const days = [];

      const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      while (current <= endDate) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      return days;
    } catch (error) {
      console.error('Error calculating trip days:', error);
      return [];
    }
  }, [trip?.startDate, trip?.endDate]);

  // Group activities by day
  const activitiesByDay = useMemo(() => {
    const grouped = {};

    tripDays.forEach((day) => {
      const dayKey = formatDateToKey(day);
      grouped[dayKey] = [];
    });

    activities.forEach((activity) => {
      try {
        const activityDate = formatDateToKey(new Date(activity.dateTime));
        if (grouped[activityDate]) {
          grouped[activityDate].push(activity);
        }
      } catch (e) {
        console.error('Error processing activity:', e);
      }
    });

    return grouped;
  }, [activities, tripDays, formatDateToKey]);

  // Early return AFTER all hooks
  if (!isOpen) return null;
  if (!trip || tripDays.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6">
          <p>No trip data available</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentDay = tripDays[selectedDayIndex];
  const currentDayKey = currentDay ? formatDateToKey(currentDay) : null;
  const currentDayActivities = currentDayKey ? (activitiesByDay[currentDayKey] || []) : [];

  const handlePrevDay = () => {
    if (selectedDayIndex > 0) {
      setSelectedDayIndex(selectedDayIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (selectedDayIndex < tripDays.length - 1) {
      setSelectedDayIndex(selectedDayIndex + 1);
    }
  };

  const formatDate = (d) => {
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatDayOfWeek = (d) => {
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const handleCheckboxChange = (entryId) => {
    setCheckedEntries(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };

  const handleAddActivity = async (activityData) => {
    try {
      if (!createActivity) {
        console.error('createActivity function not provided');
        return;
      }

      // Call createActivity with the activity data
      await createActivity(trip.id, {
        title: activityData.title || '',
        type: activityData.type || 'Activity',
        dateTime: activityData.dateTime || '',
        location: activityData.location || '',
        description: activityData.description || ''
      });

      console.log('Activity added successfully');
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trip Itinerary</h1>
            <p className="text-sm text-gray-600 mt-1">Plan your daily activities and keep track of your schedule</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 gap-6 p-6 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 pr-6 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase">Trip Days</h3>
            <div className="space-y-2">
              {tripDays.map((day, index) => {
                const dayKey = formatDateToKey(day);
                const count = activitiesByDay[dayKey]?.length || 0;
                const isSelected = selectedDayIndex === index;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDayIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isSelected ? 'bg-blue-50 border-2 border-blue-500' : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">Day {index + 1}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{count}/{count}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Day {selectedDayIndex + 1}</h2>
                <p className="text-sm text-gray-600">{formatDayOfWeek(currentDay)}, {formatDate(currentDay)}</p>
                <p className="text-sm text-gray-500 mt-1">{currentDayActivities.length} activities planned</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handlePrevDay}
                  disabled={selectedDayIndex === 0}
                  className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={handleNextDay}
                  disabled={selectedDayIndex === tripDays.length - 1}
                  className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            <button 
              onClick={() => setIsAddActivityModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 mb-6 w-fit">
              <FaPlus className="mr-2 h-4 w-4" /> Add Activity
            </button>

            {/* Activities */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {currentDayActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activities for this day</p>
              ) : (
                currentDayActivities.map((activity) => {
                  const time = new Date(activity.dateTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });
                  const isChecked = checkedEntries[activity.id] || false;

                  const activityType = activityTypes.find(t => t.label === activity.type) || activityTypes[0];

                  return (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4 flex gap-4">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(activity.id)}
                        className="mt-1 w-5 h-5 cursor-pointer" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 text-xs font-semibold rounded flex items-center gap-1 ${activityType.color}`}>
                            <span>{activityType.icon}</span>
                            <span>{activityType.label}</span>
                          </span>
                          <span className="text-sm text-gray-600">{time}</span>
                        </div>
                        <h4 className={`font-semibold text-gray-900 ${isChecked ? 'line-through text-gray-500' : ''}`}>{activity.title}</h4>
                        {activity.description && <p className="text-sm text-gray-600 mt-2">{activity.description}</p>}
                        {activity.location && <p className="text-sm text-gray-600 mt-2">📍 {activity.location}</p>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isAddActivityModalOpen}
        onClose={() => setIsAddActivityModalOpen(false)}
        tripId={trip?.id}
        selectedDate={currentDayKey}
        onAddActivity={handleAddActivity}
      />
    </div>
  );
}

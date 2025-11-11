import React from 'react';

export default function EntryDetailModal({ isOpen, onClose, entry, onDelete, onEdit, isDeleting }) {
  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Close</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-4">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900">{entry.title}</h2>

          {/* Date & Time */}
          <div className="flex items-center text-gray-600">
            <span className="inline-block mr-2">📅</span>
            {new Date(entry.dateTime).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          {/* Location */}
          {entry.location && (
            <div className="flex items-center text-gray-600">
              <span className="inline-block mr-2">📍</span>
              {entry.location}
            </div>
          )}

          {/* Photo */}
          {entry.photoUrl && (
            <div className="mt-4">
              <img
                src={entry.photoUrl}
                alt={entry.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Story */}
          <div className="mt-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {entry.story}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Close
            </button>

            <button
              onClick={() => onEdit(entry)}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 flex items-center"
            >
              <span className="mr-2">✏️</span> Edit
            </button>

            <button
              onClick={() => onDelete(entry.id)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <span className="mr-2">🗑️</span> Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

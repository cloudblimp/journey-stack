import { useState } from 'react';
import { journalApi } from '../api';

export default function JournalEditor({ tripId, onCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await journalApi.create(tripId, { title, content });
      setTitle('');
      setContent('');
      onCreated?.();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 mb-4">
      <input className="border rounded p-2" placeholder="Entry title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea className="border rounded p-2" placeholder="Write your story..." rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button className="bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50" disabled={loading} type="submit">{loading ? 'Saving...' : 'Add Entry'}</button>
    </form>
  );
}



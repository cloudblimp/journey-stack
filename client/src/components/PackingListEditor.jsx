import { useEffect, useState } from 'react';
import { packingApi } from '../api';

export default function PackingListEditor({ tripId }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    packingApi.get(tripId).then((list) => setItems(list?.items || [])).catch(() => {});
  }, [tripId]);

  async function save(itemsToSave) {
    try {
      const updated = await packingApi.update(tripId, itemsToSave);
      setItems(updated.items || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update packing list');
    }
  }

  function toggle(idx) {
    const next = items.map((it, i) => (i === idx ? { ...it, packed: !it.packed } : it));
    setItems(next);
    save(next);
  }

  function remove(idx) {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    save(next);
  }

  function add(e) {
    e.preventDefault();
    if (!newItem.trim()) return;
    const next = [...items, { name: newItem.trim(), packed: false }];
    setNewItem('');
    setItems(next);
    save(next);
  }

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Manage Packing List</h4>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <form onSubmit={add} className="flex gap-2 mb-2">
        <input className="border rounded p-2 flex-1" placeholder="Add item" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
        <button className="bg-slate-800 text-white rounded px-3 py-2" type="submit">Add</button>
      </form>
      <ul className="grid gap-1">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center justify-between border rounded p-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!it.packed} onChange={() => toggle(idx)} />
              <span className={it.packed ? 'line-through text-slate-500' : ''}>{it.name}</span>
            </label>
            <button className="text-red-600 text-sm" onClick={() => remove(idx)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}



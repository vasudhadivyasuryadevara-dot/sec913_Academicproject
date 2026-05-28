import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Plus, Trash2, Check, Loader2 } from 'lucide-react';
import AdminNav from '../../components/AdminNav';
import { adminAPI } from '../../utils/api';

const AdminSources = ({ showNav = true }) => {
  const [sources, setSources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newSource, setNewSource] = useState({
    name: '',
    categories: '',
    score: 90,
    status: 'Active',
  });

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.listSources();
      setSources(data);
    } catch (err) {
      setError('Unable to load sources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSource = async () => {
    if (!newSource.name.trim() || !newSource.categories.trim()) {
      setError('Name and categories are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const created = await adminAPI.createSource(newSource);
      setSources((prev) => [created, ...prev]);
      setShowForm(false);
      setNewSource({ name: '', categories: '', score: 90, status: 'Active' });
    } catch (err) {
      setError('Failed to add source. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full px-4 py-12 md:px-6 mt-20">
      <div className="mx-auto max-w-7xl">
        {showNav && <AdminNav />}

        <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-glass-lg backdrop-blur-2xl mb-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neon-cyan">Source Operations</p>
              <h1 className="text-3xl font-black text-white">Manage News Sources</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm((prev) => !prev);
                setError('');
              }}
              className="inline-flex items-center gap-2 rounded-3xl bg-gradient-neon px-5 py-3 font-bold text-white shadow-neon-cyan hover:opacity-95 transition-all"
            >
              <Plus size={18} /> Add Source
            </button>
          </div>

          {showForm && (
            <div className="mb-6 rounded-3xl bg-dark-800/90 p-6 border border-white/10">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Source Name</span>
                  <input
                    type="text"
                    value={newSource.name}
                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-neon-cyan"
                    placeholder="Reuters"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Categories</span>
                  <input
                    type="text"
                    value={newSource.categories}
                    onChange={(e) => setNewSource({ ...newSource, categories: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-neon-cyan"
                    placeholder="Business, Markets"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Approval Status</span>
                  <select
                    value={newSource.status}
                    onChange={(e) => setNewSource({ ...newSource, status: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-neon-cyan"
                  >
                    <option>Active</option>
                    <option>Review</option>
                    <option>Inactive</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-gray-300">Reputation Score</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newSource.score}
                    onChange={(e) => setNewSource({ ...newSource, score: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-neon-cyan"
                  />
                </label>
              </div>
              {error && <p className="mt-4 text-sm text-neon-pink">{error}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCreateSource}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-3xl bg-neon-cyan px-5 py-3 text-black font-semibold hover:opacity-90 transition-all"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  {saving ? 'Saving...' : 'Save Source'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center gap-2 rounded-3xl border border-white/10 px-5 py-3 text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="py-10 text-center text-gray-400">Loading sources...</div>
          )}

          {!loading && sources.length === 0 && (
            <div className="rounded-3xl bg-dark-800/90 p-8 text-center text-gray-400">No sources available yet.</div>
          )}

          {!loading && (
            <div className="grid gap-4">
              {sources.map((source) => (
                <div key={source.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-dark-800/90 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neon-cyan/15 text-neon-cyan">
                      <Globe />
                    </div>
                    <div>
                      <p className="font-bold text-white">{source.name}</p>
                      <p className="text-sm text-gray-400">{source.categories}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-neon-cyan/15 px-3 py-1 text-sm text-neon-cyan">{source.score}%</span>
                    <span className={`rounded-full px-3 py-1 text-sm ${source.status === 'Active' ? 'bg-emerald-500/15 text-emerald-300' : source.status === 'Review' ? 'bg-amber-500/15 text-amber-300' : 'bg-red-500/15 text-red-300'}`}>
                      {source.status}
                    </span>
                    <button className="rounded-xl bg-neon-pink/10 p-3 text-neon-pink">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </motion.main>
  );
};

export default AdminSources;

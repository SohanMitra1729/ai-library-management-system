import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Bookmark, Loader2, CheckCircle2, Check, X } from 'lucide-react';

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reservations/all');
      setReservations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleIssue = async (id) => {
    if (!window.confirm('Are you sure you want to issue this reserved book?')) return;
    try {
      setError('');
      setActionSuccess('');
      // Default 14 days due date
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      const due_date = dueDate.toISOString().split('T')[0];

      await api.post(`/reservations/${id}/issue`, { due_date });
      setActionSuccess('Reservation successfully converted to Issued Book.');
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue reserved book');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? The copy will be returned to inventory.')) return;
    try {
      setError('');
      setActionSuccess('');
      await api.post(`/reservations/${id}/cancel`);
      setActionSuccess('Reservation cancelled successfully.');
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col p-8 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 bg-bgPrimary">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.4] blur-[2px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/20 via-bgPrimary/40 to-bgPrimary/95"></div>
      </div>

      <div className="relative z-10 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-textPrimary mb-3 flex items-center gap-3">
            <Bookmark className="text-accentCyan" size={36} />
            Manage Reservations
          </h1>
          <p className="text-textSecondary text-lg font-medium bg-bgSecondary/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-white/5">
            View all student reservations, issue books, or cancel expired requests.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 backdrop-blur-md shadow-lg font-medium text-center">
            {error}
          </div>
        )}

        {actionSuccess && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl mb-6 flex items-center justify-center gap-3 backdrop-blur-md shadow-lg font-bold">
            <CheckCircle2 size={20} />
            {actionSuccess}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-accentCyan">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="text-lg font-bold">Loading Reservations...</p>
          </div>
        ) : (
          <div className="bg-cardBgGlass border border-white/10 rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-[18px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-textSecondary text-xs uppercase tracking-wider border-b border-white/10">
                    <th className="p-4 pl-6 font-bold">Student</th>
                    <th className="p-4 font-bold">Book Title</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 pr-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-medium">
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-textSecondary">
                        No reservations found.
                      </td>
                    </tr>
                  ) : (
                    reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="text-textPrimary font-bold">{res.student_name}</div>
                          <div className="text-textSecondary text-xs">{res.student_email}</div>
                        </td>
                        <td className="p-4 text-textPrimary">{res.book_title}</td>
                        <td className="p-4 text-textSecondary">
                          {new Date(res.reservation_date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            res.status === 'Active' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            res.status === 'Collected' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            res.status === 'Cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          {res.status === 'Active' && (
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleIssue(res.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-accentCyan hover:bg-white text-bgPrimary hover:text-accentCyan rounded-lg font-bold transition-all shadow-sm"
                                title="Issue Book"
                              >
                                <Check size={16} /> Issue
                              </button>
                              <button
                                onClick={() => handleCancel(res.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 rounded-lg font-bold transition-all shadow-sm"
                                title="Cancel Reservation"
                              >
                                <X size={16} /> Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReservations;

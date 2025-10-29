'use client';

import { useState, useEffect } from 'react';
import { Phone, Clock, Calendar, User, MessageSquare, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface Call {
  id: string;
  customerName: string;
  phone: string;
  scheduledTime: string;
  status: 'scheduled' | 'completed' | 'missed' | 'in-progress';
  notes: string;
  duration?: number;
}

export default function Home() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCall, setNewCall] = useState({
    customerName: '',
    phone: '',
    scheduledTime: '',
    notes: '',
  });

  useEffect(() => {
    const savedCalls = localStorage.getItem('freelanceCalls');
    if (savedCalls) {
      setCalls(JSON.parse(savedCalls));
    } else {
      const demoData: Call[] = [
        {
          id: '1',
          customerName: 'John Smith',
          phone: '+1-555-0123',
          scheduledTime: new Date(Date.now() + 3600000).toISOString(),
          status: 'scheduled',
          notes: 'Website redesign project discussion',
        },
        {
          id: '2',
          customerName: 'Sarah Johnson',
          phone: '+1-555-0456',
          scheduledTime: new Date(Date.now() - 7200000).toISOString(),
          status: 'completed',
          notes: 'Logo design final review',
          duration: 25,
        },
      ];
      setCalls(demoData);
      localStorage.setItem('freelanceCalls', JSON.stringify(demoData));
    }
  }, []);

  const saveCalls = (updatedCalls: Call[]) => {
    setCalls(updatedCalls);
    localStorage.setItem('freelanceCalls', JSON.stringify(updatedCalls));
  };

  const addCall = () => {
    if (!newCall.customerName || !newCall.phone || !newCall.scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    const call: Call = {
      id: Date.now().toString(),
      ...newCall,
      status: 'scheduled',
    };

    saveCalls([...calls, call]);
    setNewCall({ customerName: '', phone: '', scheduledTime: '', notes: '' });
    setShowAddForm(false);
  };

  const updateCallStatus = (id: string, status: Call['status']) => {
    const updatedCalls = calls.map(call =>
      call.id === id ? { ...call, status } : call
    );
    saveCalls(updatedCalls);
  };

  const deleteCall = (id: string) => {
    if (confirm('Delete this call?')) {
      saveCalls(calls.filter(call => call.id !== id));
    }
  };

  const getStatusColor = (status: Call['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'missed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedCalls = [...calls].sort((a, b) =>
    new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
  );

  const upcomingCalls = sortedCalls.filter(c => c.status === 'scheduled' || c.status === 'in-progress');
  const pastCalls = sortedCalls.filter(c => c.status === 'completed' || c.status === 'missed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-3 rounded-xl">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Call Agent</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your client calls</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Call
            </button>
          </div>

          {showAddForm && (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl mb-6 border-2 border-indigo-200 dark:border-indigo-800">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Schedule New Call</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={newCall.customerName}
                    onChange={(e) => setNewCall({ ...newCall, customerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newCall.phone}
                    onChange={(e) => setNewCall({ ...newCall, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+1-555-0123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Scheduled Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={newCall.scheduledTime}
                    onChange={(e) => setNewCall({ ...newCall, scheduledTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={newCall.notes}
                    onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Project details..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={addCall}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Schedule Call
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingCalls.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {calls.filter(c => c.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Missed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {calls.filter(c => c.status === 'missed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              Upcoming Calls
            </h2>
            <div className="space-y-3">
              {upcomingCalls.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No upcoming calls</p>
              ) : (
                upcomingCalls.map(call => (
                  <div key={call.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {call.customerName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4" />
                          {call.phone}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      {formatDate(call.scheduledTime)}
                    </p>
                    {call.notes && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {call.notes}
                      </p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => updateCallStatus(call.id, 'in-progress')}
                        className="text-xs bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded transition-colors"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => updateCallStatus(call.id, 'completed')}
                        className="text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateCallStatus(call.id, 'missed')}
                        className="text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded transition-colors"
                      >
                        Missed
                      </button>
                      <button
                        onClick={() => deleteCall(call.id)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Past Calls
            </h2>
            <div className="space-y-3">
              {pastCalls.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No past calls</p>
              ) : (
                pastCalls.reverse().map(call => (
                  <div key={call.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {call.customerName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4" />
                          {call.phone}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      {formatDate(call.scheduledTime)}
                      {call.duration && <span>• {call.duration} min</span>}
                    </p>
                    {call.notes && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {call.notes}
                      </p>
                    )}
                    <button
                      onClick={() => deleteCall(call.id)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

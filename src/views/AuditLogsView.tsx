import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { ShieldAlert, RefreshCw, Filter, ShieldCheck } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { currentTenant, activeRole, showToast } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [currentTenant?.id, activeRole]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Security & Multi-Tenant Audit Trail
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable operational logs for compliance and data boundary verification.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Recorded Security Events</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
              {logs.length} Total
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {activeRole === 'SUPER_ADMIN'
              ? 'Showing Global Audit Trail (All Tenants)'
              : `Scoped to ${currentTenant?.name}`}
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400">Loading audit trail...</p>
        ) : logs.length === 0 ? (
          <p className="text-xs text-slate-400">No events recorded in this partition.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-medium">Timestamp</th>
                  <th className="pb-2 font-medium">Tenant</th>
                  <th className="pb-2 font-medium">Actor</th>
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium">Action</th>
                  <th className="pb-2 font-medium">Details</th>
                  <th className="pb-2 font-medium text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()} •{' '}
                      {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 font-bold text-indigo-700">{log.organizationId}</td>
                    <td className="py-2.5 text-slate-700">{log.userEmail}</td>
                    <td className="py-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-sans font-semibold">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold text-slate-900 font-sans">{log.action}</td>
                    <td className="py-2.5 text-slate-600 font-sans max-w-sm truncate">
                      {log.details}
                    </td>
                    <td className="py-2.5 text-right text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

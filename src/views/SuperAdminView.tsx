import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Organization, ActiveTab } from '../types';
import {
  Server,
  Building2,
  Users,
  ShieldCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface SuperAdminViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({ setActiveTab }) => {
  const { currentTenant, switchTenant, showToast } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Academy onboarding form state
  const [formData, setFormData] = useState({
    academyName: '',
    academyNameAr: '',
    adminEmail: '',
    adminName: '',
    plan: 'pro',
    country: 'Saudi Arabia',
    phone: '+966 50 123 4567',
  });
  const [onboarding, setOnboarding] = useState(false);

  const loadOrgs = async () => {
    try {
      setLoading(true);
      const data = await api.getOrganizations();
      setOrganizations(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load organizations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  const handleOnboardAcademy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.academyName || !formData.adminEmail || !formData.adminName) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    try {
      setOnboarding(true);
      const res = await api.registerTenant(formData);
      if (res.success) {
        showToast(`Tenant "${res.organization.name}" provisioned successfully!`, 'success');
        setOrganizations((prev) => [...prev, res.organization]);
        setShowModal(false);
        setFormData({
          academyName: '',
          academyNameAr: '',
          adminEmail: '',
          adminName: '',
          plan: 'pro',
          country: 'Saudi Arabia',
          phone: '',
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to onboard academy', 'error');
    } finally {
      setOnboarding(false);
    }
  };

  const totalStudents = organizations.reduce((acc, o) => acc + (o.studentLimit || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Root Control (MR. FLUENCY Global Network)</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Multi-Tenant Platform Supervision
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Global monitoring of all tenant partitions, subscription contracts, data isolation boundaries,
            and institution provisioning.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Academy Tenant</span>
        </button>
      </div>

      {/* Global Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Active Tenant Academies</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{organizations.length}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">100% Data Isolated</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Global Seat Capacity</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{totalStudents}</div>
          <p className="text-[11px] text-slate-500 mt-1">Across all subscribed centers</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Platform SaaS MRR</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">$598 / mo</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Active subscription billing</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Server Health & AI Engine</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">Optimal</div>
          <p className="text-[11px] text-slate-500 mt-1">Gemini 3.8-Flash Gateway Connected</p>
        </div>
      </div>

      {/* Organizations Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Provisioned Tenant Academies</h3>
          <span className="text-xs text-slate-500">{organizations.length} Organizations Total</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400">Loading organizations...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-medium">Academy Name</th>
                  <th className="pb-2 font-medium">Tenant ID / Slug</th>
                  <th className="pb-2 font-medium">Subscription</th>
                  <th className="pb-2 font-medium">Capacity</th>
                  <th className="pb-2 font-medium">AI Usage</th>
                  <th className="pb-2 font-medium text-right">Switch Scoped Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {organizations.map((org) => {
                  const isCurrent = currentTenant?.id === org.id;

                  return (
                    <tr key={org.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-slate-800">
                        {org.name}
                        {org.nameAr && (
                          <span className="text-[11px] text-slate-400 block font-serif">
                            {org.nameAr}
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-mono text-[11px] text-slate-500">{org.slug}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-indigo-50 text-indigo-700">
                          {org.plan}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">
                        {org.studentLimit} Students • {org.teacherLimit} Teachers
                      </td>
                      <td className="py-3 text-slate-600">
                        {org.aiCreditsUsed} / {org.aiCreditsLimit} credits
                      </td>
                      <td className="py-3 text-right">
                        {isCurrent ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            Current Active Scoped
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              switchTenant(org.id);
                              setActiveTab('admin-dashboard');
                            }}
                            className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
                          >
                            Inspect Tenant →
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard New Tenant Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Onboard & Provision New Academy
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Instantiates a new isolated database partition with dedicated admin credentials.
            </p>

            <form onSubmit={handleOnboardAcademy} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Academy Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.academyName}
                  onChange={(e) => setFormData({ ...formData, academyName: e.target.value })}
                  placeholder="e.g. Cambridge Language Institute"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Academy Name (Arabic)
                </label>
                <input
                  type="text"
                  value={formData.academyNameAr}
                  onChange={(e) => setFormData({ ...formData, academyNameAr: e.target.value })}
                  placeholder="e.g. معهد كامبريدج للغات"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-serif text-right"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Director / Admin Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    placeholder="e.g. Prof. Khaled Al-Mutairi"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Admin Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    placeholder="director@institute.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Plan Tier</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="starter">Starter ($49/mo - 50 Students)</option>
                    <option value="growth">Growth ($149/mo - 250 Students)</option>
                    <option value="pro">Pro Academy ($299/mo - 1,000 Students)</option>
                    <option value="enterprise">Enterprise ($799/mo - Unlimited)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={onboarding}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-50"
                >
                  {onboarding ? 'Provisioning...' : 'Provision Academy Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

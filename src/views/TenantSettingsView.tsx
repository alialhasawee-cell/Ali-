import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  OrganizationAddress,
  OrganizationSocialLinks,
  OrganizationBranding,
  OrganizationAcademicSettings,
  OrganizationCertificateSettings,
} from '../types';
import {
  Settings,
  Save,
  Building2,
  MapPin,
  Palette,
  Share2,
  GraduationCap,
  Award,
  Globe,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

type SettingsTab = 'general' | 'address' | 'branding' | 'social' | 'academic' | 'certificates';

export const TenantSettingsView: React.FC = () => {
  const { currentTenant, refreshSession, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('');
  const [currency, setCurrency] = useState('SAR');

  const [address, setAddress] = useState<OrganizationAddress>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [socialLinks, setSocialLinks] = useState<OrganizationSocialLinks>({
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: '',
    facebook: '',
  });

  const [branding, setBranding] = useState<OrganizationBranding>({
    brandColor: '#4f46e5',
    secondaryColor: '#0ea5e9',
    accentColor: '#f59e0b',
    fontFamily: 'Inter, system-ui',
    logoUrl: '',
    faviconUrl: '',
    headerStyle: 'brand',
  });

  const [academicSettings, setAcademicSettings] = useState<OrganizationAcademicSettings>({
    gradingScale: 'percentage',
    minAttendanceRate: 80,
    minQuizPassingScore: 70,
    defaultClassDuration: 60,
    academicTerm: 'Fall 2026',
    enableAiFluencyEvaluator: true,
  });

  const [certificateSettings, setCertificateSettings] = useState<OrganizationCertificateSettings>({
    certificateTitle: 'Certificate of English Language Proficiency',
    signatoryName: 'Prof. Ali Al-Mansoor',
    signatoryTitle: 'Academic Director & Founder',
    secondarySignatoryName: 'Dr. Sarah Jenkins',
    secondarySignatoryTitle: 'Head of English Pedagogy',
    enableQrVerification: true,
    verificationCodePrefix: 'MFC',
    sealText: 'OFFICIAL REGISTERED ACCREDITATION • MR. FLUENCY',
  });

  useEffect(() => {
    if (currentTenant) {
      setName(currentTenant.name || '');
      setNameAr(currentTenant.nameAr || '');
      setContactEmail(currentTenant.contactEmail || '');
      setPhone(currentTenant.phone || '');
      setEmergencyPhone(currentTenant.emergencyPhone || '');
      setWebsiteUrl(currentTenant.websiteUrl || '');
      setCustomDomain(currentTenant.customDomain || '');
      setCountry(currentTenant.country || 'Saudi Arabia');
      setTimezone(currentTenant.timezone || 'Asia/Riyadh');
      setCurrency(currentTenant.currency || 'SAR');

      if (currentTenant.address) setAddress({ ...currentTenant.address });
      if (currentTenant.socialLinks) setSocialLinks({ ...currentTenant.socialLinks });
      if (currentTenant.branding) setBranding({ ...currentTenant.branding });
      if (currentTenant.academicSettings) setAcademicSettings({ ...currentTenant.academicSettings });
      if (currentTenant.certificateSettings) setCertificateSettings({ ...currentTenant.certificateSettings });
    }
  }, [currentTenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateOrganizationSettings({
        name,
        nameAr,
        contactEmail,
        phone,
        emergencyPhone,
        websiteUrl,
        customDomain,
        country,
        timezone,
        currency,
        address,
        socialLinks,
        branding,
        academicSettings,
        certificateSettings,
      });
      await refreshSession();
      showToast('Organization profile and settings updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Organization & Customer Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage branding, contact information, regional address, academic rules, and certification parameters for{' '}
            <strong className="text-slate-700">{currentTenant?.name}</strong>.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Settings...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Main Settings Container with Left Tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Tab Sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 p-4 space-y-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'general'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Organization & Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('address')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'address'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Address & Region</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'branding'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Logo & Branding</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'social'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Website & Social Links</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'academic'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Academic Governance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certificates')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'certificates'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificate Settings</span>
          </button>

          {/* Institutional Partition Info Card */}
          <div className="pt-6 mt-6 border-t border-slate-200 text-[11px] text-slate-500 space-y-2">
            <div className="flex items-center justify-between">
              <span>Partition ID:</span>
              <span className="font-mono text-indigo-700 font-bold">{currentTenant?.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Isolation Mode:</span>
              <span className="text-emerald-700 font-semibold">Strict Tenant Scoped</span>
            </div>
          </div>
        </aside>

        {/* Tab Content Form */}
        <div className="flex-1 p-6 text-xs">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. General Identity & Contact Information */}
            {activeTab === 'general' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Organization Identity & Contacts</h3>
                  <p className="text-slate-500">
                    Institutional name and primary contact points used in student communication.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Organization Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Organization Name (Arabic)
                    </label>
                    <input
                      type="text"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-serif text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      dir="rtl"
                      placeholder="مثال: أكاديمية أكسفورد للغات"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="admissions@academy.com"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Primary Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+966 11 400 0000"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Emergency / Student Support Hotline
                    </label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+966 50 123 4567"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Official Website URL
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://www.academy.edu"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Address & Regional Settings */}
            {activeTab === 'address' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Physical Address & Regional Configuration</h3>
                  <p className="text-slate-500">
                    Campus location details printed on formal certificates and official invoices.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={address.street || ''}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Olaya Street, Educational District, Building 42"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={address.city || ''}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Riyadh"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">State / Province</label>
                    <input
                      type="text"
                      value={address.state || ''}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Riyadh Province"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={address.postalCode || ''}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="12211"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setAddress({ ...address, country: e.target.value });
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Saudi Arabia"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                      <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                      <option value="Europe/London">Europe/London (GMT+0)</option>
                      <option value="America/New_York">America/New_York (GMT-5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Operating Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="SAR">SAR (Saudi Riyal)</option>
                      <option value="AED">AED (UAE Dirham)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="EGP">EGP (Egyptian Pound)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Logo & Visual Branding */}
            {activeTab === 'branding' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">White-Label Branding & Colors</h3>
                  <p className="text-slate-500">
                    Customize your student portal with institutional colors, fonts, and custom logo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={branding.logoUrl || ''}
                      onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://your-domain.com/logo.png"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Recommended: Transparent PNG (240x60px)</p>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Custom Subdomain / CNAMED Domain
                    </label>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="learning.academy.edu"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={branding.brandColor || '#4f46e5'}
                        onChange={(e) => setBranding({ ...branding, brandColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input
                        type="text"
                        value={branding.brandColor || '#4f46e5'}
                        onChange={(e) => setBranding({ ...branding, brandColor: e.target.value })}
                        className="flex-1 p-2 rounded-xl border border-slate-200 font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Secondary Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={branding.secondaryColor || '#0ea5e9'}
                        onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input
                        type="text"
                        value={branding.secondaryColor || '#0ea5e9'}
                        onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                        className="flex-1 p-2 rounded-xl border border-slate-200 font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Header Theme</label>
                    <select
                      value={branding.headerStyle || 'brand'}
                      onChange={(e) => setBranding({ ...branding, headerStyle: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="brand">Brand Tinted Header</option>
                      <option value="dark">Professional Slate Dark</option>
                      <option value="light">Minimalist Crisp Light</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Font Family Hierarchy</label>
                    <select
                      value={branding.fontFamily || 'Inter, system-ui'}
                      onChange={(e) => setBranding({ ...branding, fontFamily: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Inter, system-ui">Inter Modern Sans</option>
                      <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                      <option value="Outfit, sans-serif">Outfit Contemporary</option>
                      <option value="Cairo, sans-serif">Cairo (Optimized Arabic/English)</option>
                    </select>
                  </div>
                </div>

                {/* Live Brand Preview Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 mt-4 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Live Portal Branding Preview
                  </span>
                  <div
                    className="p-4 rounded-xl text-white flex items-center justify-between shadow-sm"
                    style={{ backgroundColor: branding.brandColor || '#4f46e5' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
                        MF
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">{name || 'Academy Name'}</h4>
                        <p className="text-[10px] text-white/80">{nameAr || 'English & Training Institute'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-bold">
                      Live Preview
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Website & Social Links */}
            {activeTab === 'social' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Official Web Presence & Social Profiles</h3>
                  <p className="text-slate-500">
                    Social links displayed in student invitation emails, newsletters, and verification footers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      X / Twitter Profile
                    </label>
                    <input
                      type="url"
                      value={socialLinks.twitter || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://x.com/your_academy"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      LinkedIn Page
                    </label>
                    <input
                      type="url"
                      value={socialLinks.linkedin || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://linkedin.com/company/your-academy"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Instagram Profile
                    </label>
                    <input
                      type="url"
                      value={socialLinks.instagram || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://instagram.com/your_academy"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      YouTube Channel
                    </label>
                    <input
                      type="url"
                      value={socialLinks.youtube || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://youtube.com/@your_academy"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Facebook Page
                    </label>
                    <input
                      type="url"
                      value={socialLinks.facebook || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://facebook.com/your_academy"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. Academic Governance */}
            {activeTab === 'academic' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Academic Governance & Curriculum Policies</h3>
                  <p className="text-slate-500">
                    Define minimum attendance thresholds, grading scales, and AI tool access for faculty.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Default Grading Scale
                    </label>
                    <select
                      value={academicSettings.gradingScale}
                      onChange={(e) =>
                        setAcademicSettings({
                          ...academicSettings,
                          gradingScale: e.target.value as any,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="percentage">Numerical Percentage (0 - 100%)</option>
                      <option value="letter">Letter Grades (A, B, C, D, F)</option>
                      <option value="cefr">CEFR Band Standard (A1, A2, B1, B2, C1, C2)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Active Academic Term
                    </label>
                    <input
                      type="text"
                      value={academicSettings.academicTerm}
                      onChange={(e) =>
                        setAcademicSettings({ ...academicSettings, academicTerm: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Fall 2026 Cohort"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Minimum Attendance for Certification (%)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={academicSettings.minAttendanceRate}
                      onChange={(e) =>
                        setAcademicSettings({
                          ...academicSettings,
                          minAttendanceRate: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Students below this threshold are flagged</p>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Minimum Quiz Passing Score (%)
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={100}
                      value={academicSettings.minQuizPassingScore}
                      onChange={(e) =>
                        setAcademicSettings({
                          ...academicSettings,
                          minQuizPassingScore: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Standard Class Session Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min={30}
                      max={240}
                      value={academicSettings.defaultClassDuration}
                      onChange={(e) =>
                        setAcademicSettings({
                          ...academicSettings,
                          defaultClassDuration: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-indigo-50/50 mt-1">
                    <input
                      type="checkbox"
                      id="ai-toggle"
                      checked={academicSettings.enableAiFluencyEvaluator}
                      onChange={(e) =>
                        setAcademicSettings({
                          ...academicSettings,
                          enableAiFluencyEvaluator: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="ai-toggle" className="cursor-pointer">
                      <span className="font-bold text-slate-900 block text-xs">
                        Enable Gemini 3.8-Flash AI Fluency Evaluator
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Allows faculty to run IELTS Band predictions and automated essay grading
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Certificate Settings */}
            {activeTab === 'certificates' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Graduation Certificate & Credentialing Settings</h3>
                  <p className="text-slate-500">
                    Configure institutional signatures, verification code prefixes, and cryptographic seal text.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Official Certificate Header Title
                    </label>
                    <input
                      type="text"
                      value={certificateSettings.certificateTitle}
                      onChange={(e) =>
                        setCertificateSettings({
                          ...certificateSettings,
                          certificateTitle: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Primary Signatory Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={certificateSettings.signatoryName}
                      onChange={(e) =>
                        setCertificateSettings({
                          ...certificateSettings,
                          signatoryName: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Prof. Ali Al-Mansoor"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Primary Signatory Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={certificateSettings.signatoryTitle}
                      onChange={(e) =>
                        setCertificateSettings({
                          ...certificateSettings,
                          signatoryTitle: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Academic Director & Founder"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Secondary Signatory Name
                    </label>
                    <input
                      type="text"
                      value={certificateSettings.secondarySignatoryName || ''}
                      onChange={(e) =>
                        setCertificateSettings({
                          ...certificateSettings,
                          secondarySignatoryName: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Dr. Sarah Jenkins"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Secondary Signatory Title
                    </label>
                    <input
                      type="text"
                      value={certificateSettings.secondarySignatoryTitle || ''}
                      onChange={(e) =>
                        setCertificateSettings({
                          ...certificateSettings,
                          secondarySignatoryTitle: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Head of English Pedagogy"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Verification Code Prefix
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={certificateSettings.verificationCodePrefix}
                      onChange={(e) =>
                        setCertificateSettings({
                          ...certificateSettings,
                          verificationCodePrefix: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="MFC"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Official Security Seal Text
                    </label>
                    <input
                      type="text"
                      value={certificateSettings.sealText || ''}
                      onChange={(e) =>
                        setCertificateSettings({
                          ...certificateSettings,
                          sealText: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="OFFICIAL REGISTERED ACCREDITATION"
                    />
                  </div>
                </div>

                {/* Certificate Seal Preview */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center text-amber-700 font-bold text-xs flex-shrink-0">
                    SEAL
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">
                      {certificateSettings.certificateTitle}
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Signatures: {certificateSettings.signatoryName} ({certificateSettings.signatoryTitle})
                    </p>
                    <span className="text-[10px] text-amber-700 font-mono">
                      Sample Code: {certificateSettings.verificationCodePrefix}-2026-894123
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Save Action Bar */}
            <div className="pt-5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">
                Changes are instantly scoped to this tenant partition.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

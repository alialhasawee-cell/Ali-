import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Organization, UserRole } from '../types';
import { api } from '../services/api';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AuthContextType {
  currentUser: User | null;
  currentTenant: Organization | null;
  availableTenants: Partial<Organization>[];
  activeRole: UserRole;
  isLoading: boolean;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  switchRole: (role: UserRole, tenantId?: string) => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Organization | null>(null);
  const [availableTenants, setAvailableTenants] = useState<Partial<Organization>[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>('ORGANIZATION_OWNER');
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.getSession();
      if (res.user) {
        setCurrentUser(res.user);
        setActiveRole(res.user.role);
        api.setUserId(res.user.id);
      }
      if (res.tenant) {
        setCurrentTenant(res.tenant);
        api.setTenantId(res.tenant.id);
      }
      if (res.availableTenants) {
        setAvailableTenants(res.availableTenants);
      }
    } catch (err: any) {
      console.error('Session load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const switchRole = async (role: UserRole, tenantId?: string) => {
    try {
      setIsLoading(true);
      const targetTenant = tenantId || (role === 'SUPER_ADMIN' ? 'system' : currentTenant?.id || 'org_oxford');
      const res = await api.switchDemoRole(role, targetTenant);
      if (res.success) {
        setCurrentUser(res.user);
        setActiveRole(res.activeRole);
        api.setUserId(res.user.id);
        if (res.tenant) {
          setCurrentTenant(res.tenant);
          api.setTenantId(res.tenant.id);
        }
        showToast(`Switched view to ${role.replace('_', ' ')} (${res.user.fullName})`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to switch role', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = async (tenantId: string) => {
    try {
      setIsLoading(true);
      api.setTenantId(tenantId);
      const res = await api.switchDemoRole(activeRole, tenantId);
      if (res.success) {
        setCurrentUser(res.user);
        if (res.tenant) {
          setCurrentTenant(res.tenant);
        }
        showToast(`Active tenant switched to: ${res.tenant?.name || tenantId}`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to switch tenant', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (activeRole === 'SUPER_ADMIN') return true;
    return roles.includes(activeRole);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentTenant,
        availableTenants,
        activeRole,
        isLoading,
        toasts,
        showToast,
        removeToast,
        switchRole,
        switchTenant,
        hasRole,
        refreshSession,
      }}
    >
      {children}

      {/* Floating Global Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-100'
                : toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500/30 text-rose-100'
                : 'bg-slate-900/95 border-slate-700 text-slate-100'
            }`}
          >
            <span>{toast.message}</span>
            <span className="text-xs opacity-60 ml-3">✕</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

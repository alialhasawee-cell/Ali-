import { Request, Response, NextFunction } from 'express';
import { tenantStore } from '../db/store';
import { User, UserRole } from '../types';

export interface AuthenticatedRequest extends Request {
  tenantId?: string;
  user?: User;
}

export function tenantAndAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // 1. Resolve Tenant ID: Check headers, then query, then user default
  let tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);

  // 2. Resolve User: Check x-user-id or Authorization bearer
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string);

  if (userId) {
    const user = tenantStore.getUserById(userId);
    if (user) {
      req.user = user;
      // If user is not superadmin, lock tenantId to user's organizationId
      if (user.role !== 'SUPER_ADMIN') {
        tenantId = user.organizationId;
      }
    }
  }

  // Fallback tenant if not set
  if (!tenantId) {
    tenantId = req.user?.organizationId || 'org_oxford';
  }

  req.tenantId = tenantId;
  next();
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      // For seamless demo exploration, if no explicit user, assign default role based on tenant
      const usersInTenant = tenantStore.getUsers(req.tenantId || 'org_oxford');
      const defaultOwner = usersInTenant.find((u) => u.role === 'ORGANIZATION_OWNER') || usersInTenant[0];
      if (defaultOwner && allowedRoles.includes(defaultOwner.role)) {
        req.user = defaultOwner;
        return next();
      }
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Super Admin has access to everything
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Role ${req.user.role} does not have required permissions: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
}

export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Requires Platform Super Admin privileges' });
  }
  next();
}

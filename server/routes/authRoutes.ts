import { Router, Response } from 'express';
import { tenantStore } from '../db/store';
import { AuthenticatedRequest } from '../middleware/auth';

export const authRouter = Router();

// Get current session or active user profile
authRouter.get('/me', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const tenant = tenantStore.getOrganizationById(req.tenantId || 'org_oxford');
  res.json({
    user: user || null,
    tenant: tenant || null,
    availableTenants: tenantStore.getOrganizations().map((o) => ({
      id: o.id,
      name: o.name,
      nameAr: o.nameAr,
      slug: o.slug,
      plan: o.plan,
    })),
  });
});

// Login endpoint
authRouter.post('/login', (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = tenantStore.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found with this email' });
  }

  const tenant = tenantStore.getOrganizationById(user.organizationId);

  tenantStore.addAuditLog({
    organizationId: user.organizationId,
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    action: 'USER_LOGIN',
    resource: 'Auth',
    details: `User ${user.fullName} logged in successfully`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({
    token: `jwt_session_${user.id}`,
    user,
    tenant,
  });
});

// Demo Persona Switcher (Convenient interactive role switching for testing all portals)
authRouter.post('/switch-demo', (req: AuthenticatedRequest, res: Response) => {
  const { role, tenantId } = req.body;

  let targetTenant = tenantId || 'org_oxford';
  let targetUser = null;

  if (role === 'SUPER_ADMIN') {
    targetUser = tenantStore.getUserById('usr_superadmin');
    targetTenant = 'system';
  } else if (role === 'ORGANIZATION_OWNER') {
    targetUser = targetTenant === 'org_fluency' 
      ? tenantStore.getUserById('usr_fluency_owner')
      : tenantStore.getUserById('usr_oxf_owner');
  } else if (role === 'TEACHER') {
    targetUser = targetTenant === 'org_fluency'
      ? tenantStore.getUserById('usr_fluency_teacher1')
      : tenantStore.getUserById('usr_oxf_teacher1');
  } else if (role === 'STUDENT') {
    targetUser = targetTenant === 'org_fluency'
      ? tenantStore.getUserById('usr_fluency_student1')
      : tenantStore.getUserById('usr_oxf_student1');
  } else if (role === 'PARENT') {
    targetUser = tenantStore.getUserById('usr_oxf_parent1');
    targetTenant = 'org_oxford';
  }

  if (!targetUser) {
    targetUser = tenantStore.getUsers(targetTenant)[0] || tenantStore.getUserById('usr_oxf_owner');
  }

  const tenant = tenantStore.getOrganizationById(targetTenant);

  res.json({
    success: true,
    user: targetUser,
    tenant: tenant || null,
    activeRole: targetUser?.role,
  });
});

// Register a new organization / Academy tenant
authRouter.post('/register-tenant', (req: AuthenticatedRequest, res: Response) => {
  const { academyName, academyNameAr, adminEmail, adminName, plan, country, phone } = req.body;

  if (!academyName || !adminEmail || !adminName) {
    return res.status(400).json({ error: 'Academy name, admin email, and admin name are required' });
  }

  // Create organization
  const newOrg = tenantStore.createOrganization({
    name: academyName,
    nameAr: academyNameAr,
    plan: plan || 'starter',
    contactEmail: adminEmail,
    country: country || 'Saudi Arabia',
    phone: phone || '',
  });

  // Create initial Organization Owner user
  const owner = tenantStore.createUser({
    organizationId: newOrg.id,
    email: adminEmail,
    fullName: adminName,
    role: 'ORGANIZATION_OWNER',
    phone,
  });

  tenantStore.addAuditLog({
    organizationId: newOrg.id,
    userId: owner.id,
    userEmail: owner.email,
    userRole: 'ORGANIZATION_OWNER',
    action: 'TENANT_REGISTERED',
    resource: 'Organization',
    details: `Tenant ${newOrg.name} provisioned with plan ${newOrg.plan}`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({
    success: true,
    organization: newOrg,
    owner,
    message: 'Academy organization provisioned successfully with isolated database partition.',
  });
});

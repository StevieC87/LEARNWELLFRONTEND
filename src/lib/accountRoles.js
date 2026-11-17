// Account roles, the same ladder as the backend's
// Sections/Users/UserControllers/userFields.js. The backend decides; these only
// keep the Users pages from offering what it would refuse.

export const ROLE_LABELS = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  author: 'Author',
  contributor: 'Contributor',
  registered: 'Registered',
};

const ROLE_RANK = { registered: 0, contributor: 1, author: 2, editor: 3, admin: 4, superadmin: 5 };
export const ROLES = Object.keys(ROLE_RANK);
export const STAFF_ROLES = ['admin', 'superadmin'];
const rankOf = (role) => (Object.hasOwn(ROLE_RANK, role) ? ROLE_RANK[role] : 0);
const isCustomer = (role) => rankOf(role) === 0;

// Below your own; a superadmin may also make another superadmin.
export const mayGrant = (actorRole, newRole) =>
  ROLES.includes(newRole) && (rankOf(newRole) < rankOf(actorRole) || (actorRole === 'superadmin' && newRole === 'superadmin'));

// The roles `actorRole` may hand out, highest first.
export const grantableRoles = (actorRole) => ROLES.filter((role) => mayGrant(actorRole, role)).reverse();

// Edit or delete: lower ranks only, and customers only for a superadmin.
export const mayManage = (actorRole, targetRole) =>
  rankOf(actorRole) > rankOf(targetRole) && (!isCustomer(targetRole) || actorRole === 'superadmin');

/* ============================================
   LOST IN THE CLOUD — IAM Identity & Access Service
   ============================================ */

export class IAMService {
  constructor(users = {}, roles = {}, policies = {}) {
    this.users = users;
    this.roles = roles;
    this.policies = policies;
  }

  listUsers() {
    return Object.values(this.users);
  }

  getUser(name) {
    return this.users[name] || null;
  }

  listPolicies() {
    return Object.values(this.policies);
  }

  // Permission evaluation engine
  canPerform(userName, action, resourceArn = '*') {
    const user = this.getUser(userName);
    if (!user) return { allowed: false, reason: `User ${userName} does not exist.` };

    // Check attached policies
    for (const policyName of user.attachedPolicies) {
      const policy = this.policies[policyName];
      if (policy) {
        if (policy.statements.some(s => s.effect === 'Allow' && (s.action.includes('*') || s.action.includes(action)))) {
          return { allowed: true, matchingPolicy: policyName };
        }
      }
    }

    return {
      allowed: false,
      reason: `User ${userName} lacks required permission: ${action} on ${resourceArn}`,
    };
  }

  attachPolicy(userName, policyName) {
    const user = this.getUser(userName);
    if (!user) return { success: false, error: `User ${userName} not found.` };
    if (!this.policies[policyName]) return { success: false, error: `Policy ${policyName} does not exist.` };

    if (!user.attachedPolicies.includes(policyName)) {
      user.attachedPolicies.push(policyName);
    }
    return { success: true, message: `Attached policy ${policyName} to user ${userName}.`, user };
  }

  revokePolicy(userName, policyName) {
    const user = this.getUser(userName);
    if (!user) return { success: false, error: `User ${userName} not found.` };

    const initialLen = user.attachedPolicies.length;
    user.attachedPolicies = user.attachedPolicies.filter(p => p !== policyName);

    if (user.attachedPolicies.length === initialLen) {
      return { success: false, error: `User ${userName} did not have policy ${policyName} attached.` };
    }

    return { success: true, message: `Revoked policy ${policyName} from user ${userName}.`, user };
  }

  rotateAccessKeys(userName) {
    const user = this.getUser(userName);
    if (!user) return { success: false, error: `User ${userName} not found.` };

    const newKeyId = `AKIA${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    user.accessKeyId = newKeyId;
    user.lastRotated = new Date().toISOString();

    return { success: true, message: `Rotated access keys for ${userName}. New Key ID: ${newKeyId}`, user };
  }
}

export default IAMService;

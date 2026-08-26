/* ============================================
   LOST IN THE CLOUD — Security Group Service
   ============================================ */

export class SecurityGroupService {
  constructor(securityGroups = {}) {
    this.securityGroups = securityGroups;
  }

  list() {
    return Object.values(this.securityGroups);
  }

  get(id) {
    return this.securityGroups[id] || null;
  }

  authorizeIngress(sgId, rule) {
    const sg = this.get(sgId);
    if (!sg) return { success: false, error: `Security Group ${sgId} not found.` };

    sg.inboundRules.push(rule);
    return { success: true, message: `Added rule to ${sgId}: Port ${rule.port} (${rule.protocol}) from ${rule.source}.`, securityGroup: sg };
  }

  revokeIngress(sgId, port, source = '0.0.0.0/0') {
    const sg = this.get(sgId);
    if (!sg) return { success: false, error: `Security Group ${sgId} not found.` };

    const initialLen = sg.inboundRules.length;
    sg.inboundRules = sg.inboundRules.filter(r => !(r.port === +port && (r.source === source || source === '*')));

    if (sg.inboundRules.length === initialLen) {
      return { success: false, error: `No rule matching port ${port} from ${source} found in ${sgId}.` };
    }

    return { success: true, message: `Revoked inbound rule: Port ${port} from ${source} on ${sgId}.`, securityGroup: sg };
  }

  auditRisks(sgId) {
    const sg = this.get(sgId);
    if (!sg) return [];

    const risks = [];
    sg.inboundRules.forEach(rule => {
      if (rule.source === '0.0.0.0/0') {
        if (rule.port === 22) {
          risks.push({ severity: 'CRITICAL', rule, message: 'SSH (Port 22) open to the entire internet (0.0.0.0/0).' });
        } else if (rule.port === 5432 || rule.port === 3306) {
          risks.push({ severity: 'HIGH', rule, message: `Database port (${rule.port}) open to the entire internet.` });
        }
      }
    });

    return risks;
  }
}

export default SecurityGroupService;

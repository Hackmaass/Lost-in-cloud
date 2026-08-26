/* ============================================
   LOST IN THE CLOUD — Cloud Provider Interface
   ============================================
   Abstract interface for cloud infrastructure backends.
   Decouples gameplay logic from implementation, allowing
   either the local CloudSimulator or a future real AWS provider.
   ============================================ */

export class CloudProvider {
  constructor(name = 'AbstractCloudProvider') {
    this.name = name;
  }

  // ---- Lifecycle & Configuration ----
  async initialize(config = {}) {
    throw new Error('initialize() must be implemented by CloudProvider subclass');
  }

  async reset(state = {}) {
    throw new Error('reset() must be implemented by CloudProvider subclass');
  }

  // ---- Resource Querying ----
  async listResources(serviceType = null, region = null) {
    throw new Error('listResources() must be implemented by CloudProvider subclass');
  }

  async getResource(resourceId) {
    throw new Error('getResource() must be implemented by CloudProvider subclass');
  }

  // ---- Actions & Mutations ----
  async executeAction(actionType, params = {}, identity = 'default') {
    throw new Error('executeAction() must be implemented by CloudProvider subclass');
  }

  // ---- Observability & Health ----
  async getSystemHealth() {
    throw new Error('getSystemHealth() must be implemented by CloudProvider subclass');
  }

  async getMetrics(metricName, resourceId = null, timeRange = '1h') {
    throw new Error('getMetrics() must be implemented by CloudProvider subclass');
  }

  async getLogs(filter = {}, limit = 50) {
    throw new Error('getLogs() must be implemented by CloudProvider subclass');
  }

  // ---- Cost & Governance ----
  async getEstimatedMonthlyCost() {
    throw new Error('getEstimatedMonthlyCost() must be implemented by CloudProvider subclass');
  }

  async getSecurityEvaluation() {
    throw new Error('getSecurityEvaluation() must be implemented by CloudProvider subclass');
  }
}

export default CloudProvider;

/* ============================================
   LOST IN THE CLOUD — CloudWatch Observability Service
   ============================================ */

export class CloudWatchService {
  constructor(metrics = {}, logs = []) {
    this.metrics = metrics;
    this.logs = logs;
  }

  log(event) {
    this.logs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ...event,
    });
    if (this.logs.length > 100) this.logs.pop();
  }

  getLogs(filter = {}, limit = 30) {
    let result = [...this.logs];
    if (filter.level) {
      result = result.filter(l => l.level === filter.level);
    }
    if (filter.source) {
      result = result.filter(l => l.source === filter.source);
    }
    return result.slice(0, limit);
  }

  getMetrics(resourceId = null) {
    if (resourceId) {
      return this.metrics[resourceId] || null;
    }
    return this.metrics;
  }

  setMetric(resourceId, metricName, value) {
    if (!this.metrics[resourceId]) {
      this.metrics[resourceId] = {};
    }
    this.metrics[resourceId][metricName] = value;
  }
}

export default CloudWatchService;

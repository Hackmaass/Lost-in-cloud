/* ============================================
   LOST IN THE CLOUD — Load Balancer Service (ALB)
   ============================================ */

export class LoadBalancerService {
  constructor(loadBalancers = {}) {
    this.loadBalancers = loadBalancers;
  }

  list() {
    return Object.values(this.loadBalancers);
  }

  get(id) {
    return this.loadBalancers[id] || null;
  }

  addTarget(albId, instanceId) {
    const alb = this.get(albId);
    if (!alb) return { success: false, error: `Load Balancer ${albId} not found.` };

    if (!alb.targets.includes(instanceId)) {
      alb.targets.push(instanceId);
    }
    return { success: true, message: `Registered instance ${instanceId} with ${albId}.`, loadBalancer: alb };
  }

  removeTarget(albId, instanceId) {
    const alb = this.get(albId);
    if (!alb) return { success: false, error: `Load Balancer ${albId} not found.` };

    alb.targets = alb.targets.filter(t => t !== instanceId);
    return { success: true, message: `Deregistered instance ${instanceId} from ${albId}.`, loadBalancer: alb };
  }

  evaluateHealth(albId, ec2Service) {
    const alb = this.get(albId);
    if (!alb) return { healthyCount: 0, unhealthyCount: 0, status: 'unknown' };

    let healthy = 0;
    let unhealthy = 0;

    alb.targets.forEach(targetId => {
      const instance = ec2Service.get(targetId);
      if (instance && instance.status === 'running' && instance.health === 'healthy') {
        healthy++;
      } else {
        unhealthy++;
      }
    });

    alb.healthyTargets = healthy;
    alb.unhealthyTargets = unhealthy;
    alb.healthStatus = healthy === 0 ? 'critical' : unhealthy > 0 ? 'degraded' : 'healthy';

    return { healthyCount: healthy, unhealthyCount: unhealthy, status: alb.healthStatus };
  }
}

export default LoadBalancerService;

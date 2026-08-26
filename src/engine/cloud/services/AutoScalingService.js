/* ============================================
   LOST IN THE CLOUD — Auto Scaling Service (ASG)
   ============================================ */

export class AutoScalingService {
  constructor(groups = {}) {
    this.groups = groups;
  }

  list() {
    return Object.values(this.groups);
  }

  get(id) {
    return this.groups[id] || null;
  }

  setCapacity(asgId, { min, max, desired }) {
    const asg = this.get(asgId);
    if (!asg) return { success: false, error: `Auto Scaling Group ${asgId} not found.` };

    if (min !== undefined) asg.minSize = Math.max(1, +min);
    if (max !== undefined) asg.maxSize = Math.max(asg.minSize, +max);
    if (desired !== undefined) asg.desiredCapacity = Math.min(asg.maxSize, Math.max(asg.minSize, +desired));

    return {
      success: true,
      message: `Updated ${asgId} capacity: Min=${asg.minSize}, Max=${asg.maxSize}, Desired=${asg.desiredCapacity}`,
      group: asg,
    };
  }

  triggerScaleEvent(asgId, ec2Service, albService) {
    const asg = this.get(asgId);
    if (!asg) return;

    // Check if scaling out is needed
    if (asg.currentInstances.length < asg.desiredCapacity) {
      const newIdx = asg.currentInstances.length + 1;
      const newId = `i-asg-web-0${newIdx}`;
      const newInstance = ec2Service.create({
        id: newId,
        name: `nexora-web-scale-${newIdx}`,
        type: asg.instanceType || 't3.small',
        region: asg.region || 'us-east-1',
        status: 'running',
        health: 'healthy',
        subnetId: asg.subnetId || 'subnet-pub-01',
        securityGroups: ['sg-0nexora-web-prod'],
      });

      asg.currentInstances.push(newId);
      if (asg.targetLoadBalancer && albService) {
        albService.addTarget(asg.targetLoadBalancer, newId);
      }
    }
  }
}

export default AutoScalingService;

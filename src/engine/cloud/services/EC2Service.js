/* ============================================
   LOST IN THE CLOUD — EC2 Compute Service
   ============================================ */

export class EC2Service {
  constructor(instances = {}) {
    this.instances = instances;
  }

  list(filterRegion = null) {
    const list = Object.values(this.instances);
    if (filterRegion) {
      return list.filter(i => i.region === filterRegion);
    }
    return list;
  }

  get(id) {
    return this.instances[id] || null;
  }

  start(id) {
    const instance = this.get(id);
    if (!instance) return { success: false, error: `Instance ${id} not found.` };
    if (instance.status === 'running') return { success: true, message: `Instance ${id} is already running.` };

    instance.status = 'running';
    instance.health = 'healthy';
    instance.metrics.cpu = 15;
    instance.metrics.memory = 32;
    instance.updatedAt = new Date().toISOString();
    return { success: true, message: `Started instance ${id} (${instance.name}). Status: RUNNING.`, instance };
  }

  stop(id) {
    const instance = this.get(id);
    if (!instance) return { success: false, error: `Instance ${id} not found.` };
    if (instance.status === 'stopped') return { success: true, message: `Instance ${id} is already stopped.` };

    instance.status = 'stopped';
    instance.health = 'unhealthy';
    instance.metrics.cpu = 0;
    instance.metrics.memory = 0;
    instance.updatedAt = new Date().toISOString();
    return { success: true, message: `Stopped instance ${id} (${instance.name}). Status: STOPPED.`, instance };
  }

  reboot(id) {
    const instance = this.get(id);
    if (!instance) return { success: false, error: `Instance ${id} not found.` };

    instance.status = 'running';
    instance.health = 'healthy';
    instance.metrics.cpu = 20;
    instance.updatedAt = new Date().toISOString();
    return { success: true, message: `Rebooted instance ${id} (${instance.name}). Status: RUNNING.`, instance };
  }

  updateMetrics(id, metrics) {
    const instance = this.get(id);
    if (instance) {
      instance.metrics = { ...instance.metrics, ...metrics };
    }
  }

  create(instanceData) {
    this.instances[instanceData.id] = {
      status: 'running',
      health: 'healthy',
      metrics: { cpu: 10, memory: 25, networkIn: 120, networkOut: 340 },
      createdAt: new Date().toISOString(),
      ...instanceData,
    };
    return this.instances[instanceData.id];
  }
}

export default EC2Service;

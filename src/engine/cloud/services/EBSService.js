/* ============================================
   LOST IN THE CLOUD — EBS Storage Service
   ============================================ */

export class EBSService {
  constructor(volumes = {}) {
    this.volumes = volumes;
  }

  list() {
    return Object.values(this.volumes);
  }

  get(id) {
    return this.volumes[id] || null;
  }

  getByInstance(instanceId) {
    return Object.values(this.volumes).filter(v => v.attachedInstance === instanceId);
  }

  resize(id, newSizeGB) {
    const vol = this.get(id);
    if (!vol) return { success: false, error: `Volume ${id} not found.` };
    if (newSizeGB <= vol.sizeGB) return { success: false, error: `New size must be greater than current size (${vol.sizeGB} GB).` };

    vol.sizeGB = newSizeGB;
    vol.availableGB = newSizeGB - vol.usedGB;
    vol.usagePercent = Math.round((vol.usedGB / newSizeGB) * 100);
    return { success: true, message: `Volume ${id} expanded to ${newSizeGB} GB. Free: ${vol.availableGB.toFixed(1)} GB.`, volume: vol };
  }

  freeSpace(id, amountGB) {
    const vol = this.get(id);
    if (!vol) return { success: false, error: `Volume ${id} not found.` };

    vol.usedGB = Math.max(1.0, vol.usedGB - amountGB);
    vol.availableGB = vol.sizeGB - vol.usedGB;
    vol.usagePercent = Math.round((vol.usedGB / vol.sizeGB) * 100);
    return { success: true, message: `Freed ${amountGB} GB on volume ${id}. Current usage: ${vol.usagePercent}%.`, volume: vol };
  }
}

export default EBSService;

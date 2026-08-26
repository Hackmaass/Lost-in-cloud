/* ============================================
   LOST IN THE CLOUD — VPC Networking Service
   ============================================ */

export class VPCService {
  constructor(vpcs = {}, subnets = {}, routeTables = {}, igws = {}) {
    this.vpcs = vpcs;
    this.subnets = subnets;
    this.routeTables = routeTables;
    this.igws = igws;
  }

  listVPCs() {
    return Object.values(this.vpcs);
  }

  getVPC(id) {
    return this.vpcs[id] || null;
  }

  listSubnets(vpcId = null) {
    const list = Object.values(this.subnets);
    if (vpcId) return list.filter(s => s.vpcId === vpcId);
    return list;
  }

  getSubnet(id) {
    return this.subnets[id] || null;
  }
}

export default VPCService;

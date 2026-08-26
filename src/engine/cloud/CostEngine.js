/* ============================================
   LOST IN THE CLOUD — Cloud Cost Estimation Engine
   ============================================ */

export class CostEngine {
  static INSTANCE_HOURLY_RATES = {
    't3.nano': 0.0052,
    't3.micro': 0.0104,
    't3.small': 0.0208,
    't3.medium': 0.0416,
    'c5.large': 0.085,
    'c5.2xlarge': 0.34,
    'm5.4xlarge': 0.768,
  };

  static calculateMonthlyCost(infraState) {
    const hoursInMonth = 730;

    // 1. EC2 Compute
    let computeMonthly = 0;
    const instances = Object.values(infraState.ec2?.instances || {});
    instances.forEach(inst => {
      if (inst.status === 'running') {
        const rate = CostEngine.INSTANCE_HOURLY_RATES[inst.type] || 0.0416;
        computeMonthly += rate * hoursInMonth;
      }
    });

    // 2. EBS Storage
    let storageMonthly = 0;
    const volumes = Object.values(infraState.ebs?.volumes || {});
    volumes.forEach(vol => {
      storageMonthly += (vol.sizeGB || 20) * 0.08; // $0.08 per GB-month gp3
    });

    // 3. S3 Storage
    const buckets = Object.values(infraState.s3?.buckets || {});
    buckets.forEach(b => {
      storageMonthly += (b.sizeGB || 0) * 0.023; // $0.023 per GB-month S3 standard
    });

    // 4. RDS Database
    let databaseMonthly = 0;
    const databases = Object.values(infraState.rds?.databases || {});
    databases.forEach(db => {
      databaseMonthly += 118.0; // Base postgres t3.medium db instance
      databaseMonthly += (db.storageGB || 100) * 0.115;
    });

    // 5. Load Balancer
    let networkMonthly = 0;
    const albs = Object.values(infraState.alb?.loadBalancers || {});
    albs.forEach(() => {
      networkMonthly += 22.5; // Base ALB hourly + LCU
    });

    const total = Math.round(computeMonthly + storageMonthly + databaseMonthly + networkMonthly);

    return {
      totalMonthly: total,
      breakdown: {
        compute: Math.round(computeMonthly),
        storage: Math.round(storageMonthly),
        database: Math.round(databaseMonthly),
        networking: Math.round(networkMonthly),
      },
    };
  }
}

export default CostEngine;

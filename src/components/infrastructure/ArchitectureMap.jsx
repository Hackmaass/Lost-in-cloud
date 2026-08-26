/* ============================================
   LOST IN THE CLOUD — Interactive Architecture Map
   ============================================ */

import React, { useState, useEffect } from 'react';
import simulator from '../../engine/cloud/CloudSimulator';
import ResourceInspector from './ResourceInspector';
import './ArchitectureMap.css';

export default function ArchitectureMap() {
  const [snapshot, setSnapshot] = useState(() => simulator.getStateSnapshot());
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(snapshot.region || 'us-east-1');

  useEffect(() => {
    return simulator.subscribe(updated => {
      setSnapshot(updated);
      // Update selected resource if currently inspected
      if (selectedResource) {
        // Find updated resource
        const findUpdated = [
          ...updated.instances,
          ...updated.volumes,
          ...updated.buckets,
          ...updated.databases,
          ...updated.loadBalancers,
          ...updated.securityGroups,
        ].find(r => (r.id || r.name) === (selectedResource.id || selectedResource.name));

        if (findUpdated) setSelectedResource(findUpdated);
      }
    });
  }, [selectedResource]);

  const webInst1 = snapshot.instances.find(i => i.id === 'i-0a7f3c9d');
  const webInst2 = snapshot.instances.find(i => i.id === 'i-0e8b2a1c');
  const alb = snapshot.loadBalancers[0];
  const db = snapshot.databases[0];
  const bucket = snapshot.buckets[0];
  const webSG = snapshot.securityGroups.find(s => s.id === 'sg-0nexora-web-prod');
  const vol = snapshot.volumes[0];

  const handleNodeClick = (res, type) => {
    setSelectedResource({ ...res, resourceType: type });
  };

  return (
    <div className="arch-map">
      {/* Top Controls */}
      <div className="arch-map__toolbar">
        <div className="arch-map__title-group">
          <span className="arch-map__icon">◈</span>
          <span className="arch-map__title">NEXORA CLOUD TOPOLOGY MAP</span>
          <span className={`arch-map__health-badge status-${snapshot.health.overall}`}>
            ● {snapshot.health.overall.toUpperCase()}
          </span>
        </div>

        <div className="arch-map__region-selector">
          <span className="arch-map__region-label">REGION:</span>
          {['us-east-1', 'ap-south-1', 'eu-west-1'].map(r => (
            <button
              key={r}
              className={`arch-map__region-btn ${selectedRegion === r ? 'arch-map__region-btn--active' : ''}`}
              onClick={() => setSelectedRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Architecture Canvas */}
      <div className="arch-map__canvas">
        {/* Tier 1: Internet & Ingress */}
        <div className="arch-map__row">
          <div className="arch-node arch-node--cloud">
            <div className="arch-node__header">
              <span className="arch-node__icon">🌐</span>
              <span className="arch-node__name">PUBLIC INTERNET</span>
            </div>
            <div className="arch-node__sub">Global Users & Traffic</div>
          </div>
        </div>

        <div className="arch-line arch-line--vertical" />

        {/* Tier 2: Internet Gateway */}
        <div className="arch-map__row">
          <div className="arch-node arch-node--gateway" onClick={() => handleNodeClick({ id: 'igw-0a1b2c3d', name: 'nexora-prod-igw', region: selectedRegion }, 'IGW')}>
            <div className="arch-node__header">
              <span className="arch-node__icon">🚪</span>
              <span className="arch-node__name">INTERNET GATEWAY</span>
              <span className="arch-node__status status-online">●</span>
            </div>
            <div className="arch-node__sub">igw-0a1b2c3d</div>
          </div>
        </div>

        <div className="arch-line arch-line--vertical" />

        {/* VPC Container */}
        <div className="arch-vpc-box">
          <div className="arch-vpc-box__header">
            <span className="arch-vpc-box__tag">VPC: nexora-prod-vpc (10.0.0.0/16)</span>
            <span className="arch-vpc-box__region">{selectedRegion}</span>
          </div>

          {/* Public Subnet */}
          <div className="arch-subnet-box arch-subnet-box--public">
            <div className="arch-subnet-box__title">
              <span>PUBLIC SUBNET (10.0.1.0/24)</span>
              {webSG && (
                <button
                  className={`arch-sg-pill ${webSG.inboundRules.some(r => r.port === 22 && r.source === '0.0.0.0/0') ? 'arch-sg-pill--alert' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handleNodeClick(webSG, 'SecurityGroup'); }}
                >
                  🛡 {webSG.name}
                </button>
              )}
            </div>

            {/* Load Balancer */}
            {alb && (
              <div className="arch-node arch-node--alb" onClick={() => handleNodeClick(alb, 'ALB')}>
                <div className="arch-node__header">
                  <span className="arch-node__icon">⚖</span>
                  <span className="arch-node__name">{alb.name}</span>
                  <span className={`arch-node__status status-${alb.healthStatus || 'online'}`}>●</span>
                </div>
                <div className="arch-node__sub">ALB • {alb.healthyTargets || 2} Healthy Targets</div>
              </div>
            )}

            <div className="arch-line arch-line--vertical-short" />

            {/* EC2 Web Cluster */}
            <div className="arch-compute-grid">
              {webInst1 && (
                <div
                  className={`arch-node arch-node--ec2 ${webInst1.status === 'stopped' ? 'arch-node--stopped' : ''}`}
                  onClick={() => handleNodeClick(webInst1, 'EC2')}
                >
                  <div className="arch-node__header">
                    <span className="arch-node__icon">💻</span>
                    <span className="arch-node__name">{webInst1.name}</span>
                    <span className={`arch-node__status status-${webInst1.status === 'running' ? 'online' : 'offline'}`}>●</span>
                  </div>
                  <div className="arch-node__sub">{webInst1.id} • {webInst1.type}</div>
                  <div className="arch-node__metric">
                    CPU: {webInst1.metrics?.cpu || 0}% • {webInst1.status.toUpperCase()}
                  </div>
                </div>
              )}

              {webInst2 && (
                <div
                  className={`arch-node arch-node--ec2 ${webInst2.status === 'stopped' ? 'arch-node--stopped' : ''}`}
                  onClick={() => handleNodeClick(webInst2, 'EC2')}
                >
                  <div className="arch-node__header">
                    <span className="arch-node__icon">💻</span>
                    <span className="arch-node__name">{webInst2.name}</span>
                    <span className={`arch-node__status status-${webInst2.status === 'running' ? 'online' : 'offline'}`}>●</span>
                  </div>
                  <div className="arch-node__sub">{webInst2.id} • {webInst2.type}</div>
                  <div className="arch-node__metric">
                    CPU: {webInst2.metrics?.cpu || 0}% • {webInst2.status.toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="arch-line arch-line--vertical" />

          {/* Private Subnet (Database & Storage) */}
          <div className="arch-subnet-box arch-subnet-box--private">
            <div className="arch-subnet-box__title">
              <span>PRIVATE SUBNET (10.0.2.0/24)</span>
              <span className="arch-subnet-tag">Isolated Backend Tier</span>
            </div>

            <div className="arch-storage-grid">
              {/* RDS Database */}
              {db && (
                <div
                  className={`arch-node arch-node--rds ${db.health === 'degraded' ? 'arch-node--degraded' : ''}`}
                  onClick={() => handleNodeClick(db, 'RDS')}
                >
                  <div className="arch-node__header">
                    <span className="arch-node__icon">🗄</span>
                    <span className="arch-node__name">{db.name}</span>
                    <span className={`arch-node__status status-${db.health === 'healthy' ? 'online' : 'degraded'}`}>●</span>
                  </div>
                  <div className="arch-node__sub">{db.engine} • {db.instanceClass}</div>
                  <div className="arch-node__metric">
                    Conns: {db.metrics?.connections || 85} • Latency: {db.metrics?.latencyMs || 18}ms
                  </div>
                </div>
              )}

              {/* S3 Storage */}
              {bucket && (
                <div className="arch-node arch-node--s3" onClick={() => handleNodeClick(bucket, 'S3')}>
                  <div className="arch-node__header">
                    <span className="arch-node__icon">🪣</span>
                    <span className="arch-node__name">{bucket.name}</span>
                    <span className="arch-node__status status-online">●</span>
                  </div>
                  <div className="arch-node__sub">S3 Standard Object Storage</div>
                  <div className="arch-node__metric">
                    Size: {bucket.sizeGB} GB • {bucket.objectsCount} Objects
                  </div>
                </div>
              )}

              {/* EBS Volume */}
              {vol && (
                <div
                  className={`arch-node arch-node--ebs ${vol.usagePercent >= 90 ? 'arch-node--critical' : ''}`}
                  onClick={() => handleNodeClick(vol, 'EBS')}
                >
                  <div className="arch-node__header">
                    <span className="arch-node__icon">💾</span>
                    <span className="arch-node__name">{vol.name}</span>
                    <span className={`arch-node__status status-${vol.usagePercent >= 90 ? 'offline' : 'online'}`}>●</span>
                  </div>
                  <div className="arch-node__sub">EBS Root Volume ({vol.type})</div>
                  <div className="arch-node__metric">
                    Disk: {vol.usagePercent}% used ({vol.usedGB} / {vol.sizeGB} GB)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Resource Inspector Drawer */}
      {selectedResource && (
        <ResourceInspector
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
}

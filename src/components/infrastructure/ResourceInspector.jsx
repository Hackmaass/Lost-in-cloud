/* ============================================
   LOST IN THE CLOUD — Resource Inspector Drawer
   ============================================ */

import React, { useState } from 'react';
import simulator from '../../engine/cloud/CloudSimulator';
import './ResourceInspector.css';

export default function ResourceInspector({ resource, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [actionFeedback, setActionFeedback] = useState(null);

  if (!resource) return null;

  const handleAction = (cmd) => {
    const res = simulator.execute(cmd, 'inspector-ui');
    if (res.success) {
      setActionFeedback({ type: 'success', message: res.message || 'Action executed successfully.' });
    } else {
      setActionFeedback({ type: 'error', message: res.error || 'Action failed.' });
    }
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const isEC2 = resource.resourceType === 'EC2' || resource.id?.startsWith('i-');
  const isS3 = resource.resourceType === 'S3' || resource.objectsCount !== undefined;
  const isRDS = resource.resourceType === 'RDS' || resource.engine !== undefined;
  const isSG = resource.resourceType === 'SecurityGroup' || resource.id?.startsWith('sg-');
  const isEBS = resource.resourceType === 'EBS' || resource.id?.startsWith('vol-');
  const isALB = resource.resourceType === 'ALB' || resource.id?.startsWith('alb-');

  return (
    <div className="inspector-overlay" onClick={onClose}>
      <div className="inspector-drawer anim-slide-left" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="inspector-drawer__header">
          <div>
            <div className="inspector-drawer__type-badge">{resource.resourceType || 'RESOURCE'}</div>
            <h2 className="inspector-drawer__title">{resource.name || resource.id}</h2>
            <div className="inspector-drawer__sub">{resource.id || resource.name} • {resource.region || 'us-east-1'}</div>
          </div>
          <button className="inspector-drawer__close" onClick={onClose}>✕</button>
        </div>

        {/* Tab Navigation */}
        <div className="inspector-drawer__tabs">
          <button
            className={`inspector-tab ${activeTab === 'overview' ? 'inspector-tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            OVERVIEW
          </button>
          <button
            className={`inspector-tab ${activeTab === 'metrics' ? 'inspector-tab--active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            METRICS
          </button>
          <button
            className={`inspector-tab ${activeTab === 'actions' ? 'inspector-tab--active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            ACTIONS
          </button>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className={`inspector-feedback feedback--${actionFeedback.type}`}>
            {actionFeedback.message}
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="inspector-content anim-fade-in">
            <div className="inspector-field">
              <span className="inspector-field__label">STATUS</span>
              <span className={`inspector-field__val status-${resource.status || resource.health || 'online'}`}>
                ● {(resource.status || resource.health || 'ONLINE').toUpperCase()}
              </span>
            </div>

            {resource.type && (
              <div className="inspector-field">
                <span className="inspector-field__label">INSTANCE TYPE</span>
                <span className="inspector-field__val">{resource.type}</span>
              </div>
            )}

            {resource.publicIp && (
              <div className="inspector-field">
                <span className="inspector-field__label">PUBLIC IP</span>
                <span className="inspector-field__val">{resource.publicIp}</span>
              </div>
            )}

            {resource.privateIp && (
              <div className="inspector-field">
                <span className="inspector-field__label">PRIVATE IP</span>
                <span className="inspector-field__val">{resource.privateIp}</span>
              </div>
            )}

            {resource.subnetId && (
              <div className="inspector-field">
                <span className="inspector-field__label">SUBNET</span>
                <span className="inspector-field__val">{resource.subnetId}</span>
              </div>
            )}

            {/* Inbound Rules for Security Groups */}
            {isSG && resource.inboundRules && (
              <div className="inspector-section">
                <div className="inspector-section__title">INBOUND FIREWALL RULES</div>
                <div className="inspector-rules-list">
                  {resource.inboundRules.map((rule, idx) => (
                    <div key={idx} className={`inspector-rule ${rule.port === 22 && rule.source === '0.0.0.0/0' ? 'inspector-rule--alert' : ''}`}>
                      <div className="inspector-rule__header">
                        <span>PORT {rule.port} ({rule.protocol})</span>
                        <span className="inspector-rule__source">{rule.source}</span>
                      </div>
                      <div className="inspector-rule__desc">{rule.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attached Policies for IAM */}
            {resource.attachedPolicies && (
              <div className="inspector-section">
                <div className="inspector-section__title">ATTACHED IAM POLICIES</div>
                <div className="inspector-policy-list">
                  {resource.attachedPolicies.map((p, idx) => (
                    <div key={idx} className={`inspector-policy ${p === 'AdministratorAccess' ? 'inspector-policy--admin' : ''}`}>
                      <span>🛡 {p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Metrics */}
        {activeTab === 'metrics' && (
          <div className="inspector-content anim-fade-in">
            {resource.metrics ? (
              <div className="inspector-metrics-grid">
                {Object.entries(resource.metrics).map(([key, val]) => (
                  <div key={key} className="inspector-metric-card">
                    <div className="inspector-metric-card__label">{key.toUpperCase()}</div>
                    <div className="inspector-metric-card__val">
                      {val}{typeof val === 'number' && key.toLowerCase().includes('cpu') ? '%' : ''}
                    </div>
                    {typeof val === 'number' && (
                      <div className="inspector-metric-bar">
                        <div className="inspector-metric-bar__fill" style={{ width: `${Math.min(100, val)}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : resource.usagePercent !== undefined ? (
              <div className="inspector-metric-card">
                <div className="inspector-metric-card__label">DISK UTILIZATION</div>
                <div className="inspector-metric-card__val">{resource.usagePercent}%</div>
                <div className="inspector-metric-bar">
                  <div
                    className="inspector-metric-bar__fill"
                    style={{
                      width: `${resource.usagePercent}%`,
                      background: resource.usagePercent > 85 ? 'var(--color-danger)' : 'var(--color-primary)',
                    }}
                  />
                </div>
                <div className="inspector-metric-sub">{resource.usedGB} GB of {resource.sizeGB} GB used</div>
              </div>
            ) : (
              <div className="text-dim">No real-time metric streams attached to this resource.</div>
            )}
          </div>
        )}

        {/* Tab 3: Actions */}
        {activeTab === 'actions' && (
          <div className="inspector-content anim-fade-in">
            <div className="inspector-actions-list">
              {isEC2 && (
                <>
                  <button
                    className="inspector-action-btn"
                    onClick={() => handleAction(`ec2 start ${resource.id}`)}
                    disabled={resource.status === 'running'}
                  >
                    ▶ START INSTANCE
                  </button>
                  <button
                    className="inspector-action-btn"
                    onClick={() => handleAction(`ec2 stop ${resource.id}`)}
                    disabled={resource.status === 'stopped'}
                  >
                    ⏹ STOP INSTANCE
                  </button>
                  <button
                    className="inspector-action-btn"
                    onClick={() => handleAction(`ec2 reboot ${resource.id}`)}
                  >
                    🔄 REBOOT INSTANCE
                  </button>
                </>
              )}

              {isEBS && (
                <button
                  className="inspector-action-btn"
                  onClick={() => handleAction(`s3 sync /var/app/uploads s3://nexora-prod-assets`)}
                >
                  📦 OFFLOAD UPLOADS TO S3 OBJECT STORAGE
                </button>
              )}

              {isSG && (
                <button
                  className="inspector-action-btn inspector-action-btn--danger"
                  onClick={() => handleAction(`sg revoke ${resource.id} 22 0.0.0.0/0`)}
                >
                  🔒 REVOKE UNRESTRICTED SSH (PORT 22)
                </button>
              )}

              {isRDS && (
                <button
                  className="inspector-action-btn inspector-action-btn--danger"
                  onClick={() => handleAction(`rds terminate-external ${resource.id}`)}
                >
                  ⛔ TERMINATE UNAUTHORIZED CONNECTIONS (198.51.100.47)
                </button>
              )}

              {isS3 && (
                <button
                  className="inspector-action-btn"
                  onClick={() => handleAction(`s3 sync /var/app/uploads s3://${resource.name}`)}
                >
                  🔄 SYNC ASSETS FROM WEB TIER
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

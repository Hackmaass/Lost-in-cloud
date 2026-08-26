/* ============================================
   LOST IN THE CLOUD — Cloud Health & Cost Dashboard
   ============================================ */

import React, { useState, useEffect } from 'react';
import simulator from '../../engine/cloud/CloudSimulator';
import './CloudHealthDashboard.css';

export default function CloudHealthDashboard() {
  const [snapshot, setSnapshot] = useState(() => simulator.getStateSnapshot());

  useEffect(() => {
    return simulator.subscribe(updated => setSnapshot(updated));
  }, []);

  const { health, cost, recentLogs } = snapshot;

  return (
    <div className="cloud-dash">
      {/* Top Header */}
      <div className="cloud-dash__header">
        <div>
          <span className="cloud-dash__tag">NEXORA OBSERVABILITY</span>
          <h1 className="cloud-dash__title">CLOUDWATCH MONITORING & COST</h1>
        </div>
        <div className="cloud-dash__region-badge">REGION: {snapshot.region}</div>
      </div>

      <div className="cloud-dash__grid">
        {/* Card 1: Subsystem Health Matrix */}
        <div className="dash-card">
          <div className="dash-card__header">
            <span className="dash-card__title">SUBSYSTEM HEALTH MATRIX</span>
            <span className={`dash-card__badge status-${health.overall}`}>
              ● {health.overall.toUpperCase()}
            </span>
          </div>

          <div className="dash-health-grid">
            {Object.entries(health.subsystems).map(([sub, stat]) => (
              <div key={sub} className="dash-health-item">
                <span className={`dash-health-dot status-${stat}`} />
                <span className="dash-health-label">{sub.toUpperCase()}</span>
                <span className={`dash-health-val status-${stat}`}>{stat.toUpperCase()}</span>
              </div>
            ))}
          </div>

          {health.alerts.length > 0 && (
            <div className="dash-alerts-box">
              <div className="dash-alerts-title">ACTIVE CLOUDWATCH ALARMS ({health.alerts.length})</div>
              {health.alerts.map((alt, idx) => (
                <div key={idx} className={`dash-alert-item alert--${alt.level.toLowerCase()}`}>
                  <span className="dash-alert-level">[{alt.level}]</span> {alt.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Estimated Cloud Cost */}
        <div className="dash-card">
          <div className="dash-card__header">
            <span className="dash-card__title">ESTIMATED MONTHLY CLOUD BILL</span>
            <span className="dash-cost-total">${cost.totalMonthly}/mo</span>
          </div>

          <div className="dash-cost-breakdown">
            <div className="dash-cost-row">
              <span>EC2 Compute Fleets</span>
              <span className="dash-cost-val">${cost.breakdown.compute}</span>
            </div>
            <div className="dash-cost-bar">
              <div className="dash-cost-bar__fill" style={{ width: `${(cost.breakdown.compute / Math.max(1, cost.totalMonthly)) * 100}%` }} />
            </div>

            <div className="dash-cost-row">
              <span>RDS PostgreSQL Cluster</span>
              <span className="dash-cost-val">${cost.breakdown.database}</span>
            </div>
            <div className="dash-cost-bar">
              <div className="dash-cost-bar__fill" style={{ width: `${(cost.breakdown.database / Math.max(1, cost.totalMonthly)) * 100}%` }} />
            </div>

            <div className="dash-cost-row">
              <span>EBS & S3 Storage</span>
              <span className="dash-cost-val">${cost.breakdown.storage}</span>
            </div>
            <div className="dash-cost-bar">
              <div className="dash-cost-bar__fill" style={{ width: `${(cost.breakdown.storage / Math.max(1, cost.totalMonthly)) * 100}%` }} />
            </div>

            <div className="dash-cost-row">
              <span>Elastic Load Balancers</span>
              <span className="dash-cost-val">${cost.breakdown.networking}</span>
            </div>
            <div className="dash-cost-bar">
              <div className="dash-cost-bar__fill" style={{ width: `${(cost.breakdown.networking / Math.max(1, cost.totalMonthly)) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Structured Log Stream */}
      <div className="dash-card dash-card--full">
        <div className="dash-card__header">
          <span className="dash-card__title">CLOUDWATCH STRUCTURED LOG STREAM</span>
          <span className="dash-card__sub">Live AWS API & Application Events</span>
        </div>

        <div className="dash-log-stream">
          {recentLogs.length === 0 ? (
            <div className="text-dim">No recent log events recorded in telemetry window.</div>
          ) : (
            recentLogs.map((log) => (
              <div key={log.id} className="dash-log-line">
                <span className="dash-log-time">{log.timestamp}</span>
                <span className={`dash-log-level level--${log.level.toLowerCase()}`}>{log.level}</span>
                <span className="dash-log-src">[{log.source}]</span>
                <span className="dash-log-msg">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

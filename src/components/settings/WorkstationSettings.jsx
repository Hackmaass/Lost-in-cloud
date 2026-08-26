/* ============================================
   LOST IN THE CLOUD — Workstation Settings & Accessibility
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../state/GameContext';
import AudioManager, { CHANNELS } from '../../engine/AudioManager';
import SaveManager from '../../engine/SaveManager';
import './WorkstationSettings.css';

export default function WorkstationSettings() {
  const { state, deleteSave, dispatch } = useGame();

  const [soundEnabled, setSoundEnabled] = useState(AudioManager.enabled);
  const [masterVol, setMasterVol] = useState(Math.round(AudioManager.masterVolume * 100));
  const [ambientVol, setAmbientVol] = useState(Math.round((AudioManager.volumes[CHANNELS.AMBIENT] || 0.3) * 100));
  const [ambientHumActive, setAmbientHumActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scanlines, setScanlines] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  // Audio adjustments
  const handleSoundToggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    AudioManager.setEnabled(next);
    if (next) AudioManager.play('ui_click');
  };

  const handleMasterVolChange = (e) => {
    const val = Number(e.target.value);
    setMasterVol(val);
    AudioManager.setMasterVolume(val / 100);
  };

  const handleAmbientVolChange = (e) => {
    const val = Number(e.target.value);
    setAmbientVol(val);
    AudioManager.setVolume(CHANNELS.AMBIENT, val / 100);
  };

  const handleToggleAmbientHum = () => {
    if (ambientHumActive) {
      AudioManager.stopServerRoomHum();
      setAmbientHumActive(false);
    } else {
      AudioManager.startServerRoomHum();
      setAmbientHumActive(true);
    }
  };

  const handleTestAudio = () => {
    AudioManager.play('terminal_success');
  };

  // Accessibility
  const handleReducedMotionToggle = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    if (next) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  };

  const handleExportSave = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `nexora-save-${state.name ? state.name.toLowerCase().replace(/\s+/g, '-') : 'engineer'}.json`);
    dlAnchorElem.click();
    AudioManager.play('ui_click');
  };

  const handleImportSave = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedState = JSON.parse(event.target?.result);
        if (loadedState && loadedState.currentAct) {
          dispatch({ type: 'LOAD_STATE', payload: loadedState });
          setImportStatus('✓ Save imported successfully!');
          AudioManager.play('terminal_success');
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          setImportStatus('⚠ Invalid save file structure.');
        }
      } catch (err) {
        setImportStatus('⚠ Failed to parse save file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteSave = () => {
    if (confirmDelete) {
      deleteSave();
      AudioManager.play('terminal_error');
      setTimeout(() => window.location.reload(), 500);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="settings-page anim-fade-in">
      {/* Header */}
      <div className="settings-header">
        <div>
          <span className="settings-tag">WORKSTATION CONFIGURATION</span>
          <h1 className="settings-title">SYSTEM SETTINGS & ACCESSIBILITY</h1>
        </div>
        <div className="settings-badge">TERMINAL NX-OS v2.4.1</div>
      </div>

      <div className="settings-grid">
        {/* Card 1: Web Audio Synthesis */}
        <div className="settings-card">
          <div className="settings-card__header">
            <span className="settings-card__title">🔊 PROCEDURAL AUDIO & SOUND FX</span>
            <button className={`settings-toggle-btn ${soundEnabled ? 'settings-toggle-btn--on' : ''}`} onClick={handleSoundToggle}>
              {soundEnabled ? 'AUDIO: ENABLED' : 'AUDIO: MUTED'}
            </button>
          </div>

          <div className="settings-controls-list">
            <div className="settings-slider-row">
              <label className="settings-slider-label">
                <span>MASTER VOLUME</span>
                <span>{masterVol}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVol}
                onChange={handleMasterVolChange}
                className="settings-slider"
                disabled={!soundEnabled}
              />
            </div>

            <div className="settings-slider-row">
              <label className="settings-slider-label">
                <span>SERVER ROOM AMBIENCE</span>
                <span>{ambientVol}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={ambientVol}
                onChange={handleAmbientVolChange}
                className="settings-slider"
                disabled={!soundEnabled}
              />
            </div>

            <div className="settings-buttons-row">
              <button
                className={`settings-action-btn ${ambientHumActive ? 'settings-action-btn--active' : ''}`}
                onClick={handleToggleAmbientHum}
                disabled={!soundEnabled}
              >
                {ambientHumActive ? '⏹ STOP SERVER HUM' : '▶ START SERVER HUM'}
              </button>

              <button className="settings-action-btn" onClick={handleTestAudio} disabled={!soundEnabled}>
                🔔 TEST CHIME
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Display & Accessibility */}
        <div className="settings-card">
          <div className="settings-card__header">
            <span className="settings-card__title">👁 VISUALS & ACCESSIBILITY</span>
          </div>

          <div className="settings-options-list">
            <div className="settings-option-item">
              <div>
                <div className="settings-option-name">REDUCED MOTION MODE</div>
                <div className="settings-option-desc">Suppresses screen shakes, heavy blurs, and animated background particles.</div>
              </div>
              <button
                className={`settings-toggle-btn ${reducedMotion ? 'settings-toggle-btn--on' : ''}`}
                onClick={handleReducedMotionToggle}
              >
                {reducedMotion ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="settings-option-item">
              <div>
                <div className="settings-option-name">CRT SCANLINE EFFECT</div>
                <div className="settings-option-desc">Toggles retro CRT phosphor scanlines across terminals and dashboards.</div>
              </div>
              <button
                className={`settings-toggle-btn ${scanlines ? 'settings-toggle-btn--on' : ''}`}
                onClick={() => setScanlines(!scanlines)}
              >
                {scanlines ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Career Save & State Manager */}
        <div className="settings-card settings-card--full">
          <div className="settings-card__header">
            <span className="settings-card__title">💾 CAREER DATA & STATE BACKUP</span>
          </div>

          <div className="settings-save-actions">
            <button className="settings-action-btn settings-action-btn--primary" onClick={handleExportSave}>
              📥 EXPORT CAREER SAVE (.JSON)
            </button>

            <label className="settings-action-btn settings-action-btn--file">
              📤 IMPORT CAREER SAVE
              <input type="file" accept=".json" onChange={handleImportSave} style={{ display: 'none' }} />
            </label>

            <button
              className={`settings-action-btn settings-action-btn--danger ${confirmDelete ? 'settings-action-btn--danger-active' : ''}`}
              onClick={handleDeleteSave}
            >
              {confirmDelete ? '⚠️ CONFIRM PURGE ALL DATA' : '🗑 PURGE SAVE DATA'}
            </button>
          </div>

          {importStatus && <div className="settings-import-status">{importStatus}</div>}
        </div>
      </div>
    </div>
  );
}

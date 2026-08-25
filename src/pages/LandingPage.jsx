/* ============================================
   LOST IN THE CLOUD — Landing Page
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useGame } from '../state/GameContext';
import { GAME_PHASES } from '../state/playerReducer';
import GAME_CONFIG from '../data/config';
import SaveManager from '../engine/SaveManager';
import './LandingPage.css';

export default function LandingPage() {
  const { setGamePhase } = useGame();
  const [loaded, setLoaded] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    setHasSave(SaveManager.hasSave());

    // Staggered reveal
    const t1 = setTimeout(() => setLoaded(true), 300);
    const t2 = setTimeout(() => setShowTagline(true), 1200);
    const t3 = setTimeout(() => setShowCTA(true), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleStartCareer = () => {
    setGamePhase(GAME_PHASES.PLAYER_CREATION);
  };

  const handleContinue = () => {
    setGamePhase(GAME_PHASES.GAMEPLAY);
  };

  return (
    <div className="landing">
      {/* Animated Background */}
      <div className="landing__bg">
        <div className="landing__grid">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="landing__node"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        <div className="landing__scanline" />
        <div className="landing__terminal-bg">
          <div className="landing__terminal-scroll">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="landing__log-line">
                <span className="landing__log-time">
                  {String(8 + Math.floor(i / 4)).padStart(2, '0')}:
                  {String(Math.floor(Math.random() * 60)).padStart(2, '0')}:
                  {String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                </span>
                <span className="landing__log-text">
                  {[
                    'sys.healthcheck → OK',
                    'deploy.pipeline → stage:production',
                    'ec2.i-0a7f... → status:running',
                    'rds.nexora-prod → connections:142',
                    'cloudwatch.alarm → CPU < threshold',
                    'elb.distribute → targets:healthy',
                    'vpc.flow → ingress:ALLOW',
                    's3.sync → objects:47,291',
                    'iam.auth → session:valid',
                    'lambda.invoke → duration:23ms',
                    'route53.resolve → nexora.io → 52.14.x.x',
                    'autoscaling → desired:4 running:4',
                    'sqs.queue → messages:0 in-flight:0',
                    'dynamodb.read → capacity:OK',
                    'sns.publish → topic:deploy-notify',
                  ][i % 15]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="landing__vignette" />
      </div>

      {/* Content */}
      <div className="landing__content">
        <div className={`landing__hero ${loaded ? 'landing__hero--visible' : ''}`}>
          {/* Title */}
          <h1 className="landing__title">
            <span className="landing__title-line landing__title-line--top">LOST IN</span>
            <span className="landing__title-line landing__title-line--bottom">THE CLOUD</span>
          </h1>

          {/* Tagline */}
          <p className={`landing__tagline ${showTagline ? 'landing__tagline--visible' : ''}`}>
            {GAME_CONFIG.tagline}
          </p>

          {/* CTAs */}
          <div className={`landing__cta-group ${showCTA ? 'landing__cta-group--visible' : ''}`}>
            <button className="landing__cta landing__cta--primary" onClick={handleStartCareer}>
              <span className="landing__cta-text">START YOUR CAREER</span>
              <span className="landing__cta-glow" />
            </button>

            {hasSave && (
              <button className="landing__cta landing__cta--secondary" onClick={handleContinue}>
                CONTINUE
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`landing__footer ${showCTA ? 'landing__footer--visible' : ''}`}>
          <a href="#about" className="landing__footer-link">ABOUT THE CLOUD CLUB</a>
        </div>
      </div>
    </div>
  );
}

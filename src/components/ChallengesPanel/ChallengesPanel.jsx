/**
 * ChallengesPanel — Community sustainability challenges
 *
 * @component
 * @param {Object} props
 * @param {Array<string>} props.joined - IDs of joined challenges
 * @param {Function} props.onJoin - Callback receiving challenge id
 * @returns {React.ReactElement}
 */

import React from "react";
import PropTypes from "prop-types";
import { CHALLENGES } from "../../data/constants";

function ChallengesPanel({ joined, onJoin }) {
  return (
    <section className="challenges-panel" aria-labelledby="challenges-heading">
      <h2 id="challenges-heading">Community Challenges</h2>
      <div className="challenges-grid">
        {CHALLENGES.map((ch) => {
          const isJoined = joined.includes(ch.id);
          return (
            <div key={ch.id} className={`challenge-card ${isJoined ? "joined" : ""}`}>
              <span className="ch-icon" aria-hidden="true">{ch.icon}</span>
              <h3 className="ch-title">{ch.title}</h3>
              <p className="ch-desc">{ch.description}</p>
              <div className="ch-meta">
                <span>🗓 {ch.duration}</span>
                <span>💚 Saves ~{ch.savingsEstimate} kg</span>
              </div>
              <p className="ch-participants">{ch.participants.toLocaleString("en-IN")} participants</p>
              <button
                className={`btn ${isJoined ? "btn-done" : "btn-green"}`}
                onClick={() => !isJoined && onJoin(ch.id)}
                disabled={isJoined}
                aria-label={isJoined ? `Already joined ${ch.title}` : `Join ${ch.title} challenge`}
              >
                {isJoined ? "✓ Joined!" : "Join Challenge"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

ChallengesPanel.displayName = "ChallengesPanel";
ChallengesPanel.propTypes = {
  joined: PropTypes.arrayOf(PropTypes.string).isRequired,
  onJoin: PropTypes.func.isRequired,
};
export default React.memo(ChallengesPanel);

/**
 * @component AppNav
 * @description Bottom navigation bar for switching between main tabs.
 *              Implements the WAI-ARIA tab pattern.
 *
 * @param {Object} props
 * @param {string} props.currentTab - ID of the currently active tab
 * @param {Function} props.onTabChange - Callback invoked with new tab ID
 * @returns {JSX.Element}
 *
 * @example
 * <AppNav currentTab={tab} onTabChange={setTab} />
 */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { TABS } from '../../data/constants';
import './AppNav.css';

function AppNav({ currentTab, onTabChange }) {
  const handleTabKeyDown = useCallback(
    (e, tabId) => {
      const tabIds = TABS.map((t) => t.id);
      const idx = tabIds.indexOf(tabId);
      let nextTab = null;

      if (e.key === "ArrowRight") nextTab = tabIds[(idx + 1) % tabIds.length];
      if (e.key === "ArrowLeft") nextTab = tabIds[(idx - 1 + tabIds.length) % tabIds.length];
      if (e.key === "Home") nextTab = tabIds[0];
      if (e.key === "End") nextTab = tabIds[tabIds.length - 1];

      if (nextTab) {
        e.preventDefault();
        onTabChange(nextTab);
        document.getElementById(`tab-${nextTab}`)?.focus();
      }
    },
    [onTabChange]
  );

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      <div role="tablist" aria-label="Application sections" style={{ display: "contents" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            className={`nav-btn ${currentTab === t.id ? "active" : ""}`}
            aria-selected={currentTab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={currentTab === t.id ? 0 : -1}
            onClick={() => onTabChange(t.id)}
            onKeyDown={(e) => handleTabKeyDown(e, t.id)}
          >
            <span aria-hidden="true">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

AppNav.displayName = 'AppNav';
AppNav.propTypes = {
  currentTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default React.memo(AppNav);

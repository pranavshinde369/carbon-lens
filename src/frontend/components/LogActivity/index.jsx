import React from 'react';
import PropTypes from 'prop-types';
import ActivityForm from '../ActivityForm';
import ActivityLog from '../ActivityLog';

/**
 * @component LogActivity
 * @description View for logging new activities and viewing history
 *
 * @param {Object} props
 * @param {Array} props.log - List of logged activities
 * @param {Function} props.dispatch - Reducer dispatch function
 *
 * @returns {JSX.Element} The log activity view
 */
function LogActivity({ log, dispatch }) {
  const handleClearLog = () => {
    if (window.confirm("Clear all entries?")) dispatch({ type: "CLEAR" });
  };

  return (
    <div role="tabpanel" id="panel-log" aria-labelledby="tab-log" className="tab-content">
      <section className="section-block" aria-labelledby="log-form-heading">
        <h2 id="log-form-heading">Log an Activity</h2>
        <p className="section-sub">Track daily activities to get precise measurements.</p>
        <ActivityForm onAdd={(payload) => dispatch({ type: 'ADD', payload })} />
      </section>

      <section className="section-block" aria-labelledby="log-table-heading">
        <div className="section-header">
          <h2 id="log-table-heading" tabIndex="-1">Activity History</h2>
          {log.length > 0 && (
            <button className="btn-ghost btn-sm" onClick={handleClearLog} aria-label="Clear all activity log entries">
              Clear all
            </button>
          )}
        </div>
        <ActivityLog log={log} dispatch={dispatch} />
      </section>
    </div>
  );
}

LogActivity.displayName = 'LogActivity';
LogActivity.propTypes = {
  log: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default React.memo(LogActivity);

/**
 * @component ActivityLog
 * @description Displays logged carbon activities in a table.
 *              Renders a reverse-chronological table of activity entries
 *              with category, activity, amount, CO₂e, date, and remove action.
 *
 * @param {Object} props
 * @param {Array<Object>} props.log - Array of activity log entries
 * @param {Function} props.dispatch - Reducer dispatch function
 * @returns {JSX.Element}
 *
 * @example
 * <ActivityLog log={log} dispatch={dispatch} />
 */

import React from "react";
import PropTypes from "prop-types";
import { CATEGORIES, EMISSION_FACTORS } from '../../../backend/data/constants';
import { calcEmission } from '../../../backend/utils';
import { formatCO2 } from '../../../backend/utils';
import "./ActivityLog.css";

function ActivityLog({ log, dispatch }) {
  if (!log.length) {
    return <p className="empty-state">No activities logged yet. Add one above!</p>;
  }

  return (
    <div className="log-table-wrap">
      <table className="log-table" aria-label="Activity log" aria-describedby="log-count">
        <caption id="log-count">
          {log.length} {log.length === 1 ? "activity" : "activities"} logged
        </caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Activity</th>
            <th scope="col">Amount</th>
            <th scope="col">CO₂e</th>
            <th scope="col">Date</th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...log].reverse().map((entry) => {
            const cat = CATEGORIES.find((c) => c.id === entry.category);
            const act = EMISSION_FACTORS[entry.category]?.[entry.activityKey];
            return (
              <tr key={entry.id}>
                <td>
                  <span aria-hidden="true">{cat?.icon} </span>
                  {cat?.label}
                </td>
                <td>{act?.label || entry.activityKey}</td>
                <td>
                  {entry.quantity} {act?.unit}
                </td>
                <td className="emission-cell">
                  {formatCO2(calcEmission(entry.category, entry.activityKey, entry.quantity))}
                </td>
                <td>{new Date(entry.ts).toLocaleDateString("en-IN")}</td>
                <td>
                  <button
                    className="btn-remove"
                    onClick={() => dispatch({ type: 'REMOVE', id: entry.id })}
                    aria-label={`Remove ${act?.label || entry.activityKey} entry`}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

ActivityLog.displayName = "ActivityLog";

ActivityLog.propTypes = {
  log: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      category: PropTypes.string.isRequired,
      activityKey: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      ts: PropTypes.string.isRequired,
    })
  ).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default React.memo(ActivityLog);

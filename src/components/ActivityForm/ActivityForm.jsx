/**
 * ActivityForm — Log a new carbon activity entry
 *
 * Provides a form with category, activity, and quantity selectors.
 * Shows a live emission preview (debounced) and validates input
 * before calling the onAdd callback.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onAdd - Callback receiving { category, activityKey, quantity }
 * @returns {React.ReactElement}
 *
 * @example
 *   <ActivityForm onAdd={(payload) => dispatch({ type: 'ADD', payload })} />
 */

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { CATEGORIES, EMISSION_FACTORS } from "../../data/constants";
import { calcEmission } from "../../utils/carbonCalc";
import { formatCO2 } from "../../utils/formatters";
import { sanitiseNumber } from "../../utils/sanitise";
import { useDebounce } from "../../hooks/useDebounce";

function ActivityForm({ onAdd }) {
  const [category, setCategory] = useState("transport");
  const [activityKey, setActivityKey] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const activities = EMISSION_FACTORS[category] || {};

  /** Debounce quantity for emission preview to avoid excessive recalculation */
  const debouncedQty = useDebounce(quantity, 250);

  /** Memoised emission preview — only recalculates on debounced value change */
  const emissionPreview = useMemo(
    () =>
      activityKey && debouncedQty > 0
        ? calcEmission(category, activityKey, sanitiseNumber(debouncedQty))
        : null,
    [category, activityKey, debouncedQty]
  );

  /**
   * Handle form submission — validates input, sanitises quantity,
   * and calls onAdd with the entry payload.
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    const sanitisedQty = sanitiseNumber(quantity);
    if (!activityKey || !quantity || sanitisedQty <= 0) {
      setError("Please fill in all fields with a valid quantity.");
      return;
    }
    setError("");
    onAdd({ category, activityKey, quantity: sanitisedQty });
    setQuantity("");
    setActivityKey("");
  }

  return (
    <form onSubmit={handleFormSubmit} aria-label="Log a new activity" className="activity-form">
      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend className="sr-only">Log a carbon activity</legend>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cat-select">Category</label>
            <select
              id="cat-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setActivityKey("");
              }}
              aria-required="true"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="act-select">Activity</label>
            <select
              id="act-select"
              value={activityKey}
              onChange={(e) => setActivityKey(e.target.value)}
              aria-required="true"
            >
              <option value="">— Select —</option>
              {Object.entries(activities).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label} ({v.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="qty-input">
              Amount {activityKey && `(${activities[activityKey]?.unit})`}
            </label>
            <input
              id="qty-input"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              autoComplete="off"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? "form-error" : "qty-hint"}
            />
            <span id="qty-hint" className="sr-only">
              Enter quantity in {activityKey ? activities[activityKey]?.unit : "the selected unit"}
            </span>
          </div>

          <button type="submit" className="btn btn-primary">
            + Log
          </button>
        </div>

        {emissionPreview !== null && (
          <p className="emission-preview" aria-live="polite">
            ≈ <strong>{formatCO2(emissionPreview)}</strong>
          </p>
        )}

        {error && (
          <p id="form-error" className="form-error" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
      </fieldset>
    </form>
  );
}

ActivityForm.displayName = "ActivityForm";

ActivityForm.propTypes = {
  /** Callback fired on valid form submission with { category, activityKey, quantity } */
  onAdd: PropTypes.func.isRequired,
};

export default React.memo(ActivityForm);

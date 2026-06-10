/**
 * @component OnboardingQuiz
 * @description A modal quiz that walks users through 6 questions to estimate
 *              their annual carbon footprint. Includes focus trap, Escape key
 *              handling, and full ARIA dialog pattern.
 *
 * @param {Object} props
 * @param {Function} props.onComplete - Callback receiving quiz answers object
 * @returns {JSX.Element}
 *
 * @example
 * <OnboardingQuiz onComplete={answers => dispatch({type: 'COMPLETE_QUIZ', answers})} />
 */

import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { sanitiseNumber } from "../../utils/sanitise";
import "./OnboardingQuiz.css";

/** @constant Quiz step definitions */
const QUIZ_STEPS = [
  {
    key: "commuteMode",
    q: "How do you usually commute?",
    type: "select",
    options: [
      { value: "metro_rail", label: "🚇 Metro / Train" },
      { value: "bus", label: "🚌 Bus" },
      { value: "two_wheeler", label: "🛵 Two-Wheeler" },
      { value: "car_petrol_medium", label: "🚗 Car (Petrol)" },
      { value: "car_electric", label: "⚡ Car (Electric)" },
      { value: "auto_rickshaw", label: "🛺 Auto-Rickshaw" },
    ],
  },
  {
    key: "commuteKm",
    q: "One-way commute distance (km)?",
    type: "number",
    min: 0, max: 100, placeholder: "e.g. 12",
  },
  {
    key: "monthlyUnits",
    q: "Electricity bill (units/kWh per month)?",
    type: "number",
    min: 0, max: 1000, placeholder: "e.g. 120",
  },
  {
    key: "lpgCylinders",
    q: "LPG cylinders per month?",
    type: "number",
    min: 0, max: 5, placeholder: "e.g. 1",
  },
  {
    key: "dietType",
    q: "How would you describe your diet?",
    type: "select",
    options: [
      { value: "vegan", label: "🌱 Vegan" },
      { value: "vegetarian", label: "🥗 Vegetarian" },
      { value: "mixed", label: "🍳 Mixed / Omnivore" },
      { value: "meat_heavy", label: "🥩 Meat-heavy" },
    ],
  },
  {
    key: "shoppingFreq",
    q: "How often do you buy new clothes / gadgets?",
    type: "select",
    options: [
      { value: "minimal", label: "🔄 Rarely / Second-hand" },
      { value: "average", label: "🛍️ Few times a year" },
      { value: "frequent", label: "📦 Every month" },
    ],
  },
];

function OnboardingQuiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const quizRef = useRef(null);

  const current = QUIZ_STEPS[step];

  /** Focus first interactive element when step changes */
  useEffect(() => {
    const focusable = quizRef.current?.querySelectorAll(
      'button, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable?.length) {
      focusable[0].focus();
    }
  }, [step]);

  /** Handle Escape key to close quiz with confirmation */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (window.confirm("Exit quiz? Your progress will be lost.")) {
          onComplete(answers);
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [answers, onComplete]);

  function handleAnswer(val) {
    const updated = {
      ...answers,
      [current.key]: current.type === "number" ? sanitiseNumber(val, current.min, current.max) : val,
    };
    setAnswers(updated);
    if (step < QUIZ_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(updated);
    }
  }

  return (
    <div className="quiz-overlay" role="dialog" aria-modal="true" aria-labelledby="quiz-title" ref={quizRef}>
      <div className="quiz-card">
        <div className="quiz-progress">
          <div className="quiz-bar" style={{ width: `${((step + 1) / QUIZ_STEPS.length) * 100}%` }} />
        </div>
        <p className="quiz-step-label" aria-live="polite">
          Step {step + 1} of {QUIZ_STEPS.length}
        </p>
        <h2 id="quiz-title" className="quiz-q">{current.q}</h2>
        <p id="quiz-description" className="sr-only">
          Answer {QUIZ_STEPS.length} questions to estimate your carbon footprint
        </p>

        {current.type === "select" && (
          <div className="quiz-options" role="listbox" aria-label={current.q}>
            {current.options.map((opt) => (
              <button
                key={opt.value}
                className="quiz-option"
                onClick={() => handleAnswer(opt.value)}
                role="option"
                aria-selected={answers[current.key] === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {current.type === "number" && (
          <div className="quiz-number">
            <label htmlFor="quiz-num-input" className="sr-only">{current.q}</label>
            <input
              id="quiz-num-input"
              type="number"
              min={current.min}
              max={current.max}
              placeholder={current.placeholder}
              autoFocus
              inputMode="decimal"
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value) handleAnswer(e.target.value);
              }}
              aria-label={current.q}
              aria-required="true"
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                const val = document.getElementById("quiz-num-input")?.value;
                if (val) handleAnswer(val);
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

OnboardingQuiz.displayName = "OnboardingQuiz";
OnboardingQuiz.propTypes = {
  onComplete: PropTypes.func.isRequired,
};
export default React.memo(OnboardingQuiz);

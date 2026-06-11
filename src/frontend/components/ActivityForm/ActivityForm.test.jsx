/**
 * Tests for ActivityForm component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ActivityForm from "./index";

describe("ActivityForm", () => {
  test("renders category select", () => {
    render(<ActivityForm onAdd={jest.fn()} />);
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
  });

  test("renders activity select", () => {
    render(<ActivityForm onAdd={jest.fn()} />);
    expect(screen.getByLabelText("Activity")).toBeInTheDocument();
  });

  test("renders amount input", () => {
    render(<ActivityForm onAdd={jest.fn()} />);
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
  });

  test("shows error when submitted with empty activity", async () => {
    render(<ActivityForm onAdd={jest.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /log/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("renders the submit button", () => {
    render(<ActivityForm onAdd={jest.fn()} />);
    expect(screen.getByRole("button", { name: /log/i })).toBeInTheDocument();
  });

  test("form has accessible fieldset legend", () => {
    render(<ActivityForm onAdd={jest.fn()} />);
    expect(screen.getByRole("group", { name: "Log a carbon activity" })).toBeInTheDocument();
  });

  test("submits form successfully and calls onAdd with correct payload", async () => {
    const handleAdd = jest.fn();
    render(<ActivityForm onAdd={handleAdd} />);

    const activitySelect = screen.getByLabelText("Activity");
    await userEvent.selectOptions(activitySelect, "car_petrol_medium");

    const qtyInput = screen.getByLabelText(/amount/i);
    await userEvent.type(qtyInput, "150");

    await userEvent.click(screen.getByRole("button", { name: /log/i }));

    expect(handleAdd).toHaveBeenCalledWith({
      category: "transport",
      activityKey: "car_petrol_medium",
      quantity: 150
    });

    expect(activitySelect.value).toBe("");
    expect(qtyInput.value).toBe("");
  });

  test("changes category and clears activity selection", async () => {
    render(<ActivityForm onAdd={jest.fn()} />);
    const catSelect = screen.getByLabelText("Category");
    const activitySelect = screen.getByLabelText("Activity");

    await userEvent.selectOptions(catSelect, "transport");
    await userEvent.selectOptions(activitySelect, "car_petrol_medium");
    expect(activitySelect.value).toBe("car_petrol_medium");

    await userEvent.selectOptions(catSelect, "energy");
    expect(activitySelect.value).toBe("");
  });

  test("does not show emission preview when activity key is empty", () => {
    render(<ActivityForm onAdd={jest.fn()} />);
    expect(screen.queryByText(/≈/)).not.toBeInTheDocument();
  });

  test("does not show emission preview when quantity is zero or negative", async () => {
    render(<ActivityForm onAdd={jest.fn()} />);
    const activitySelect = screen.getByLabelText("Activity");
    await userEvent.selectOptions(activitySelect, "car_petrol_medium");

    const qtyInput = screen.getByLabelText(/amount/i);
    await userEvent.type(qtyInput, "0");
    expect(screen.queryByText(/≈/)).not.toBeInTheDocument();
  });

  test("handles missing category in EMISSION_FACTORS gracefully", () => {
    const { EMISSION_FACTORS } = require("../../../backend/data/constants");
    const originalTransport = EMISSION_FACTORS.transport;
    delete EMISSION_FACTORS.transport;

    render(<ActivityForm onAdd={jest.fn()} />);
    expect(screen.getByLabelText("Category")).toBeInTheDocument();

    EMISSION_FACTORS.transport = originalTransport;
  });
});

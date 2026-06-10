/**
 * Tests for ActivityForm component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ActivityForm from "./ActivityForm";

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
    const { container } = render(<ActivityForm onAdd={jest.fn()} />);
    const legend = container.querySelector("legend");
    expect(legend).toBeInTheDocument();
  });
});

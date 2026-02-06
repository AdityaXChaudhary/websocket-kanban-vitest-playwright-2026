import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../../App.jsx"; 

test("renders Kanban board title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Kanban Board/i);
  expect(titleElement).toBeDefined();
});

test("renders the tasks", () => {
  render(<App />);
  const taskElement = screen.getByText(/Define Project Scope/i);
  expect(taskElement).toBeDefined();
});
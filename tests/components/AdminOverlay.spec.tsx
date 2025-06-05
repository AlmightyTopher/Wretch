import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import AdminOverlay from "../../src/components/AdminOverlay";
import { useSession } from "next-auth/react";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

const origEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = origEnv;
  vi.resetAllMocks();
});

describe("AdminOverlay environment guard", () => {
  it("renders children only when in production", () => {
    process.env.NODE_ENV = "production";
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    render(
      <AdminOverlay>
        <div>child</div>
      </AdminOverlay>
    );
    expect(screen.getByText("child")).toBeInTheDocument();
    expect(screen.queryByText("Done")).not.toBeInTheDocument();
  });

  it("shows editing UI when not in production", () => {
    process.env.NODE_ENV = "development";
    useSession.mockReturnValue({
      data: { user: { role: "admin" } },
      status: "authenticated",
    });
    render(
      <AdminOverlay>
        <div>child</div>
      </AdminOverlay>
    );
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});

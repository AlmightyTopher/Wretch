import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import AboutAdminPage from "../../src/app/about/admin/page";

const origEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = origEnv;
});

describe("AboutAdminPage guard", () => {
  it("returns null in production", () => {
    process.env.NODE_ENV = "production";
    const { container } = render(<AboutAdminPage />);
    expect(container.firstChild).toBeNull();
  });
});

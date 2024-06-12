// tests/errorHandler.test.mts
import request from "supertest";
import app from "@/app.ts";

describe("Global Error Handler", () => {
  test("should handle errors in routes", async () => {
    const response = await request(app)
      .get("/api/nonexistent") // Route that doesn't exist to trigger a 404 error
      .send();

    expect(response.status).toBe(404);
  });

  test("should handle application errors", async () => {
    const response = await request(app)
      .get("/api/error") // This route is defined in app.ts to throw an error
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

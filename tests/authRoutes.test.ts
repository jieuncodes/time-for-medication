// tests/authRoutes.test.mts
import request from "supertest";
import app from "../server/src/app.ts";
import { AppDataSource } from "../server/src/data-source.ts";
import { User } from "../server/src/models/User.ts";
import { Medication } from "../server/src/models/Medication.ts";

describe("Authentication Routes", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const user = await transactionalEntityManager.findOne(User, {
        where: { email: "testuser@test.test" },
        relations: ["medications"],
      });

      if (user) {
        await transactionalEntityManager.remove(Medication, user.medications);
        await transactionalEntityManager.remove(User, user);
      }
    });
  });

  afterAll(async () => {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const user = await transactionalEntityManager.findOne(User, {
        where: { email: "testuser@test.test" },
        relations: ["medications"],
      });

      if (user) {
        await transactionalEntityManager.remove(Medication, user.medications);
        await transactionalEntityManager.remove(User, user);
      }
    });
    if (AppDataSource.isInitialized) {
      try {
        await AppDataSource.destroy();
        console.log("Data Source has been destroyed successfully!");
      } catch (error) {
        console.error("Error during Data Source destruction:", error);
      }
    }
  });

  describe("POST /api/register", () => {
    test("should register a new user and return 200 status", async () => {
      const response = await request(app).post("/api/register").send({
        email: "testuser@test.test",
        username: "testuser",
        password: "Password123!",
        fcmToken: "fakeFcmToken123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", "User registered");
    });
  });

  describe("POST /api/login", () => {
    test("should authenticate user with correct credentials", async () => {
      const response = await request(app).post("/api/login").send({
        email: "testuser@test.test",
        username: "testuser",
        password: "Password123!",
        fcmToken: "fakeFcmToken123",
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
    });

    test("should reject login with incorrect credentials", async () => {
      const response = await request(app).post("/api/login").send({
        email: "testuser@test.test",
        password: "WrongPassword1!",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});

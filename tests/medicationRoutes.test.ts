// tests/medicationRoutes.test.mts
import request from "supertest";
import app from "../server/src/app.ts";
import { AppDataSource } from "../server/src/data-source.ts";
import { User } from "../server/src/models/User.ts";
import { Medication } from "../server/src/models/Medication.ts";

describe("Medication Routes", () => {
  let token = "";
  let medicationId = "";
  const testEmail = "testuser@test.test";
  const username = "testuser";
  const testUser = {
    email: testEmail,
    username: username,
    password: "Password123!",
    fcmToken: "fakeFcmToken123",
  };
  const testMedication = {
    name: "Aspirin",
    dosage: "100mg",
    frequency: "Once a day",
    nextAlarm: new Date().toISOString(),
  };

  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const user = await transactionalEntityManager.findOne(User, {
        where: { email: testEmail },
        relations: ["medications"],
      });

      if (user) {
        await transactionalEntityManager.remove(Medication, user.medications);
        await transactionalEntityManager.remove(User, user);
      }
    });
    await request(app).post("/api/register").send(testUser);
    const loginResponse = await request(app).post("/api/login").send(testUser);
    token = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const user = await transactionalEntityManager.findOne(User, {
        where: { email: testEmail },
        relations: ["medications"],
      });

      if (user) {
        await transactionalEntityManager.remove(Medication, user.medications);
        await transactionalEntityManager.remove(User, user);
      }
    });
    await AppDataSource.destroy();
    console.log("medicationRoutes Test Database connection closed");
  });

  test("Add Medication", async () => {
    const postResponse = await request(app)
      .post("/api/medications")
      .set("Authorization", `Bearer ${token}`)
      .send(testMedication);
    expect(postResponse.status).toBe(200);
    medicationId = postResponse.body.data.id;
  });

  test("Update Medication1", async () => {
    const putResponse = await request(app)
      .put(`/api/medications/${medicationId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Ibuprofen",
        dosage: "100mg",
        frequency: "Once a day",
        nextAlarm: new Date().toISOString(),
      });
    expect(putResponse.status).toBe(200);
  });

  test("Update Medication2", async () => {
    const putResponse = await request(app)
      .put(`/api/medications/${medicationId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "lafa",
        dosage: "50mg",
        frequency: "Twice a day",
        nextAlarm: new Date().toISOString(),
      });
    expect(putResponse.status).toBe(200);
  });

  test("Delete Medication", async () => {
    const deleteResponse = await request(app)
      .delete(`/api/medications/${medicationId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteResponse.status).toBe(204);
  });
});

describe("Medication Routes - Edge Case Tests", () => {
  let token = "";
  let medicationId = "";
  const testUser = {
    email: "edgecaseuser@test.test",
    username: "edgecaseuser",
    password: "Password123!",
    fcmToken: "fakeFcmToken123",
  };

  beforeAll(async () => {
    await AppDataSource.initialize();
    await request(app).post("/api/register").send(testUser);
    const loginResponse = await request(app).post("/api/login").send(testUser);
    token = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const user = await transactionalEntityManager.findOne(User, {
        where: { email: testUser.email },
        relations: ["medications"],
      });

      if (user) {
        await transactionalEntityManager.remove(Medication, user.medications);
        await transactionalEntityManager.remove(User, user);
      }
    });
    await AppDataSource.destroy();
  });

  test("Add Medication with Invalid Date Format", async () => {
    const response = await request(app)
      .post("/api/medications")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "Twice a day",
        nextAlarm: "invalid-date",
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  test("Update Medication with Invalid Date Format", async () => {
    const createResponse = await request(app)
      .post("/api/medications")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "Twice a day",
        nextAlarm: new Date().toISOString(),
      });
    medicationId = createResponse.body.data.id;

    const response = await request(app)
      .put(`/api/medications/${medicationId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nextAlarm: "invalid-date",
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
});

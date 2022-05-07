import supertest from "supertest";

import app from "../../src/app";
import { prisma } from "../../src/database";
import { recommendationBodyFactory } from "../factories/recommendationFactory";

describe("Song recommendation integration tests", () => {
  beforeAll(async () => {
    // Prune DB
    await prisma.$executeRaw`DELETE FROM recommendations WHERE id > 15;`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const BASE_PATH = "/recommendations";

  describe("GET /", () => {
    it("should return an array and status 200", async () => {
      const { body, status } = await supertest(app).get(BASE_PATH);

      expect(typeof body).toBe("object");
      expect(body.length).toBe(10);
      expect(status).toBe(200);
    });
  });

  describe("GET /random", () => {
    it("should return a recommendation and status 200", async () => {
      const { body, status } = await supertest(app).get(`${BASE_PATH}/random`);

      expect(typeof body).toBe("object");
      expect(body.length).toBeUndefined();

      const { id, name, youtubeLink, score } = body;
      expect(typeof id).toBe("number");
      expect(typeof name).toBe("string");
      expect(typeof youtubeLink).toBe("string");
      expect(typeof score).toBe("number");
      expect(status).toBe(200);
    });
  });

  describe("GET /top/:amount", () => {
    it("should return the top amount recommendations and status 200", async () => {
      const amount = 5;
      const { body, status } = await supertest(app).get(
        `${BASE_PATH}/top/${amount}`
      );

      expect(typeof body).toBe("object");
      expect(body.length).toBe(amount);

      const recommendations = await prisma.recommendation.findMany({
        orderBy: { score: "desc" },
        take: amount,
      });

      for (let i = 0; i < amount; i++) {
        expect(body[i].score).toEqual(recommendations[i].score);
      }

      expect(status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    it("should return the specified recommendation and status 200", async () => {
      const id = Math.floor(1 + 15 * Math.random()); // from 1 to 15
      const { body, status } = await supertest(app).get(`${BASE_PATH}/${id}`);

      expect(typeof body).toBe("object");
      expect(body.length).toBeUndefined();

      const expected = await prisma.recommendation.findUnique({
        where: { id },
      });

      const { name, youtubeLink, score } = expected;
      expect(body.id).toBe(id);
      expect(body.name).toBe(name);
      expect(body.youtubeLink).toBe(youtubeLink);
      expect(body.score).toBe(score);
      expect(status).toBe(200);
    });
  });

  describe("POST /", () => {
    it("should return status 201 and create a new recommendation", async () => {
      const recommendation = recommendationBodyFactory();
      const { name } = recommendation;
      const { status } = await supertest(app)
        .post(BASE_PATH)
        .send(recommendation);

      expect(status).toBe(201);

      const inserted = await prisma.recommendation.findUnique({
        where: {
          name,
        },
      });

      const { youtubeLink, score } = inserted;
      expect(youtubeLink).toBe(recommendation.youtubeLink);
      expect(score).toBe(0);
    });
  });

  describe("POST /:id/upvote", () => {
    it("should return status 200 and upvote the specified recommendation", async () => {
      const id = Math.floor(1 + 15 * Math.random()); // from 1 to 15

      const before = await prisma.recommendation.findUnique({ where: { id } });

      const { status } = await supertest(app).post(`${BASE_PATH}/${id}/upvote`);

      expect(status).toBe(200);

      const after = await prisma.recommendation.findUnique({ where: { id } });

      expect(after.name).toBe(before.name);
      expect(after.youtubeLink).toBe(before.youtubeLink);
      expect(after.score).toBe(before.score + 1);
    });
  });

  describe("POST /:id/downvote", () => {
    it("should return status 200 and downvote the specified recommendation", async () => {
      const id = Math.floor(1 + 15 * Math.random()); // from 1 to 15

      const before = await prisma.recommendation.findUnique({ where: { id } });

      // Prevent deletion
      if (before.score < -4) {
        await prisma.recommendation.update({
          where: { id },
          data: { score: -4 },
        });

        before.score = -4;
      }

      const { status } = await supertest(app).post(
        `${BASE_PATH}/${id}/downvote`
      );

      expect(status).toBe(200);

      const after = await prisma.recommendation.findUnique({ where: { id } });

      expect(after.name).toBe(before.name);
      expect(after.youtubeLink).toBe(before.youtubeLink);
      expect(after.score).toBe(before.score - 1);
    });
  });
});

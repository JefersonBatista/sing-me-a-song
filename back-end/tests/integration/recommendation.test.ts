import supertest from "supertest";
import app from "../../src/app";

describe("Song recommendations", () => {
  const BASE_PATH = "/recommendations";

  describe("GET /", () => {
    it("should return an array and status 200", async () => {
      const { body, status } = await supertest(app).get(BASE_PATH);

      expect(typeof body).toBe("object");
      expect(body.length).toBeDefined();
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
      const amount = 3;
      const { body, status } = await supertest(app).get(
        `${BASE_PATH}/top/${amount}`
      );

      expect(typeof body).toBe("object");
      expect(body.length).toBe(amount);

      expect(body[0].score).toBe(10);
      expect(body[1].score).toBe(9);
      expect(body[2].score).toBe(8);

      expect(status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    it("should return the specified recommendation and status 200", async () => {
      const id = 28;
      const { body, status } = await supertest(app).get(`${BASE_PATH}/${id}`);

      expect(typeof body).toBe("object");
      expect(body.length).toBeUndefined();

      const { name, youtubeLink, score } = body;
      expect(body.id).toBe(id);
      expect(name).toBe("qui aspernatur quo");
      expect(youtubeLink).toBe("https://www.youtube.com/watch?v=1S5xqe3zw8Y");
      expect(score).toBe(8);
      expect(status).toBe(200);
    });
  });
});

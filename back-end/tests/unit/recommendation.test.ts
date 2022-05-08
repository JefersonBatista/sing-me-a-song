import { jest } from "@jest/globals";

import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationBodyFactory } from "../factories/recommendationFactory";

describe("Song recommendation service unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Insert song recommendation", () => {
    it("should call create from repository once", async () => {
      const recommendation = recommendationBodyFactory();

      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValue(null);

      const create = jest
        .spyOn(recommendationRepository, "create")
        .mockResolvedValue(null);

      await recommendationService.insert(recommendation);

      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(recommendation);
    });

    it("should throw 'conflict' called with an existing recommendation", async () => {
      const recommendation = recommendationBodyFactory();

      jest.spyOn(recommendationRepository, "findByName").mockResolvedValue({
        id: 246,
        name: recommendation.name,
        youtubeLink: "youtu.be/jogarlol",
        score: 6,
      });

      const create = jest
        .spyOn(recommendationRepository, "create")
        .mockResolvedValue(null);

      try {
        await recommendationService.insert(recommendation);
      } catch (error) {
        expect(error.type).toBe("conflict");
      }

      expect(create).toBeCalledTimes(0);
    });
  });

  describe("Upvote song recommendation", () => {
    it("should call update score from repository once", async () => {
      const id = 30;

      jest.spyOn(recommendationRepository, "find").mockResolvedValue({
        id,
        name: "funk do pão de queijo",
        youtubeLink: "youtu.be/bananinha",
        score: 33,
      });

      const update = jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValue(null); // resolved value doesn't matter

      await recommendationService.upvote(id);

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(id, "increment");
    });

    it("should throw 'not_found' called with a non-existing id", async () => {
      const id = 50;

      jest.spyOn(recommendationRepository, "find").mockResolvedValue(null);

      const update = jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValue(null);

      try {
        await recommendationService.upvote(id);
      } catch (error) {
        expect(error.type).toBe("not_found");
      }

      expect(update).toBeCalledTimes(0);
    });
  });

  describe("Downvote song recommendation", () => {
    it("should call update score from repository once", async () => {
      const id = 10;

      jest.spyOn(recommendationRepository, "find").mockResolvedValue({
        id,
        name: "funk do pão de queijo",
        youtubeLink: "youtu.be/bananinha",
        score: 9,
      });

      const update = jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValue({
          id,
          name: "funk do pão de queijo",
          youtubeLink: "youtu.be/bananinha",
          score: 8,
        });

      await recommendationService.downvote(id);

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(id, "decrement");
    });

    it("should eliminate recommendation with score less than -5", async () => {
      const id = 10;

      jest.spyOn(recommendationRepository, "find").mockResolvedValue({
        id,
        name: "funk do pão de queijo",
        youtubeLink: "youtu.be/bananinha",
        score: -5,
      });

      const update = jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValue({
          id,
          name: "funk do pão de queijo",
          youtubeLink: "youtu.be/bananinha",
          score: -6,
        });

      const remove = jest
        .spyOn(recommendationRepository, "remove")
        .mockResolvedValue(null);

      await recommendationService.downvote(id);

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(id, "decrement");
      expect(remove).toBeCalledTimes(1);
      expect(remove).toBeCalledWith(id);
    });

    it("should throw 'not_found' called with a non-existing id", async () => {
      const id = 100;

      jest.spyOn(recommendationRepository, "find").mockResolvedValue(null);

      const update = jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValue(null);

      try {
        await recommendationService.downvote(id);
      } catch (error) {
        expect(error.type).toBe("not_found");
      }

      expect(update).toBeCalledTimes(0);
    });
  });

  describe("Get song recommendations", () => {
    it.todo("should call repository and return 10 song recommendations");
  });

  describe("Get top song recommendations", () => {
    it.todo(
      "should call repository and return an amount of top recommendations"
    );
  });

  describe("Get a random song recommendation", () => {
    it.todo("should call repository and return a well-voted recommendation");
    it.todo("should call repository and return a poorly-voted recommendation");
    it.todo("should throw 'not_found' if there is no recommendations");
  });
});

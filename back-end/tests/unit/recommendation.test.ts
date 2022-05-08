import { jest } from "@jest/globals";

import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import recommendationFactory, {
  recommendationBodyFactory,
} from "../factories/recommendationFactory";

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
    it("should call repository and return song recommendations", async () => {
      const expected = [];
      for (let i = 1; i <= 3; i++) {
        expected.push(recommendationFactory(4 * i));
      }

      jest
        .spyOn(recommendationRepository, "findAll")
        .mockResolvedValue(expected);

      const recommendations = await recommendationService.get();

      expect(recommendations).toBe(expected);
    });
  });

  describe("Get top song recommendations", () => {
    it("should call repository and return an amount of top recommendations", async () => {
      const amount = 5;

      const expected = [];
      for (let i = 1; i <= amount; i++) {
        const recommendation = recommendationFactory(7 * i - 3);
        recommendation.score = 100 - 3 * i;
        expected.push(recommendation);
      }

      const getAmountByScore = jest
        .spyOn(recommendationRepository, "getAmountByScore")
        .mockResolvedValue(expected);

      const recommendations = await recommendationService.getTop(amount);

      expect(recommendations).toBe(expected);
      expect(getAmountByScore).toBeCalledWith(amount);
    });
  });

  describe("Get a random song recommendation", () => {
    it("should call repository and return a well-voted recommendation", async () => {
      const expected = recommendationFactory(25);
      expected.score = 88;

      jest.spyOn(Math, "random").mockReturnValue(0.5);

      const findAll = jest
        .spyOn(recommendationRepository, "findAll")
        .mockResolvedValue([expected]);

      const recommendation = await recommendationService.getRandom();

      expect(recommendation).toBe(expected);
      expect(findAll).toBeCalledTimes(1);
      expect(findAll).toBeCalledWith({ score: 10, scoreFilter: "gt" });
    });

    it("should call repository and return a poorly-voted recommendation", async () => {
      const expected = recommendationFactory(25);
      expected.score = 5;

      jest.spyOn(Math, "random").mockReturnValue(0.8);

      const findAll = jest
        .spyOn(recommendationRepository, "findAll")
        .mockResolvedValue([expected]);

      const recommendation = await recommendationService.getRandom();

      expect(recommendation).toBe(expected);
      expect(findAll).toBeCalledTimes(1);
      expect(findAll).toBeCalledWith({ score: 10, scoreFilter: "lte" });
    });

    it("should throw 'not_found' if there is no recommendations", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0.8);

      const findAll = jest
        .spyOn(recommendationRepository, "findAll")
        .mockResolvedValue([]);

      try {
        await recommendationService.getRandom();
      } catch (error) {
        expect(error.type).toBe("not_found");
      }

      expect(findAll).toBeCalledTimes(2);
      expect(findAll).toBeCalledWith({ score: 10, scoreFilter: "lte" });
      expect(findAll).toBeCalledWith();
    });
  });
});

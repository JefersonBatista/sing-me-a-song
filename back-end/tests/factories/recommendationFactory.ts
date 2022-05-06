import { faker } from "@faker-js/faker";

import { Recommendation } from "@prisma/client";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

const youtubeLinks = [
  "https://www.youtube.com/watch?v=1S5xqe3zw8Y",
  "https://www.youtube.com/watch?v=kyrCIiwe4kQ",
  "https://www.youtube.com/watch?v=5_5oE0ijhKg",
  "https://www.youtube.com/watch?v=SNM_1d3mmtI",
];

const n = youtubeLinks.length;

export default function recommendationFactory(id: number): Recommendation {
  return {
    id,
    name: faker.lorem.words(3),
    youtubeLink: youtubeLinks[Math.floor(n * Math.random())],
    score: Math.floor(-5 + 21 * Math.random()), // from -5 to 15
  };
}

export function recommendationBodyFactory(): CreateRecommendationData {
  return {
    name: faker.lorem.words(3),
    youtubeLink: youtubeLinks[Math.floor(n * Math.random())],
  };
}

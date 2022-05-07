import { faker } from "@faker-js/faker";

const youtubeLinks = [
  "https://www.youtube.com/watch?v=1S5xqe3zw8Y",
  "https://www.youtube.com/watch?v=kyrCIiwe4kQ",
  "https://www.youtube.com/watch?v=5_5oE0ijhKg",
  "https://www.youtube.com/watch?v=SNM_1d3mmtI",
];

const n = youtubeLinks.length;

export default function recommendationFactory() {
  const recommendation = {
    name: faker.lorem.words(3),
    youtubeLink: youtubeLinks[Math.floor(n * Math.random())],
  };

  return recommendation;
}

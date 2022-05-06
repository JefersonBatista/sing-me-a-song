import recommendationFactory from "./factories/recommendationFactory";

describe("Add recommendation", () => {
  it("shows a new recommendation when it is added", () => {
    const recommendation = recommendationFactory();

    cy.visit("localhost:3000");

    cy.get("input[name=name]").type(recommendation.name);
    cy.get("input[name=link]").type(recommendation.youtubeLink);

    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.get("button[name=recommend]").click();

    cy.wait("@getRecommendations").then((_) =>
      cy.get("div[name=song-name]").first().contains(recommendation.name)
    );
  });
});

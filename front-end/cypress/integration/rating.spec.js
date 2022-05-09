/// <reference types="cypress" />

describe("Rating a recommendation", () => {
  it("should request recommendation rating", () => {
    cy.visit("localhost:3000/random");

    cy.intercept("POST", "/recommendations/*/upvote").as("upvote");
    cy.intercept("POST", "/recommendations/*/downvote").as("downvote");
    cy.intercept("GET", "/recommendations/*").as("getRecommendation");

    cy.get("svg[name=upvote]").click();
    cy.wait("@upvote").then((_) => {}); // wait but do nothing
    cy.wait("@getRecommendation").then((_) => {}); // wait but do nothing

    cy.get("svg[name=downvote]").click();
    cy.wait("@downvote").then((_) => {}); // wait but do nothing
    cy.wait("@getRecommendation").then((_) => {}); // wait but do nothing
  });
});

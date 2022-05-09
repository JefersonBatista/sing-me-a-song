/// <reference types="cypress" />

describe("Test navigation bar", () => {
  it("should click top and list the 10 (if there are) top recommendations", () => {
    cy.visit("localhost:3000");

    cy.intercept("GET", "/recommendations/top/10").as("getTop");

    cy.get("div[name=top]").click();
    cy.wait("@getTop").then((_) => {}); // wait but do nothing
    cy.get("article").its("length").should("lte", 10);
  });

  it("should click random and list a recommendation", () => {
    cy.visit("localhost:3000");

    cy.intercept("GET", "/recommendations/random").as("getRandom");

    cy.get("div[name=random]").click();
    cy.wait("@getRandom").then((_) => {}); // wait but do nothing
    cy.get("article").its("length").should("eq", 1);
  });

  it("should click home and list the 10 (if there are) last recommendations", () => {
    cy.visit("localhost:3000");

    cy.intercept("GET", "/recommendations").as("get");

    cy.get("div[name=home]").click();
    cy.wait("@get").then((_) => {}); // wait but do nothing
    cy.get("article").its("length").should("lte", 10);
  });
});

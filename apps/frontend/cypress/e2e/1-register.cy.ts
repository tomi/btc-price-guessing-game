/// <reference types="cypress" />

import "../support/commands";

describe("player registration", () => {
  before(() => {
    if (!Cypress.env("APP_URL")) {
      throw new Error(`Missing APP_URL config. Fix it by setting a CYPRESS_APP_URL env variable`);
    }

    cy.visit(Cypress.env("APP_URL"));
  });

  it("shows the registration screen", () => {
    cy.get("h1").should("have.text", "Bitcoin price guessing game");
  });

  it("disables start button when name is empty", () => {
    cy.findByRole("button", { name: /start/i }).should("be.disabled");
  });

  it("can enter player name", () => {
    cy.findByLabelText("Name").type("Player One");
  });

  it("enabled start button when name is given", () => {
    cy.findByRole("button", { name: /start/i }).should("be.enabled");
  });

  it("can register a player", () => {
    cy.findByRole("button", { name: /start/i }).click();

    cy.get("h1").should("have.text", "Hello, Player One 👋");
  });
});

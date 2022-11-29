/// <reference types="cypress" />

import "../support/commands";

describe("game logic", () => {
  before(() => {
    if (!Cypress.env("APP_URL")) {
      throw new Error(`Missing APP_URL config. Fix it by setting a CYPRESS_APP_URL env variable`);
    }

    cy.visit(Cypress.env("APP_URL"));

    cy.get("h1").should("have.text", "Bitcoin price guessing game");
    cy.findByLabelText("Name").type("Player One");
    cy.findByRole("button", { name: /start/i }).click();

    cy.get("h1").should("have.text", "Hello, Player One 👋");
  });

  it("shows the player score", () => {
    cy.findByTestId("player-score").should("have.text", "0");
  });

  it("shows the btc price", () => {
    cy.findByTestId("btc-price")
      .invoke("text")
      .should("match", /\$[1-9]+/);
  });

  it("has the guess buttons enabled", () => {
    cy.findByRole("button", { name: /down/i }).should("be.enabled");
    cy.findByRole("button", { name: /up/i }).should("be.enabled");
  });

  it("can make a guess", () => {
    cy.findByRole("button", { name: /up/i }).click();

    cy.contains("You guessed that the price goes up.");
  });

  it("disables buttons when a guess is active", () => {
    cy.findByRole("button", { name: /down/i }).should("be.disabled");
    cy.findByRole("button", { name: /up/i }).should("be.disabled");
  });

  it("can resolve a guess", () => {
    cy.contains("Make a guess!", {
      // The resolving takes some time, so we need to use a long timeout
      timeout: 3 * 60 * 1000, // 3 mins
    });
  });

  it("updates the player score", () => {
    cy.findByTestId("player-score").invoke("text").should("match", /-1|1/);
  });
});

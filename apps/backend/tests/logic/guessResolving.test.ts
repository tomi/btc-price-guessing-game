import { Direction, Guess } from "../../src/domain/guess";
import { calculateResolveResults, resolveGuessesByNewPrice } from "../../src/logic/guessResolving";
import { GuessResolvingRepo } from "../../src/persistence/guessResolvingRepo";

describe("guessResolving", () => {
  describe("calculateResolveResults", () => {
    const createdAt = new Date().toISOString();
    const playerId = "1";

    test.each([
      [Direction.Up, 9, 1],
      [Direction.Up, 11, -1],
      [Direction.Down, 9, -1],
      [Direction.Down, 11, 1],
    ])(
      "returns result for guess with direction %s and initial price %d",
      (direction, priceWhenCreated, expectedResult) => {
        const expected = {
          playerId,
          pointDelta: expectedResult,
        };

        const [actual] = calculateResolveResults(10, [
          {
            createdAt,
            direction,
            playerId,
            priceWhenCreated,
          },
        ]);

        expect(actual).toEqual(expected);
      },
    );
  });

  describe("resolveGuessesByNewPrice", () => {
    const createMockRepo = ({
      resolvableGuesses = [],
    }: {
      resolvableGuesses?: Guess[];
    }): GuessResolvingRepo => ({
      resolveGuesses: jest.fn().mockResolvedValue(undefined),
      getGuessesBefore: jest.fn().mockResolvedValue(resolvableGuesses),
    });

    it("calls getGuessesBefore with correct timestamp", async () => {
      const mockRepo = createMockRepo({ resolvableGuesses: [] });
      await resolveGuessesByNewPrice({
        guessResolvingRepo: mockRepo,
        newPrice: {
          id: "BTC-USD",
          updatedAt: "2022-11-11T12:00:00.000Z",
          value: 10,
        },
      });

      expect(mockRepo.getGuessesBefore).toBeCalledWith("2022-11-11T11:59:00.000Z");
    });

    it("does not call resolveGuesses when there is nothing to resolve", async () => {
      const mockRepo = createMockRepo({ resolvableGuesses: [] });
      await resolveGuessesByNewPrice({
        guessResolvingRepo: mockRepo,
        newPrice: {
          id: "BTC-USD",
          updatedAt: "2022-11-11T12:00:00.000Z",
          value: 10,
        },
      });

      expect(mockRepo.resolveGuesses).not.toHaveBeenCalled();
    });

    it("resolves correct guesses", async () => {
      const createdAt = "2022-11-11T11:00:00.000Z";
      const playerId = "1";

      const mockRepo = createMockRepo({
        resolvableGuesses: [
          {
            createdAt,
            direction: Direction.Up,
            playerId,
            priceWhenCreated: 9,
          },
        ],
      });

      await resolveGuessesByNewPrice({
        guessResolvingRepo: mockRepo,
        newPrice: {
          id: "BTC-USD",
          updatedAt: "2022-11-11T12:00:00.000Z",
          value: 10,
        },
      });

      expect(mockRepo.resolveGuesses).toHaveBeenCalledWith([{ playerId, pointDelta: 1 }]);
    });
  });
});

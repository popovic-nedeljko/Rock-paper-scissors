export const Model = {
  // --- Game Settings ---
  mode: "standard",
  choices: ["rock", "paper", "scissors"],
  userHistory: [],
  maxHistory: 20,
  wins: 0,
  losses: 0,
  markovMatrix: {},
  winningRounds: 3,

  // --- Set Game Mode ---
  setMode(newMode) {
    this.mode = newMode;
  },

  // --- Set Number of Winning Rounds ---
  setWinningRounds(num) {
    if ([3, 5, 10].includes(num)) {
      this.winningRounds = num;
    } else {
      this.winningRounds = 3;
    }
  },

  // --- Record User's Move & Update Markov Chain ---
  recordUserMove(move) {
    try {
      if (!this.choices.includes(move)) return;
      this.userHistory.push(move);

      // Limit history length
      if (this.userHistory.length > this.maxHistory) {
        this.userHistory.shift();
      }

      // Update Markov transition matrix
      const len = this.userHistory.length;
      if (len >= 2) {
        const prev = this.userHistory[len - 2];
        const curr = this.userHistory[len - 1];

        if (!this.markovMatrix[prev]) {
          this.markovMatrix[prev] = {};
        }

        if (!this.markovMatrix[prev][curr]) {
          this.markovMatrix[prev][curr] = 1;
        } else {
          this.markovMatrix[prev][curr]++;
        }
      }
    } catch (error) {
      console.error("❌ Error in recordUserMove:", error);
    }
  },

  // --- Predict Next User Move by Frequency Analysis ---
  predictByFrequency() {
    const freq = { rock: 0, paper: 0, scissors: 0 };
    for (const move of this.userHistory) {
      if (freq[move] !== undefined) freq[move]++;
    }
    return Object.keys(freq).reduce((a, b) => (freq[a] > freq[b] ? a : b));
  },

  // --- Predict Next User Move Using Markov Chain ---
  predictByMarkov() {
    try {
      const last = this.userHistory[this.userHistory.length - 1];
      const transitions = this.markovMatrix[last];

      if (!last || !transitions) {
        // No data, return random choice
        return this.choices[Math.floor(Math.random() * 3)];
      }

      // Weighted random based on transitions
      const weighted = {};
      for (const move of this.choices) {
        weighted[move] = transitions[move] || 1;
      }

      const total = Object.values(weighted).reduce((a, b) => a + b, 0);
      const rand = Math.random() * total;
      let cumulative = 0;

      for (const move of this.choices) {
        cumulative += weighted[move];
        if (rand < cumulative) return move;
      }

      // fallback
      return this.choices[0];
    } catch (error) {
      console.error("❌ Error in predictByMarkov:", error);
      return this.choices[Math.floor(Math.random() * 3)];
    }
  },

  // --- Compute Counter Move to Beat Given Move ---
  counterMove(move) {
    if (move === "rock") return "paper";
    if (move === "paper") return "scissors";
    if (move === "scissors") return "rock";
    // fallback random
    return this.choices[Math.floor(Math.random() * 3)];
  },

  // --- Get Computer's Choice Based on Mode & Predictions ---
  getComputerChoice() {
    try {
      if (this.mode === "standard") {
        const randIndex = Math.floor(Math.random() * 3);
        return this.choices[randIndex];
      } else {
        const freqGuess = this.predictByFrequency();
        const markovGuess = this.predictByMarkov();

        const predicted =
          freqGuess === markovGuess
            ? freqGuess
            : Math.random() < 0.5
            ? freqGuess
            : markovGuess;

        return this.counterMove(predicted);
      }
    } catch (error) {
      console.error("❌ Error in getComputerChoice:", error);
      return this.choices[Math.floor(Math.random() * 3)];
    }
  },

  // --- Determine Result & Update Scores ---
  getResult(user, computer) {
    if (user === computer) return "DRAW";
    if (
      (user === "rock" && computer === "scissors") ||
      (user === "paper" && computer === "rock") ||
      (user === "scissors" && computer === "paper")
    ) {
      this.wins++;
      return "WIN";
    } else {
      this.losses++;
      return "LOSE";
    }
  },

  // --- Reset Game State ---
  resetGame() {
    this.userHistory = [];
    this.markovMatrix = {};
    this.wins = 0;
    this.losses = 0;
  },
};

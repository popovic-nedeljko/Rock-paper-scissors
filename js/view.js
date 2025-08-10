export const View = {
  // --- Timeout Handle for Round ---
  roundTimeout: null,

  // --- Emoji Map for Choices ---
  emoji(choice) {
    const emojis = {
      rock: "✊",
      paper: "✋",
      scissors: "✌️",
    };
    return emojis[choice] || "❓";
  },

  // --- Show Game Screen and Hide Opening Screen ---
  showGameScreen() {
    document.getElementById("openingScreen").classList.add("hidden");
    document.getElementById("gameInterface").classList.remove("hidden");
  },

  // --- Set Active Mode Button ---
  setModeActive(buttonId) {
    try {
      const standardBtn = document.getElementById("standardMode");
      const hardBtn = document.getElementById("hardMode");

      if (!standardBtn || !hardBtn) {
        throw new Error("Buttons are not found.");
      }

      standardBtn.classList.remove("active");
      hardBtn.classList.remove("active");

      const activeBtn = document.getElementById(buttonId);
      if (activeBtn) {
        activeBtn.classList.add("active");
      } else {
        console.warn("⚠️ Button is not found:", buttonId);
      }
    } catch (err) {
      console.error("❌ Erorr in setModeActive:", err);
    }
  },

  // --- Disable Player Choices ---
  lockPlayerChoices() {
    document.querySelectorAll(".choice").forEach((card) => {
      card.classList.add("disabled");
    });
  },

  // --- Enable Player Choices ---
  unlockPlayerChoices() {
    document.querySelectorAll(".choice").forEach((card) => {
      card.classList.remove("disabled");
    });
  },

  // --- Update Result Display (User & Computer Choices, Result, Scores) ---
  updateResult(user, computer, result, wins, losses) {
    try {
      const userEl = document.getElementById("userChoice");
      const compEl = document.getElementById("computerChoice");
      const winsEl = document.getElementById("wins");
      const lossesEl = document.getElementById("losses");
      const instructionEl = document.getElementById("instructionBox");

      if (!userEl || !compEl || !winsEl || !lossesEl || !instructionEl) {
        throw new Error("Some DOM elements are not found.");
      }

      // Refresh the display of the results text
      userEl.textContent = this.emoji(user);
      compEl.textContent = this.emoji(computer);
      winsEl.textContent = wins;
      lossesEl.textContent = losses;

      // Clear all previous effects
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("selected", "win", "not-selected");
      });

      // Find the selected cards
      const playerCard = document.querySelector(
        `.player-cards.player .card[data-choice="${user}"]`
      );
      const computerCard = document.querySelector(
        `.player-cards.computer .card[data-choice="${computer}"]`
      );

      // Mark selected and unselected cards for player
      document
        .querySelectorAll(".player-cards.player .card")
        .forEach((card) => {
          card === playerCard
            ? card.classList.add("selected")
            : card.classList.add("not-selected");
        });

      // Mark selected and unselected cards for computer
      document
        .querySelectorAll(".player-cards.computer .card")
        .forEach((card) => {
          card === computerCard
            ? card.classList.add("selected")
            : card.classList.add("not-selected");
        });

      // Set the winner's message and color effects
      if (result.includes("WIN")) {
        instructionEl.textContent = "Player wins!";
        playerCard.classList.add("win");
      } else if (result.includes("LOSE")) {
        instructionEl.textContent = "Computer wins!";
        computerCard.classList.add("win");
      } else {
        instructionEl.textContent = "It's a draw!";
      }

      // Lock the cards while the timer is running
      this.lockPlayerChoices();

      // Clear any previous round timeout
      if (this.roundTimeout) clearTimeout(this.roundTimeout);

      // Set timeout to reset UI after delay
      this.roundTimeout = setTimeout(() => {
        instructionEl.textContent = "Choose Rock, Paper or Scissors";
        this.unlockPlayerChoices();
        document.querySelectorAll(".card").forEach((card) => {
          card.classList.remove("selected", "win", "not-selected");
        });
        this.roundTimeout = null;
      }, 1500);
    } catch (err) {
      console.error("❌ Error in updateResult:", err);
    }
  },

  // --- Show Game Over Popup ---
  showGameOver(winner) {
    const popup = document.querySelector(".popup-overlay");
    const message = popup.querySelector(".game-over-message");

    message.textContent = `${winner} wins the game! 🎉`;
    popup.classList.remove("hidden");

    this.lockPlayerChoices();
  },

  // --- Hide Game Over Popup ---
  hideGameOver() {
    const popup = document.querySelector(".popup-overlay");
    popup.classList.add("hidden");
    this.unlockPlayerChoices();
  },

  // --- Toggle Rules Popup Visibility ---
  toggleRulesPopup() {
    const popup = document.getElementById("rulesPopup");
    popup.classList.toggle("show");
    document.getElementById("rulesOverlay").classList.toggle("hidden");
  },
  closeRulesPopup() {
    const popup = document.getElementById("rulesPopup");
    popup.classList.remove("show");
    document.getElementById("rulesOverlay").classList.add("hidden");
  },

  // --- Reset View to Initial State ---
  resetView() {
    try {
      const userEl = document.getElementById("userChoice");
      const compEl = document.getElementById("computerChoice");
      const winsEl = document.getElementById("wins");
      const lossesEl = document.getElementById("losses");
      const instructionEl = document.getElementById("instructionBox");

      if (!userEl || !compEl || !winsEl || !lossesEl || !instructionEl) {
        throw new Error("Elements are not found.");
      }

      // Reset text to default
      userEl.textContent = "-";
      compEl.textContent = "-";
      winsEl.textContent = "0";
      lossesEl.textContent = "0";
      instructionEl.textContent = "Choose Rock, Paper or Scissors";

      // Cancel any waiting from the previous round
      if (this.roundTimeout) {
        clearTimeout(this.roundTimeout);
        this.roundTimeout = null;
      }

      // Unlock the cards for new game
      this.unlockPlayerChoices();
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("selected", "win", "not-selected");
      });
    } catch (err) {
      console.error("❌ Error in resetView:", err);
    }
  },
};

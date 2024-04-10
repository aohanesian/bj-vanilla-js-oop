class Card {
    constructor(value, suit, emoji) {
        this.value = value;
        this.suit = suit;
        this.emoji = emoji;
    }
}

class Deck {
    static nominal = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    static suits = ["diamonds", "hearts", "spades", "clubs"];
    static emojis = ["♦️", "♥️", "♠️", "♣️"];

    constructor() {
        this.cards = [];
        this.initializeDeck();
        this.shuffleDeck();
    }

    initializeDeck() {
        for (let i = 0; i < Deck.suits.length; i++) {
            for (let x = 0; x < Deck.nominal.length; x++) {
                let card = new Card(Deck.nominal[x], Deck.suits[i], Deck.emojis[i]);
                this.cards.push(card);
            }
        }
    }

    shuffleDeck() {
        for (let i = 0; i < 1000; i++) {
            let location1 = Math.floor((Math.random() * this.cards.length));
            let location2 = Math.floor((Math.random() * this.cards.length));
            let tmp = this.cards[location1];

            this.cards[location1] = this.cards[location2];
            this.cards[location2] = tmp;
        }
    }

    drawCard() {
        return this.cards.pop();
    }
}

class Game {
    constructor() {
        this.deck = new Deck();
        this.playerHand = [];
        this.dealerHand = [];

        this.standBtn = document.getElementById('stand');
        this.hitBtn = document.getElementById('hit');
        this.newRoundBtn = document.getElementById('newRound');
        this.newGameBtn = document.getElementById('newGame');
        this.announcement = document.getElementById('announcement');
        this.dealerHandElement = document.querySelector('.dealer-hand');
        this.playerHandElement = document.querySelector('.player-hand');
        this.deckLengthElement = document.getElementById('deckLength');
        this.dealBtn = document.getElementById('deal');

        this.dealBtn.addEventListener('click', () => this.deal());
        this.hitBtn.addEventListener('click', () => this.hit());
        this.standBtn.addEventListener('click', () => this.stand(this.calculateHandValue(this.dealerHand), this.calculateHandValue(this.playerHand)));
        this.newRoundBtn.addEventListener('click', () => this.newRound());
        this.newGameBtn.addEventListener('click', () => this.newGame());
    }

    calculateHandValue(hand) {
        let aces = hand.filter(card => card.value === "A");
        let nonAces = hand.filter(card => card.value !== "A");
        let sum = nonAces.reduce((sum, card) => sum + this.getNumericValue(card.value), 0);

        for (let ace of aces) {
            if (sum + 11 <= 21) {
                sum += 11;
            } else {
                sum += 1;
            }
        }

        return sum
    }

    getNumericValue(value) {
        if (typeof value === "string") {
            return 10;
        }
        return value;
    }

    deal() {
        this.hit();
        this.hit();
        this.dealBtn.disabled = true;

        this.hitBtn.disabled = this.deck.cards.length <= 2;

    }

    hit() {
        this.dealerHand.push(this.deck.drawCard());
        this.playerHand.push(this.deck.drawCard());
        this.deckLengthElement.textContent = `Cards in deck: ${this.deck.cards.length}`;

        let dealerSum = this.calculateHandValue(this.dealerHand);
        let playerSum = this.calculateHandValue(this.playerHand);

        this.announcement.textContent = "Player hand value: " + playerSum;
        this.dealerHandElement.textContent = this.dealerHand.map((card, index) => index < 1 ? (card.value + card.emoji) : "[❔]").join(' •  ');
        this.playerHandElement.textContent = this.playerHand.map(card => card.value + card.emoji).join(' •  ');

        if (this.calculateHandValue(this.playerHand) >= 21) {
            this.hitBtn.disabled = true;
        }

        if (this.playerHand.length >= 2) {
            this.standBtn.disabled = false;
        }
    }

    defineWinner(dealerSum, playerSum) {
        if (dealerSum > 21 && playerSum > 21) {
            return "No winner!";
        } else if (dealerSum === playerSum) {
            return "It's a tie!";
        } else if (dealerSum > 21) {
            return "Player wins!";
        } else if (playerSum > 21) {
            return "Dealer wins!";
        } else if (playerSum > dealerSum) {
            return "Player wins!";
        } else {
            return "Dealer wins!";
        }
    }

    stand(dealerSum, playerSum) {
        if (dealerSum === 0 || playerSum === 0) throw new Error(`A hand sum is zero. No cards in the hand(s)`)

        const scorePhrase = ` Player: ${playerSum} || Dealer: ${dealerSum}`
        const winner = this.defineWinner(dealerSum, playerSum);

        this.announcement.textContent = winner + scorePhrase
        this.dealerHandElement.textContent = this.dealerHand.map(card => card.value + card.emoji).join(' • ');
        this.newRoundBtn.disabled = false;
        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;
    }

    newRound() {
        this.newRoundBtn.disabled = true;
        this.playerHand = [];
        this.dealerHand = [];
        this.dealerHandElement.textContent = "";
        this.playerHandElement.textContent = "";
        this.announcement.textContent = "";
        this.dealBtn.disabled = false;
    }

    newGame() {
        this.newRound();
        this.deck = new Deck();
        this.deckLengthElement.textContent = `Cards in deck: ${this.deck.cards.length}`;
        this.newRoundBtn.disabled = true;
        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;
    }

}

const game = new Game();
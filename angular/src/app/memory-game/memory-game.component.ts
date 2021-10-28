import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardData } from '../models/CardData';
import { RestartDialogComponentComponent } from '../restart-dialog-component/restart-dialog-component.component';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.css']
})
export class MemoryGameComponent implements OnInit {

  lives: number = 15;
  tries: number = 0;

  cardImages = [
    'book_1',
    'book_2',
    'book_3',
    'book_4',
    'book_5',
    'book_6',
    'book_7',
    'book_8',
    'book_9',
    'book_10'
  ];

  livesDoc !: HTMLElement | null;
  timeDoc !: HTMLElement | null;
  triesDoc !: HTMLElement | null;

  cards: CardData[] = [];

  flippedCards: CardData[] = [];

  matchedCount = 0;

  time: number = 0;
  display: any;
  interval: any;

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      if (this.timeDoc != null) {
        this.timeDoc.textContent = this.transform(this.time)
      }

    }, 1000);
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ' min ' + (value - minutes * 60) + ' sec';
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  resetTimer() {
    this.time = 0;
  }

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  constructor(private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.triesDoc = document.getElementById("tries");
    this.livesDoc = document.getElementById("lives");
    this.timeDoc = document.getElementById("time");
    this.setupCards();
  }

  setupCards(): void {
    this.pauseTimer();
    this.resetTimer();
    this.startTimer();

    this.cards = [];
    this.cardImages.forEach((image) => {
      const cardData: CardData = {
        imageId: image,
        state: 'default'
      };

      this.cards.push({ ...cardData });
      this.cards.push({ ...cardData });

    });




    this.setAchivments(this.lives, this.tries);
    this.cards = this.shuffleArray(this.cards);
  }

  setAchivments(lives: number, tries: number) {
    if (this.livesDoc != null) {
      this.livesDoc.textContent = lives.toString();
    }
    if (this.triesDoc != null) {
      this.triesDoc.textContent = tries.toString();
    }
  }

  cardClicked(index: number): void {
    const cardInfo = this.cards[index];

    if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
      cardInfo.state = 'flipped';
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > 1) {
        this.checkForCardMatch();
      }

    } else if (cardInfo.state === 'flipped') {
      cardInfo.state = 'default';
      this.flippedCards.pop();

    }
  }

  checkForCardMatch(): void {
    setTimeout(() => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState = cardOne.imageId === cardTwo.imageId ? 'matched' : 'default';
      cardOne.state = cardTwo.state = nextState;

      this.tries++;
      this.flippedCards = [];

      if (nextState === 'matched') {
        this.matchedCount++;

        if (this.matchedCount === this.cardImages.length) {
          const dialogRef = this.dialog.open(RestartDialogComponentComponent, {
            disableClose: true,
            data: {
              title: 'Congratulations!',
              header: 'You won game.'
            }
          });

          dialogRef.afterClosed().subscribe(() => {
            this.restart();
          });
        }
      } else {
        this.lives--;
        if (this.lives == 0) {
          const dialogRef = this.dialog.open(RestartDialogComponentComponent, {
            disableClose: true,
            data: {
              title: 'Last life lost!',
              header: 'Sorry, this time you lost. Try again.'
            }
          });

          dialogRef.afterClosed().subscribe(() => {
            this.restart();
          });
        }
      }
      this.setAchivments(this.lives, this.tries);
    }, 1000);
  }

  restart(): void {
    this.lives = 15;
    this.tries = 0;
    this.matchedCount = 0;
    this.setupCards();
  }

}

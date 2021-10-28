import { trigger, state, style, transition, animate } from '@angular/animations';
import { EventEmitter, Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CardData } from '../models/CardData';

@Component({
  selector: 'app-game-card-component',
  templateUrl: './game-card-component.component.html',
  styleUrls: ['./game-card-component.component.css'],
  animations: [
    trigger('cardFlip', [
      state('default', style({
        transform: 'none',
      })),
      state('flipped', style({
        transform: 'perspective(600px) rotateY(180deg)'
      })),
      state('matched', style({
        visibility: 'false',
        transform: 'scale(0.05)',
        opacity: 0
      })),
      transition('default => flipped', [
        animate('400ms')
      ]),
      transition('flipped => default', [
        animate('400ms')
      ]),
      transition('* => matched', [
        animate('400ms')
      ])
    ])
  ]
})
export class GameCardComponentComponent implements OnInit {

  @Input()
  data!: CardData;

  @Output() cardClicked = new EventEmitter();

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

  cards: CardData[] = [];

  constructor() { }

  ngOnInit(): void {
    this.setupCards();
  }

  setupCards(): void {
    this.cards = [];
    this.cardImages.forEach((image) => {
      const cardData: CardData = {
        imageId: image,
        state: 'default'
      };

      this.cards.push({ ...cardData });
      this.cards.push({ ...cardData });

    });

    this.cards = this.shuffleArray(this.cards);
  }

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

}

import { Seat } from './Seat';

export class Table {
  constructor(color, number, seats = []) {
    this.color = color;
    this.number = number;
    this.seats = seats.map(seat => new Seat(this.number, seat.seatNumber, seat.student));
  }
}

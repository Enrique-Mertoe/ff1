import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  @Input() message!: string;
  @Input() action = 'GOT IT';

  clearMessage() {
    this.message = null;
  }
}

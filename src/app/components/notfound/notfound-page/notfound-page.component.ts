import { Component } from '@angular/core';
import {NotFoundTemplateComponent} from "../../ui/not-found-template/not-found-template.component";

@Component({
  selector: 'app-notfound-page',
  standalone: true,
  imports: [
    NotFoundTemplateComponent
  ],
  templateUrl: './notfound-page.component.html',
  styleUrl: './notfound-page.component.scss'
})
export class NotfoundPageComponent {

}

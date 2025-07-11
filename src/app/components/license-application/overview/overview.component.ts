import {Component} from '@angular/core';
import {CustomMapComponent} from "../../ui/custom-map/custom-map.component";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CustomMapComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
}

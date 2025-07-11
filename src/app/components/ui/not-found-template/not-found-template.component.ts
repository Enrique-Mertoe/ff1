import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SpinnerService} from "../../../shared/services/spinner.service";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";

@Component({
  selector: 'app-not-found-template',
  standalone: true,
  imports: [
    ...COMMON_MODULES
  ],
  templateUrl: './not-found-template.component.html',
  styleUrl: './not-found-template.component.scss'
})
export class NotFoundTemplateComponent implements OnInit, OnChanges {
  @Input() titlePrefix = 'Page ';
  LOADED = true;
  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.visibility.subscribe( (res) => {
      this.LOADED = res;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['titlePrefix']) {
      this.titlePrefix = changes['titlePrefix']['currentValue'];
    }
  }

}

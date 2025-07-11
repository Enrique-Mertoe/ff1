import {Component} from '@angular/core';
import {Options, SimpleNotificationsModule} from "angular2-notifications";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SimpleNotificationsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  options: Options = {
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    position: ['bottom', 'right'],
    // animate: 'scale'
  };

  // surveyModel!: Model;
  // constructor(private router: Router) {
  // }
  // ngOnInit(): void {
    // const survey = new Model(schema);
    //
    // survey.onUploadFiles.add((form, options) => {
    //   console.log('File uploaded');
    //   const formData = new FormData();
    //   options.files.forEach(function (file: any) {
    //     formData.append(file.name, file);
    //   });
    // });
    // survey.locale='en';
    // survey.applyTheme(BorderlessLight);
    // this.surveyModel = survey;



    // this.router.events.subscribe((res) => {
    //   this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    // });
  // }
}

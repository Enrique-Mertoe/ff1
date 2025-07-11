import {Component, OnInit} from '@angular/core';
import {ErrorComponent} from "../../ui/error/error.component";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";
import {Model} from "survey-core";
import {SIGNUP_FORM as schema} from "../../../shared/schema/form-schema/signup-form";
import {BorderlessLight} from "survey-core/themes";
import {SurveyModule} from "survey-angular-ui";
import {AuthService} from "../../../shared/services/auth.service";
import {NotificationService} from "../../../shared/services/notification.service";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ...COMMON_MODULES,
    ErrorComponent,
    FormsModule,
    RouterLink,
    SurveyModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  // errorMessage: any;
  // Roles: any = ['Admin', 'Author', 'Reader'];

  surveyModel!: Model;
  saved = false;

  constructor(public router: Router, private authService:AuthService, private notificationService:NotificationService) {
  }

  async ngOnInit(): Promise<void> {
    if(this.authService.isLogged()) {
      this.notificationService.info("Already logged in");
      this.router.navigate(['/home']).then( ()=> {});
      return;
    }
    // schema.title = this.licenseType.name;
    // schema['description'] = this.licenseType.description;
    const survey = new Model(schema);

    survey.onUploadFiles.add((form, options) => {
      // console.log('File uploaded');
      const formData = new FormData();
      options.files.forEach(function (file: any) {
        formData.append(file.name, file);
      });
    });

    // survey.onServerValidateQuestions.add(async (sender, options) => {
    //
    // });
    survey.onCompleting.add(async (survey, options) => {
      options.allow = false;
      survey.showProgressBar= true;
      survey.clearIncorrectValues(true);

      const data = {...survey.getData()};
      if (data["confirmPassword"] !== data["password"]) {
        this.notificationService.coreError("Error", "Passwords don't match");
        return;
      }

      try {
        const eml = await this.authService.getUserByEmailAddress(data.emailAddress);
        const emailAddress = eml.emailAddress || null;
        if (emailAddress == null) {
          return;
        }
      } catch (error) {
        this.notificationService.coreError("Error", error.error.message);
        return;
      }
      data.username = data.emailAddress;
      data.coreDistrict = {id: data.coreDistrict};
      data.sysSalutation = {id: data.sysSalutation};
      data.coreCustomerType = {id: data.coreCustomerType};
      data.passportCountry = {id: data.passportCountry};
      await this.authService.register(data).then(res => {
        console.log("Created : ", res);
        this.notificationService.coreSuccess("Success", "Signup successfully! \n Check your email address to verify your email.");
        options.allow = true;
        this.router.navigateByUrl("/auth/sign-in").then( ()=> {});
      }, (error) => {
        this.notificationService.coreError("Error", "Signup error! \n " + error);
        options.allow=false;
        return;
      });

    });
    survey.onComplete.add(async (survey, options) => {
      options.showSaveInProgress();
      options.showSaveSuccess();

    });


    survey.locale = 'en';
    survey.applyTheme(BorderlessLight);
    this.surveyModel = survey;
  }

  signup(e) {
    // this.fb.signup(e.target.email.value, e.target.password.value).pipe(first()).subscribe(() => {
    //   this.router.navigateByUrl('');
    // }, (err) => {
    //   this.errorMessage = err;
    //   setTimeout(() => this.errorMessage = '', 2000);
    // });
  }

}

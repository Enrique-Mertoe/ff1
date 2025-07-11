import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SysEmailTemplate} from "../../../../shared/schema/sys-email-template";
import {SysEmailTemplateService} from "../../../../shared/services/sys-email-template.service";
import {NotificationService} from "../../../../shared/services/notification.service";
import {editorConfig} from "../../../../shared/services/data.service";
import {COMMON_MODULES} from "../../../../custom-material/custom-material.module";
import {AngularEditorModule} from "@kolkov/angular-editor";

@Component({
  selector: 'app-sys-email-templates-create',
  templateUrl: './sys-email-templates-create.component.html',
  standalone: true,
  styleUrls: ['./sys-email-templates-create.component.scss'],
  imports: [
    ...COMMON_MODULES,
    AngularEditorModule
  ]
})
export class SysEmailTemplatesCreateComponent implements OnInit{
  emailTemplateForm!: FormGroup;
  emailTemplateId: string;
  emailTemplate: SysEmailTemplate;
  config = editorConfig;
  constructor(private  builder: FormBuilder, private emailTemplateService: SysEmailTemplateService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.emailTemplateForm = this.builder.group({
        emailTemplateId: [null],
        name: [null, [Validators.required, Validators.minLength(3)]],
        status: [null, Validators.required],
        value: [null, [Validators.required, Validators.minLength(3)]]
      }
    );
    this.emailTemplateId = this.route.snapshot.params['id'];
    if(this.emailTemplateId) {
      this.initialiseData();
    }
  }
  initialiseData() {
    this.route.params.subscribe( event => {
      this.emailTemplateId = event['id'];
      if (this.emailTemplateId) {
        this.emailTemplateService.getById(this.emailTemplateId).then( (pg) => {
          this.emailTemplate = pg;
          this.emailTemplateForm.patchValue(this.emailTemplate);
        });
      }
    });
  }
  get form() {
    return this.emailTemplateForm.controls;
  }
  save() {
    if (this.emailTemplate) {
      this.emailTemplateService.update(this.emailTemplateForm.value).then( (pg) => {
        this.afterSave(pg);
      });
    } else {
      this.emailTemplateService.create(this.emailTemplateForm.value).then( (pg) => {
        this.afterSave(pg);
      });
    }
  }
  private afterSave(pc: SysEmailTemplate) {
    this.notificationService.success('Success', 'Data saved successfully');
    this.router.navigate(['system', 'sys-email-templates', 'edit', pc.id]).then(() => {});
  }
}

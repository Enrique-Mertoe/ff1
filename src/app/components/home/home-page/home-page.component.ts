import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {COMMON_MODULES} from "../../../custom-material/custom-material.module";
import {CoreLicenseTypeService} from "../../../shared/services/core-license-type.service";
import {CoreLicenseType} from "../../../shared/schema/core-license-type";
import {NotificationService} from "../../../shared/services/notification.service";
import {FormatMoneyPipe} from "../../../shared/pipes/format-money.pipe";
import {Router} from "@angular/router";

import {InvoiceComponent} from "../../ui/invoice/invoice.component";
import {QRCodeComponent} from "angularx-qrcode";
import {PermitComponent} from "../../ui/license/license.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ...COMMON_MODULES,InvoiceComponent, PermitComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HomePageComponent  implements OnInit {
  newLicenses: CoreLicenseType[];
  renewLicenses: CoreLicenseType[];
  variationLicense: CoreLicenseType[];
  transferLicense: CoreLicenseType[];
  regularDistribution = 100 / 3 + '%';

  constructor(private licenseTypeService: CoreLicenseTypeService, private notificationService: NotificationService, private router: Router) {
  }

  ngOnInit(): void {
    this.licenseTypeService.getAll().then( res => {
      this.newLicenses = res.filter(it => it.name.startsWith("New"));
      this.renewLicenses = res.filter(it => it.name.startsWith("Renewal"));
      this.variationLicense = res.filter(it => it.name.endsWith("variation"));
      this.transferLicense = res.filter(it => it.name.startsWith("Transfer"));
    });
  }

  onLicenseTypeSelect(typ: CoreLicenseType) {
    this.notificationService.coreConfirm(typ.name, typ.description + "<br>You are expected to pay application fees of MWK "
      +new FormatMoneyPipe().transform(typ.applicationFees) + " and license fees of " + new FormatMoneyPipe().transform(typ.licenseFees) + " if successful", ["Continue", "Cancel"])
      .then( res => {
        if(res) {
          this.router.navigateByUrl(`/home/${typ.id}/apply`).then( ()=> {});
          console.log("sent "+`/home/${typ.id}/apply`);
        } else {
          this.notificationService.coreInformationTimeout("info","Action cancelled");
        }
      });

  }
}

import {CommonModule} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatBadgeModule} from "@angular/material/badge";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatSortModule} from "@angular/material/sort";
import {MatRadioModule} from "@angular/material/radio";
import {MatGridListModule} from "@angular/material/grid-list";
import {FlexLayoutModule} from "ngx-flexible-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {LayoutComponent} from "../shared/layout/layout.component";
import {LimitToPipe} from "../shared/pipes/limit-to.pipe";
import {LocalDatePipe} from "../shared/pipes/local-date.pipe";
import {YesNoPipe} from "../shared/pipes/yes-no.pipe";
import {ImageThumbPipe} from "../shared/pipes/image-thumb.pipe";
import {SideNavbarComponent} from "../shared/layout/side-navbar/side-navbar.component";
import {ActiveStatusPipe} from "../shared/pipes/active-status.pipe";
import {PublishStatusPipe} from "../shared/pipes/publish-status.pipe";
import {SafeHtmlPipe} from "../shared/pipes/safe-html.pipe";
import {ControlValue} from "../shared/directives/control-value";
import {DisableControlDirective} from "../shared/directives/disable-control.directive";
import {ImagePlaceholderDirective} from "../shared/directives/image-placeholder.directive";

export const COMMON_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,

  MatSidenavModule, MatIconModule, MatToolbarModule, MatButtonModule,
  MatListModule, MatCardModule, MatProgressBarModule, MatInputModule,
  MatSnackBarModule, MatProgressSpinnerModule, MatDatepickerModule,
  MatAutocompleteModule, MatTableModule, MatDialogModule, MatTabsModule,
  MatTooltipModule, MatSelectModule, MatPaginatorModule, MatChipsModule,
  MatButtonToggleModule, MatSlideToggleModule, MatBadgeModule, MatCheckboxModule,
  MatExpansionModule, DragDropModule, MatSortModule, MatRadioModule, MatGridListModule,
  FlexLayoutModule,

  // LayoutComponent,
  LimitToPipe,
  LocalDatePipe,
  YesNoPipe,
  ImageThumbPipe,
  // SideNavbarComponent,
  ActiveStatusPipe,
  PublishStatusPipe,
  SafeHtmlPipe,
  ControlValue,
  DisableControlDirective,
  ImagePlaceholderDirective,
]


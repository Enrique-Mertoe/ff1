import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterLink,
  RouterModule
} from "./chunk-MSYTXJVK.js";
import "./chunk-RSENHDIZ.js";
import "./chunk-QUCXHSV4.js";
import {
  CommonModule,
  NgForOf,
  NgIf,
  NgStyle
} from "./chunk-ME6SNBCH.js";
import {
  Component,
  Injectable,
  Input,
  NgModule,
  setClassMetadata,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-TJ24SJOG.js";
import {
  BehaviorSubject,
  filter,
  map
} from "./chunk-P6U2JBMQ.js";
import "./chunk-KBUIKKCC.js";

// node_modules/ng-dynamic-breadcrumb/fesm2015/ng-dynamic-breadcrumb.js
var _c0 = (a0) => ({
  "background-color": a0
});
var _c1 = (a0) => ({
  "font-size": a0
});
var _c2 = (a0) => ({
  "color": a0
});
function NgDynamicBreadcrumbComponent_span_1_a_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "a", 6);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r1 = ɵɵnextContext().$implicit;
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("routerLink", item_r1 == null ? null : item_r1.url)("queryParams", item_r1 == null ? null : item_r1.queryParams)("ngStyle", ɵɵpureFunction1(4, _c2, ctx_r1.fontColor));
    ɵɵadvance();
    ɵɵtextInterpolate(item_r1.label);
  }
}
function NgDynamicBreadcrumbComponent_span_1_span_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 2);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r1 = ɵɵnextContext().$implicit;
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngStyle", ɵɵpureFunction1(2, _c2, ctx_r1.lastLinkColor));
    ɵɵadvance();
    ɵɵtextInterpolate(item_r1.label);
  }
}
function NgDynamicBreadcrumbComponent_span_1_span_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 7);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.symbol);
  }
}
function NgDynamicBreadcrumbComponent_span_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span")(1, "li", 2);
    ɵɵtemplate(2, NgDynamicBreadcrumbComponent_span_1_a_2_Template, 2, 6, "a", 3)(3, NgDynamicBreadcrumbComponent_span_1_span_3_Template, 2, 4, "span", 4)(4, NgDynamicBreadcrumbComponent_span_1_span_4_Template, 2, 1, "span", 5);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const i_r3 = ctx.index;
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngStyle", ɵɵpureFunction1(4, _c1, ctx_r1.fontSize));
    ɵɵadvance();
    ɵɵproperty("ngIf", item_r1 == null ? null : item_r1.url);
    ɵɵadvance();
    ɵɵproperty("ngIf", !(item_r1 == null ? null : item_r1.url));
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.breadcrumb.length !== i_r3 + 1);
  }
}
var NgDynamicBreadcrumbService = class {
  constructor() {
    this.breadcrumbLabels = new BehaviorSubject([]);
    this.newBreadcrumb = new BehaviorSubject([]);
  }
  updateBreadcrumbLabels(labels) {
    this.breadcrumbLabels.next(labels);
  }
  updateBreadcrumb(newBreadcrumb) {
    this.newBreadcrumb.next(newBreadcrumb);
  }
};
NgDynamicBreadcrumbService.ɵfac = function NgDynamicBreadcrumbService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgDynamicBreadcrumbService)();
};
NgDynamicBreadcrumbService.ɵprov = ɵɵdefineInjectable({
  token: NgDynamicBreadcrumbService,
  factory: NgDynamicBreadcrumbService.ɵfac,
  providedIn: "root"
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgDynamicBreadcrumbService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [];
  }, null);
})();
var NgDynamicBreadcrumbComponent = class {
  constructor(activatedRoute, router, ngDynamicBreadcrumbService) {
    this.activatedRoute = activatedRoute;
    this.router = router;
    this.ngDynamicBreadcrumbService = ngDynamicBreadcrumbService;
    this.breadcrumb = [];
    this.bgColor = "#eee";
    this.fontSize = "18px";
    this.fontColor = "#0275d8";
    this.lastLinkColor = "#000";
    this.symbol = " / ";
    this.breadCrumbData();
  }
  ngOnInit() {
    this.ngDynamicBreadcrumbService.breadcrumbLabels.subscribe((labelData) => {
      for (const label in labelData) {
        if (labelData.hasOwnProperty(label)) {
          this.breadcrumb.map((crumb) => {
            const labelParams = crumb.label.match(/[^{{]+(?=\}})/g);
            if (labelParams) {
              for (const labelParam of labelParams) {
                const dynamicData = labelData[label];
                if (labelParam === label) {
                  crumb.label = crumb.label.replace("{{" + labelParam + "}}", dynamicData);
                }
              }
            }
          });
        }
      }
    });
    this.ngDynamicBreadcrumbService.newBreadcrumb.subscribe((breadcrumb) => {
      if (breadcrumb.length > 0) {
        this.updateData(this.activatedRoute, breadcrumb);
      }
    });
  }
  breadCrumbData() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).pipe(map(() => this.activatedRoute)).pipe(map((route) => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    })).pipe(filter((route) => route.outlet === PRIMARY_OUTLET)).subscribe((route) => {
      this.params = route.snapshot.params;
      this.updateData(route, null);
    });
  }
  updateData(route, newBreadcrumb) {
    if (route.snapshot.data.breadcrumb || newBreadcrumb) {
      const data = route.snapshot.data.breadcrumb ? route.snapshot.data.breadcrumb : newBreadcrumb;
      const breadcrumb = JSON.parse(JSON.stringify(data));
      breadcrumb.map((crumb) => {
        const urlChunks = crumb.url.split("/");
        for (const chunk of urlChunks) {
          if (chunk.includes(":")) {
            const paramID = chunk.replace(":", "");
            const routerParamID = this.params[paramID];
            crumb.url = crumb.url.replace(`:${paramID}`, routerParamID);
          }
        }
        const labelParams = crumb.label.match(/[^{{]+(?=\}})/g);
        if (labelParams) {
          for (const labelParam of labelParams) {
            const routerParamID = this.params[labelParam.trim()];
            if (routerParamID) {
              crumb.label = crumb.label.replace("{{" + labelParam + "}}", routerParamID);
            } else {
            }
          }
        }
      });
      this.breadcrumb = breadcrumb;
    } else {
      this.breadcrumb = [];
    }
  }
};
NgDynamicBreadcrumbComponent.ɵfac = function NgDynamicBreadcrumbComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgDynamicBreadcrumbComponent)(ɵɵdirectiveInject(ActivatedRoute), ɵɵdirectiveInject(Router), ɵɵdirectiveInject(NgDynamicBreadcrumbService));
};
NgDynamicBreadcrumbComponent.ɵcmp = ɵɵdefineComponent({
  type: NgDynamicBreadcrumbComponent,
  selectors: [["app-ng-dynamic-breadcrumb"]],
  inputs: {
    bgColor: "bgColor",
    fontSize: "fontSize",
    fontColor: "fontColor",
    lastLinkColor: "lastLinkColor",
    symbol: "symbol"
  },
  decls: 2,
  vars: 4,
  consts: [[1, "custom-bread-crumb", 3, "ngStyle"], [4, "ngFor", "ngForOf"], [3, "ngStyle"], [3, "routerLink", "queryParams", "ngStyle", 4, "ngIf"], [3, "ngStyle", 4, "ngIf"], ["class", "line", 4, "ngIf"], [3, "routerLink", "queryParams", "ngStyle"], [1, "line"]],
  template: function NgDynamicBreadcrumbComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelementStart(0, "ul", 0);
      ɵɵtemplate(1, NgDynamicBreadcrumbComponent_span_1_Template, 5, 6, "span", 1);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵproperty("ngStyle", ɵɵpureFunction1(2, _c0, ctx.bgColor));
      ɵɵadvance();
      ɵɵproperty("ngForOf", ctx.breadcrumb);
    }
  },
  dependencies: [NgStyle, NgForOf, NgIf, RouterLink],
  styles: [".custom-bread-crumb[_ngcontent-%COMP%]{padding:10px 16px;list-style:none}.custom-bread-crumb[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:inline}.custom-bread-crumb[_ngcontent-%COMP%]   .line[_ngcontent-%COMP%]{padding-right:3px}.custom-bread-crumb[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none}.custom-bread-crumb[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#01447e;text-decoration:underline}"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgDynamicBreadcrumbComponent, [{
    type: Component,
    args: [{
      // tslint:disable-next-line: component-selector
      selector: "app-ng-dynamic-breadcrumb",
      templateUrl: "./ng-dynamic-breadcrumb.component.html",
      styleUrls: ["./ng-dynamic-breadcrumb.component.css"]
    }]
  }], function() {
    return [{
      type: ActivatedRoute
    }, {
      type: Router
    }, {
      type: NgDynamicBreadcrumbService
    }];
  }, {
    bgColor: [{
      type: Input
    }],
    fontSize: [{
      type: Input
    }],
    fontColor: [{
      type: Input
    }],
    lastLinkColor: [{
      type: Input
    }],
    symbol: [{
      type: Input
    }]
  });
})();
var NgDynamicBreadcrumbModule = class {
};
NgDynamicBreadcrumbModule.ɵfac = function NgDynamicBreadcrumbModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || NgDynamicBreadcrumbModule)();
};
NgDynamicBreadcrumbModule.ɵmod = ɵɵdefineNgModule({
  type: NgDynamicBreadcrumbModule,
  declarations: [NgDynamicBreadcrumbComponent],
  imports: [RouterModule, CommonModule],
  exports: [NgDynamicBreadcrumbComponent]
});
NgDynamicBreadcrumbModule.ɵinj = ɵɵdefineInjector({
  imports: [[RouterModule, CommonModule]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgDynamicBreadcrumbModule, [{
    type: NgModule,
    args: [{
      declarations: [NgDynamicBreadcrumbComponent],
      imports: [RouterModule, CommonModule],
      exports: [NgDynamicBreadcrumbComponent]
    }]
  }], null, null);
})();
export {
  NgDynamicBreadcrumbComponent,
  NgDynamicBreadcrumbModule,
  NgDynamicBreadcrumbService
};
//# sourceMappingURL=ng-dynamic-breadcrumb.js.map

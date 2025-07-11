// import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
// import {Observable} from "rxjs";
//
// export class ActionResolver implements Resolve<String> {
//   constructor(private NgDynamicBreadcrumbService: NgDynamicBreadcrumbService) {
//   }
//   resolve(route: ActivatedRouteSnapshot): Observable<String> | Promise<String> | String {
//     const id = route.params['id'];
//     this.NgDynamicBreadcrumbService.updateBreadcrumbLabels({action: id? 'Edit' : 'Create'});
//     return undefined;
//   }
//
// }

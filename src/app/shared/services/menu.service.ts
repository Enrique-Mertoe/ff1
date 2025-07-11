import { Injectable } from '@angular/core';
import {MenuItem} from "../models/menu-item";
import {DataService} from "./data.service";
import {AccessService} from "./access.service";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menus: MenuItem[] = [];
  paths: string[] = [];
  constructor(private dataService: DataService, private accessService: AccessService) { }
  public generate() {
    const menusCopy = JSON.parse(JSON.stringify(this.dataService.menu)) as MenuItem[];
    this.accessService.initMenu();
    this.menus = menusCopy
      .filter((elm) => {
        if (elm.global) {
          return true;
        }
        return this.accessService.canAccess(elm.id) || elm.children;
      })
      .map(elm => Object.assign(elm))
      .map((elm: MenuItem) => {
        if (!elm.children) {
          // elm.children = [];
          return elm;
        }
        elm.children = elm.children.filter(sub => {
          if (sub.global) {
            return true;
          }
          return this.accessService.canAccess(sub.id);
        });
        return elm;
      })
      //finally filter empty dropdowns
      .filter((elm) => {
        return !elm.children || (elm.children && elm.children.length > 0);
      })
    ;
    this.paths = [];
    this.menus.forEach( (m) => {
      if (!m.children) {
        this.paths.push(m.link);
      } else {
        const childrenLinks = m.children.map(l => l.link);
        this.paths = this.paths.concat(childrenLinks);
      }
    });
  }
}


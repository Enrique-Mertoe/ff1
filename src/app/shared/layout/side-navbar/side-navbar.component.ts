import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from "../../models/menu-item";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {MenuService} from "../../services/menu.service";
import {MatListItem, MatListSubheaderCssMatStyler, MatNavList} from "@angular/material/list";
import {NgForOf, NgTemplateOutlet} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatExpansionPanel, MatExpansionPanelHeader} from "@angular/material/expansion";
import {MatTooltip} from "@angular/material/tooltip";


@Component({
  standalone: true,
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
  imports: [
    MatNavList,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    MatListItem,
    MatIcon,
    MatListSubheaderCssMatStyler,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    NgForOf,
    MatTooltip
  ]
})
export class SideNavbarComponent implements OnInit {

  menuList: MenuItem[];
  constructor(private menuService: MenuService, private router: Router) { }

  ngOnInit() {
    if (this.menuService.menus.length === 0) {
      this.menuService.generate();
    }
    this.menuList = this.menuService.menus;
  }

  isLinkActive(menuLink: string) {
    return this.router.url.startsWith(menuLink); // !== s;
  }
  // isActive(instruction: any[]): boolean {
  // Set the second parameter to true if you want to require an exact match.
  // return this.router.isActive(this.router.createUrlTree(instruction), false);
  //   return false;
  // }

  isLinkActive2(link: string) {
    const path = this.router.url.includes('edit')? '/edit' : this.router.url.includes('create')? '/create': '';
    if (path.trim().length > 0) {
      return this.router.url.startsWith(link+path.trim());
    }
    return this.router.url === link;
  }
}

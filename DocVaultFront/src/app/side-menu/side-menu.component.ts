import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  constructor( private router : Router ) { }

  logout() {
    localStorage.clear();  
    // Redirection vers la page de login après déconnexion
    this.router.navigate(['/login']);
  }

}

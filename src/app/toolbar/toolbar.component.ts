import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLinkWithHref, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLinkWithHref, RouterLinkActive, MatMenuModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

}

import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
})
export class RootComponent {
  constructor(private titleService: Title, private appComponent: AppComponent) {
    this.titleService.setTitle(this.appComponent.title);
  }
}

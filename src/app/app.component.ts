import { Component, OnInit } from '@angular/core';
import '@cds/core/icon/register.js';
import { ClarityIcons } from '@cds/core/icon';
import { AppConfigService } from './app-config.service';
import { themes } from './terminals/terminal-themes/themes';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private Config = this.config.getConfig();
  public title = this.Config.title || "BashBrawl";
  private logo = this.Config.logo || '/assets/bashbrawl/bashbrawl_text.png';

  public themes = themes;

  constructor(
    private config: AppConfigService,
  ) {
    this.config.getLogo(this.logo).then((obj: string) => {
      ClarityIcons.addIcons(['logo', obj]);
    });

    if (this.Config.favicon) {
      const fi = <HTMLLinkElement>document.querySelector('#favicon');
      fi.href = this.Config.favicon;
    }
  }

  ngOnInit(): void {
    
  }

}

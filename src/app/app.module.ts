import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { RootComponent } from './root.component';
import { HomeComponent } from './home.component';
import { BashbrawlterminalComponent } from './terminals/bashbrawl/bashbrawlterminal.component';
import { HttpClientModule } from '@angular/common/http';
import { AtobPipe } from './pipes/atob.pipe';
import { UppercasePipe } from './pipes/uppercase.pipe';
import { SettingsService } from './services/settings.service';
import { AppConfigService } from './app-config.service';
import { AngularSplitModule } from 'angular-split';
import { APIClientFactory } from './services/api.service';
import { LanguageCommandService } from './terminals/bashbrawl/languages/language-command.service';
import { ScoreService } from './services/score.service';
import '@cds/core/icon/register.js';
import {
  ClarityIcons,
  terminalIcon,
} from '@cds/core/icon';

ClarityIcons.addIcons(
  terminalIcon,
);

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    HomeComponent,
    BashbrawlterminalComponent,
    AtobPipe,
    UppercasePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    HttpClientModule,
    AngularSplitModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AppComponent,
    SettingsService,
    AppConfigService,
    APIClientFactory,
    LanguageCommandService,
    ScoreService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService],
    },
  ],
  bootstrap: [RootComponent],
})
export class AppModule {}

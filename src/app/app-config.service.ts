import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface Config {
  title: string;
  favicon: string;
  login: {
    logo: string;
    background: string;
  };
  logo: string;
  about: {
    title: string;
    body: string;
  };
}

@Injectable()
export class AppConfigService {
  private appConfig: Config;

  constructor(private http: HttpClient) {}

  loadAppConfig() {
    return lastValueFrom(this.http.get<Config>('/config.json')).then((data) => {
      this.appConfig = data;
    });
  }

  getLogo(logoPath: string) {
    const headers = new HttpHeaders();
    headers.set('Accept', '*');
    return lastValueFrom(
      this.http.get(logoPath, { headers, responseType: 'text' }),
    );
  }

  getConfig() {
    return this.appConfig;
  }
}

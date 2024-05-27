import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse } from '../ServerResponse';
import { atou } from '../unicode';
import { environment } from 'src/environments/environment';

type APIClientDefaults = {
  get<T = ServerResponse>(path: string): Observable<T>;
  post<T = ServerResponse>(path: string, body: any): Observable<T>;
  put<T = ServerResponse>(path: string, body: any): Observable<T>;
  delete<T = ServerResponse>(path: string): Observable<T>;
};

export type GargantuaClient = APIClientDefaults &
  Pick<HttpClient, keyof APIClientDefaults>;

@Injectable()
export class APIClientFactory {
  constructor(private http: HttpClient) {}

  scopedClient(prefix: string): GargantuaClient {
    const baseUrl = environment.server + prefix;
    return this.buildPRoxy(baseUrl);
  }

  scopedShellClient(shellEndpoint: string, prefix: string): GargantuaClient {
    const baseUrl = shellEndpoint + prefix;
    return this.buildPRoxy(baseUrl);
  }

  private buildPRoxy(baseUrl: string): HttpClient {
    return new Proxy(this.http, {
      get(target, key) {
        const prop = (target as any)[key];
        return typeof prop === 'function'
          ? (path: string, ...args: any[]) =>
              prop.call(target, baseUrl + path, ...args)
          : prop;
      },
    });
  }
}

export const extractResponseContent = (s: ServerResponse) =>
  JSON.parse(atou(s.content));

import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, retry } from 'rxjs';
import { AppConfig } from '@app/interfaces/AppConfig';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public config: BehaviorSubject<AppConfig | undefined>;
  public readonly events: Observable<AppConfig | undefined>;

  public constructor(private http: HttpClient) {
    this.config = new BehaviorSubject<AppConfig | undefined>(undefined);
    this.events = this.config.asObservable();
  }

  public refresh(): Observable<void> {
    return this.http.get<AppConfig>('/api/config').pipe(
      retry(3),
      map(c => {
        this.setConfig(c);
      }),
    );
  }

  private setConfig(config?: AppConfig): void {
    this.config.next(config);
  }
}

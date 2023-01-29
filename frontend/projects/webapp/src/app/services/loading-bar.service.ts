import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum LoadingBarEventType {
  color,
  progress,
  visible,
}

type LoadingBarEventParameter<T> = T extends LoadingBarEventType.color
  ? {
      type: LoadingBarEventType.color;
      value: string;
    }
  : T extends LoadingBarEventType.progress
  ? {
      type: LoadingBarEventType.progress;
      value: number;
    }
  : {
      type: LoadingBarEventType.visible;
      value: boolean;
    };

export class LoadingBarEvent<T = LoadingBarEventType, V = LoadingBarEventParameter<T>['value']> {
  public constructor(public type: T, public value?: V) {}

  public is<ST extends T>(key: ST): this is LoadingBarEventParameter<ST> {
    return this.type === key;
  }
}

/**
 * Check and return true if an object not undefined or null
 */
export function isPresent<T>(obj: T | undefined | null): obj is T {
  return obj !== undefined && obj !== null;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingBarService {
  private _progress = 0;
  private _color = 'firebrick';
  private _visible = true;

  private intervalCounterId: number | undefined;
  public interval = 500;

  private eventSource: Subject<LoadingBarEvent> = new Subject<LoadingBarEvent>();
  public events: Observable<LoadingBarEvent> = this.eventSource.asObservable();

  public set progress(value: number) {
    if (isPresent(value)) {
      if (value > 0) {
        this.visible = true;
      }
      this._progress = value;
      this.emitEvent(new LoadingBarEvent(LoadingBarEventType.progress, this._progress));
    }
  }

  public get progress(): number {
    return this._progress;
  }

  public set color(value: string) {
    if (isPresent(value)) {
      this._color = value;
      this.emitEvent(new LoadingBarEvent(LoadingBarEventType.color, this._color));
    }
  }

  public get color(): string {
    return this._color;
  }

  public set visible(value: boolean) {
    if (isPresent(value)) {
      this._visible = value;
      this.emitEvent(new LoadingBarEvent(LoadingBarEventType.visible, this._visible));
    }
  }

  public get visible(): boolean {
    return this._visible;
  }

  private emitEvent(event: LoadingBarEvent): void {
    if (this.eventSource) {
      // Push up a new event
      this.eventSource.next(event);
    }
  }

  public start(onCompleted?: () => void): void {
    // Stop current timer
    this.stop();
    // Make it visible for sure
    this.visible = true;
    // Run the timer with milliseconds iterval
    this.intervalCounterId = window.setInterval(() => {
      // Increment the progress and update view component
      this.progress++;
      // If the progress is 100% - call complete
      if (this.progress === 100) {
        this.complete(onCompleted);
      }
    }, this.interval);
  }

  public stop(): void {
    if (this.intervalCounterId) {
      window.clearInterval(this.intervalCounterId);
      this.intervalCounterId = undefined;
    }
  }

  public reset(): void {
    this.stop();
    this.progress = 0;
  }

  public complete(onCompleted?: () => void): void {
    this.progress = 100;
    this.stop();
    setTimeout(() => {
      // Hide it away
      this.visible = false;
      setTimeout(() => {
        // Drop to 0
        this.progress = 0;
        if (onCompleted) {
          onCompleted();
        }
      }, 250);
    }, 250);
  }
}

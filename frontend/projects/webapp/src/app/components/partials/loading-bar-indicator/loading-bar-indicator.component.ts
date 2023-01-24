import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit
} from '@angular/core'
import {isPresent, LoadingBarEventType, LoadingBarService} from '@app/services/loading-bar.service'

@Component({
  selector: 'app-loading-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loading-bar-indicator.component.html',
  styleUrls: ['./loading-bar-indicator.component.css']
})
export class LoadingBarIndicatorComponent implements OnInit, AfterViewInit {
  protected isTransition = 'none'
  private _progress = 0

  @Input()
  public set progress(progress: number) {
    this.isTransition = progress >= this._progress ? 'all 0.5 ease-in-out' : 'none'
    this._progress = progress
  }

  public get progress(): number {
    return this._progress
  }

  @Input() public color = ''
  @Input() public show = true

  public constructor(
    public service: LoadingBarService,
    private _elmRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.service.events.subscribe((event) => {
      if (event.is(LoadingBarEventType.progress) && isPresent(event.value)) {
        this.progress = event.value
      } else if (event.is(LoadingBarEventType.color)) {
        this.color = event.value
      } else if (event.is(LoadingBarEventType.visible)) {
        this.show = event.value
      }
    })
  }

  public ngAfterViewInit(): void {
    this.service.events.subscribe((event) => {
      this._elmRef.nativeElement.visible = event.is(LoadingBarEventType.visible)
        ? event.value
        : true

      this._changeDetectorRef.detectChanges()
    })
  }
}

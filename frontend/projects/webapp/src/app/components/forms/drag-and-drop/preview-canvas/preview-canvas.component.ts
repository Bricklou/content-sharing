import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-preview-canvas',
  templateUrl: './preview-canvas.component.html',
  styleUrls: ['./preview-canvas.component.css'],
})
export class PreviewCanvasComponent implements AfterViewInit {
  @Input() public file?: File;
  @Input() public width = 200;
  @Input() public height = 200;

  @ViewChild('canvas') public canvas?: ElementRef<HTMLCanvasElement>;

  protected context?: CanvasRenderingContext2D;

  public ngAfterViewInit(): void {
    const ctx = this.canvas?.nativeElement.getContext('2d');
    console.log('test', ctx, this.file);
    if (!ctx || !this.file) return;
    this.context = ctx;

    this.context.fillStyle = 'white';
    const img = new Image();
    img.onload = () => {
      // Resize the image (keeping the aspect ratio) and draw it on the rectangular canvas in the center
      const ratio = Math.min(this.width / img.width, this.height / img.height);
      const x = (this.width - img.width * ratio) / 2;
      const y = (this.height - img.height * ratio) / 2;
      this.context?.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        x,
        y,
        img.width * ratio,
        img.height * ratio,
      );
    };
    img.src = URL.createObjectURL(this.file);
  }
}

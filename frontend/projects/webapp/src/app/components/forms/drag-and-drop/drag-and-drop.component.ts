import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DragAndDropComponent),
      multi: true,
    },
  ],
})
export class DragAndDropComponent implements ControlValueAccessor {
  @Input() public dragAreaClass = '';
  @Input() public darkMode?: boolean = false;
  @Input() public multiple?: boolean = false;
  @Input() public accept: string[] = ['*'];
  @Input() public disabled?: boolean = true;
  @Input() public enablePreviews?: boolean = false;
  @Input() public previewSize = 150;

  protected isDragging = false;
  protected uploadedFiles: File[] = [];

  /*eslint-disable @typescript-eslint/no-empty-function*/

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange = (_: File[]) => {};
  protected onTouch = () => {};

  /* eslint-enable @typescript-eslint/no-empty-function */

  public constructor(private http: HttpClient) {}

  @ViewChild('fileInput')
  protected fileInput?: ElementRef<HTMLInputElement>;

  public onFileChange(event: Event) {
    const el = event.currentTarget as HTMLInputElement;
    const filesList: File[] = [];

    if (!el.files) return;

    for (let i = 0; i < el.files.length; i++) {
      if (!this.isAccepted(el.files[i])) continue;

      filesList.push(el.files[i]);
    }

    this.saveFiles(filesList);
  }

  public onDragEnter(event: DragEvent) {
    event.preventDefault();

    if (!event.dataTransfer?.files) return;

    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      if (this.isAccepted(event.dataTransfer.files[i])) {
        this.isDragging = true;
        break;
      }
    }
  }

  public onClick() {
    if (!this.fileInput) return;
    this.fileInput.nativeElement.click();
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (!event.dataTransfer?.files) return;

    if (event.dataTransfer.files) {
      const fileList = event.dataTransfer.files;

      const files: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        if (!this.isAccepted(fileList[i])) continue;
        files.push(fileList[i]);
      }

      this.saveFiles(files);
    }
  }

  public saveFiles(files: File[]) {
    if (files.length <= 0 || !this.fileInput) return;

    if (!this.multiple) {
      this.uploadedFiles = [files[0]];
    } else {
      this.uploadedFiles.push(...files);
    }
  }

  public removeFile(file: File) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }

  public addImageByUrl(imageUrl: string) {
    this.http
      .get(`/api/proxy`, {
        params: {
          url: encodeURIComponent(imageUrl),
        },
        responseType: 'blob',
      })
      .subscribe(response => {
        const file = new File([response], 'image.png', { type: 'image/png' });

        this.saveFiles([file]);
      });
  }

  private isAccepted(file: File): boolean {
    const reg = new RegExp(this.accept.join('|').replace(/\*/g, '.*'));
    return reg.test(file.type);
  }

  public isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  public registerOnChange(fn: (files: File[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(files: File[]): void {
    if (files) {
      this.saveFiles(files);
    }
  }
}

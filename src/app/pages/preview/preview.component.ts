import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {
  @Input() data: any;
  @Output() dataEvent = new EventEmitter<string>();

  onClickEditModeHandler() {
    this.dataEvent.emit();
  }


  getPictureUrl(picture: File) {
    return picture ? URL.createObjectURL(picture) : '';
  }

}

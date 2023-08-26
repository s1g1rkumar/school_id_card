import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonApiService } from 'src/app/_services/common-api.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {
  constructor(private commonApi:CommonApiService) { }
  @Input() data: any;
  @Output() dataEvent = new EventEmitter<string>();

  onClickEditModeHandler() {
    this.dataEvent.emit();
  }
  url='http://localhost:5000/v1/users';

  getPictureUrl(picture: File) {
    return picture ? URL.createObjectURL(picture) : '';
  }

  
   getFormData(object:any) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}

  onClickSubmit(){
    console.log(this.data,"thsi")
      if(this.data){
        const formData=this.getFormData(this.data)
        this.commonApi.createUser(formData).subscribe({
          next:(response:any)=>{
            console.log(response);
          },error:(err:any)=>{
            console.log(err)
          }
        })
      }
  }

}

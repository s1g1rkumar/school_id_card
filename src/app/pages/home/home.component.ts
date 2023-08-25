import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  classList: string[] = ['I', "II", "III", "IV", "V", "VI", "VII", "VIII", "XI", "X", "XI", "XII"]
  bloodGroup: string[] = ["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"]
  isPreview: Boolean = false;
  data: any;

  editModeHandler() {
    this.isPreview = false;
  }


  addForm: FormGroup = new FormGroup({
    picture: new FormControl(null, [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    admission_number: new FormControl(0, [Validators.required]),
    mobile_number: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    class: new FormControl("I", [Validators.required]),
    roll_number: new FormControl('', [Validators.required]),
    dob: new FormControl(Date, [Validators.required]),
    father_name: new FormControl('', [Validators.required]),
    mother_name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    house_name: new FormControl('', [Validators.required]),
    blood_group: new FormControl('A+', [Validators.required]),
    transportation: new FormControl('Yes', [Validators.required])
  });

  addFormSubmit() {
    console.log(this.addForm.value)
    if (this.addForm.valid) {
      this.data = this.addForm.value;
      this.isPreview = true;

    } else {
      console.log(this.addForm.value)
    }
  }


  fileUpload(event: any) {
    const file = event.target.files[0];
    this.addForm.patchValue({
      picture: file
    })
  }


  getPictureUrl(picture: File) {
    return picture ? URL.createObjectURL(picture) : '';
  }
}

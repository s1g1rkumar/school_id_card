import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonApiService } from 'src/app/_services/common-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  classList: any[] = [{label:'Select'},{label:'I',value:'I'}, {label:'II',value:'II'}, {label:'III',value:'III'}, {label:'IV',value:'IV'}, {label:'V',value:'V'}, {label:'VI',value:'VI'}
  , {label:'VII',value:'VII'}, {label:'VIII',value:'VIII'}, {label:'IX',value:'IX'},{label:'X',value:'X'},{label:'XI',value:'XI'}, {label:'XII',value:'XII'}]
  sectionList:any[]=[{label:'Select'},{label:'A',value:'A'},{label:'B',value:'B'},{label:'C',value:'C'},{label:'D',value:'D'}]
  bloodGroupList: any[] = [{label:'Select'},{label:'A+',value:'A+'},{label:'A-',value:'A-'}, {label:'B+',value:'B+'}, {label:'B-',value:'B-'}, {label:'O+',value:'O+'}, {label:'O-',value:'O-'}, {label:'AB+',value:'AB+'}, {label:'AB-',value:'AB-'}]
  facultyList: any[] = [{label:'Select'},{label:'Arts',value:'Arts'},{label:'Commerce',value:'Commerce'},{label:'Science',value:'Science'},{label:'N/A',value:'N/A'}]
  genderList:any[]=[{label:'Select'},{label:'Male',value:'Male'},{label:'Fe-Male',value:'Fe-Male'},{label:'Other',value:'Other'}]
  categoryList:any[]=[{label:'Select'},{label:'ST',value:'ST'},{label:'SC',value:'SC'},{label:'BC-I',value:'BC-I'},{label:'BC-II',value:'BC-II'},{label:'General',value:'General'}]
  religionList:any[]=[{label:'Select'},{label:'Hinduism',value:'Hinduism'},{label:'Islam',value:'Islam'},{label:'Christianity',value:'Christianity'},{label:'Sikhism',value:'Sikhism'},{label:'Buddhism',value:'Buddhism'},{label:'Jainism',value:'Jainism'},{label:'Zoroastrianism',value:'Zoroastrianism'},{label:'Other Religions',value:'Other Religions'}]
  transportationList:any[]=[{label:'Select'},{label:'Yes',value:'Yes'},{label:'No',value:'No'}]
  isPreview: Boolean = false;
  data: any;
  pictureUrl: any = '';
  schoolDetails: any;
  enableFacultyfield: boolean = false;
  addForm: any;

  // fwidth: string = 'f-width';
  fwidth: { [klass: string]: any } = { 'f-width': true };

  constructor(private route: ActivatedRoute, private router: Router, http: HttpClient, private commonApi: CommonApiService, private formBuilder: FormBuilder) {
    this.addForm = this.formBuilder.group({
      basic_details: new FormGroup({}),
      parent_details: new FormGroup({}),
      communication_details: new FormGroup({}),
      other_details: new FormGroup({})
    });
  }


  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        // console.log(params); // { category: "fiction" }

        localStorage.setItem('school_code', params['school_code']);
        if (params['school_code']) {
          this.getSchoolDetails();
          // this.addForm.patchValue({
          //   school_code: params['school_code'],
          //   school_name:params['school_name']
          // })
        }
        // console.log(this.category); // fiction
      });



  }

  getSchoolDetails() {
    this.commonApi.getSchoolDetails().subscribe({
      next: (response: any) => {
        console.log("response,", response);
        this.schoolDetails = response;
        // console.log("School", this.schoolDetails.field);
        this.addCustomControl(this.schoolDetails.field);
        console.log("fields =>", this.addForm.value);

        this.addForm.get('other_details').patchValue({
            school_name: response.school_name,
            school_code: response.school_code
          })
        console.log("fields 2=>", this.addForm.value);
      }, error: (err: any) => {
        console.log(err)

      }
    })


  }

  editModeHandler() {
    this.isPreview = false;
  }
  submitClearData() {
    this.addForm.reset();
    this.isPreview = false;
    this.data = null;
    this.pictureUrl = '';
    this.resetQueryParams();
    this.enableFacultyfield = false;
  }

  resetQueryParams() {
    // Get the current route's URL without query parameters
    const urlWithoutQueryParams = this.router.createUrlTree([], { relativeTo: this.route }).toString();

    // Navigate to the same route without query parameters
    this.router.navigateByUrl(urlWithoutQueryParams);
  }

  addCustomControl(fields: any) {
    // Create a custom form control dynamically
    delete fields._id;
    for (const key of Object.keys(fields)) {
      if (fields[key]) {
        console.log("f key", key);
        switch (key) {
          case 'basic_details':
            for (const k of Object.keys(fields[key])) {
              let customControl = this.formBuilder.control('');
              this.addForm.controls[`${key}`].addControl(`${k}`, customControl);
            }
            break;
          case 'parent_details':
            for (const k of Object.keys(fields[key])) {
              let customControl = this.formBuilder.control('');
              this.addForm.controls[`${key}`].addControl(`${k}`, customControl);
              }
            break;
          case 'communication_details':
            for (const k of Object.keys(fields[key])) {
              let customControl = this.formBuilder.control('');
              this.addForm.controls[`${key}`].addControl(`${k}`, customControl);
              }
            break;
          case 'other_details':
            for (const k of Object.keys(fields[key])) {
              let customControl = this.formBuilder.control('');
              this.addForm.controls[`${key}`].addControl(`${k}`, customControl);
              }
            break;
        }
      } else {
        continue;
      }
    }
  }

  addFormSubmit() {
    console.log(this.addForm.value)
    if (this.addForm.valid) {
      console.log("if part", this.addForm.value)
      this.data = { ...this.addForm.value};
      this.isPreview = true;

    } else {

      console.log("fill form correctly", this.addForm.value)
    }
  }


  fileUpload(event: any) {
    const file = event.target.files[0];
    console.log("file is", file)
    this.addForm.get('basic_details').patchValue({
      picture: file
    })
    this.pictureUrl = this.getPictureUrl(file);
  }


  getPictureUrl(picture: File) {
    return picture ? URL.createObjectURL(picture) : '';
  }

  get name() {
    return this.addForm.get('name');
  }
  get admission_no() {
    return this.addForm.get('admission_no');
  }
  get roll_no() {
    return this.addForm.get('roll_no');
  }
  get mobile_no() {
    return this.addForm.get('mobile_no');
  }
  get class() {
    return this.addForm.get('class');
  }
  get faculty() {
    return this.addForm.get('faculty');
  }
  get dob() {
    return this.addForm.get('dob');
  }
  get father_name() {
    return this.addForm.get('father_name');
  }
  get mother_name() {
    return this.addForm.get('mother_name');
  }
  get address() {
    return this.addForm.get('address');
  }
  get house_name() {
    return this.addForm.get('house_name');
  }
  get blood_group() {
    return this.addForm.get('blood_group');
  }
  get transportation() {
    return this.addForm.get('transportation');
  }
  get school_code() {
    return this.addForm.get('school_code');
  }
  get school_name() {
    return this.addForm.get('school_name');
  }

  VALIDATION_MESSAGES = {
    name: {
      required: 'Name Required',
      minlength: 'Minimum three digit required',
      maxlength: 'Maximun fifty digit allowed',
      match: "Please enter valid name"
    },
    password: {
      required: 'Required',
      minlength: 'The password length must be greater than or equal to 8'
    },
    confirmPassword: {
      required: 'Required',
      match: 'Password does not match'
    },
    firstName: {
      required: 'Required'
    },
    lastName: {
      required: 'Required'
    }
  };

  checkFieldValue(event: any): void {
    let value = event.target.value;
    if (value === "IX" || value === "X" || value === "XI" || value === "XII") {
      this.enableFacultyfield = true;
    } else {
      this.enableFacultyfield = false;
    }

  }

}

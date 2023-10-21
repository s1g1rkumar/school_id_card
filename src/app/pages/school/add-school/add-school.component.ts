import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validator, Validators, FormBuilder, FormArray } from "@angular/forms"
import { HttpClient } from "@angular/common/http"
import { CommonApiService } from 'src/app/_services/common-api.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { MenuItem, MessageService } from 'primeng/api';
import { SelectItemGroup } from 'primeng/api';


@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss'],
  providers: [MessageService]
})
export class AddSchoolComponent {
  @Input() editData: any;
  constructor(http: HttpClient, private commonApi: CommonApiService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private messageService: MessageService) {
  }
  items: MenuItem[] | undefined = [
    {
      label: 'show',
      items: [
        {
          label: 'Desciption',
          // icon: 'pi pi-refresh',
          command: (data: any,) => {
            console.log("Desciption clicked", data)
          }
        },
        {
          label: 'Validation',
          // icon: 'pi pi-times',
          command: () => {
            console.log("Validation clicked")
          }
        }
      ]
    },
  ];
  isPreview: Boolean = false;
  isUpdate: Boolean = false;
  data: any;
  pictureUrl: any = '';
  id: any = ""
  step: any = 2;
  products: string[] = ['a'];
  fieldTypeList = [
    {
      label: 'Input',
      value: 'input',
      items: [{ label: "Text", value: "text" },
      { label: "Number", value: "number" },
      { label: "File", value: "file" },
      { label: "Date", value: "date" },
      { label: "Time", value: "time" },
      { label: "Datetime", value: "datetime" },
      { label: "Email", value: "email" },
      { label: "Password", value: 'password' },
      { label: "URL", value: "url" },
      { label: "Color", value: "color" },
      ],
    },
    {
      label: "Select",
      value: 'select',
      items: [{ label: "Dropdown", value: "dropdown" },
      { label: "Mutiple Choice", value: "radio" },
      { label: "Checkbox", value: "checkbox" }]
    }
  ]

  validationTypeList = [{label:'Length',value:'length'},{ label: "Pattern", value: 'expression' }]
  lengthTypeList = [{ label: 'select' }, { label: "Min-Length", value: "minlength" }, { label: "Max-Length", value: "maxlength" }]
  rangeTypeList = [{ label: "Minimum", value: "min" }, { label: "Maximum", value: "max" }]
  // myForm: any=new FormGroup({});
  myForm: any;
  ngOnInit() {
    this.myForm = this.fb.group({
      sections: this.fb.array([this.fb.group({
        section_name: ['', Validators.required],
        section_desc: ['', Validators.required],
        items: this.fb.array([this.fb.group({
          field_name: ['', Validators.required],
          field_type: ['text', Validators.required],
          field_description: [''],
          field_description_show: false,
          field_required: [false, Validators.required],
          field_validation_type: [{ label: "Length", value: 'length' }],
          field_validation_sub_type: [''],
          field_validation_value: [''],
          field_validation_message: [''],
          field_options: this.fb.array([this.fb.group({
            label: [''],
          })]),
        })])
      })]),
      organisationDetails: this.fb.group({
        logo: ['', Validators.required],
        code: ['', Validators.required],
        name: ['', Validators.required],
        board: ['', Validators.required],
        branch: ['', Validators.required],
        phone: ['', Validators.required],
        website: ['', Validators.required],
        address: ['', Validators.required],
        pincode: ['', Validators.required],
        email: ['', Validators.required],
      }),
      themeDetails: this.fb.group({
        primary_color: ['', Validators.required],
        secondary_color: ['', Validators.required],
        primary_font: ['', Validators.required],
        secondary_font: ['', Validators.required],
        theme_color: ['', Validators.required]
      })
    });
    console.log("items", this.sections)
    // console.log("fb value",this.myForm.value)

    // if(this.editData){
    //   this.schoolForm.patchValue(this.editData);
    // }
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      console.log("id", this.id);
      if (this.id) {
        this.commonApi.getSchoolDetail(this.id).subscribe({
          next: (response: any) => {
            console.log(response);
            this.schoolForm.patchValue(response);
            this.pictureUrl = response.logo;
            this.isUpdate = true;
          }, error: (err: any) => {
            console.log(err)

          }
        })
      }

    });
  }



  schoolForm: any = new FormGroup({
    logo: new FormControl(null, [Validators.required]),
    school_code: new FormControl('', [Validators.required]),
    school_name: new FormControl('', [Validators.required]),
    board: new FormControl('', [Validators.required]),
    branch: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    website: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    field: new FormGroup({
      basic_details: new FormGroup({
        name: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('1', [Validators.required]),
        }),
        admission_no: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('2', [Validators.required]),
        }),
        class: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('3', [Validators.required]),
        }),
        section: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('4', [Validators.required]),
        }),
        roll_no: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('5', [Validators.required]),
        }),
        admission_date: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('6', [Validators.required]),
        }),
        dob: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('7', [Validators.required]),
        }),
        gender: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('8', [Validators.required]),
        }),
        category: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('9', [Validators.required]),
        }),
        religion: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('10', [Validators.required]),
        }),
        picture: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('11', [Validators.required]),
        }),
      }),
      parent_details: new FormGroup({
        father_name: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('1', [Validators.required]),
        }),
        father_occupation: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('2', [Validators.required]),
        }),
        mother_name: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('3', [Validators.required]),
        }),
        mother_occupation: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('4', [Validators.required]),
        }),
        father_annual_income: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('5', [Validators.required]),
        }),
        mother_annual_income: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('6', [Validators.required]),
        }),
      }),
      communication_details: new FormGroup({
        mobile_no: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('1', [Validators.required]),
        }),
        whatsapp_no: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('2', [Validators.required]),
        }),
        mail_id: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('3', [Validators.required]),
        }),
        transportation: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('4', [Validators.required]),
        }),
        address: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('5', [Validators.required]),
        }),
      }),
      other_details: new FormGroup({
        aadhar_no: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('1', [Validators.required]),
        }),
        blood_group: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('2', [Validators.required]),
        }),
        faculty: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('3', [Validators.required]),
        }),
        admitted_in: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('4', [Validators.required]),
        }),
        house_name: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('5', [Validators.required]),
        }),
        school_code: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('6', [Validators.required]),
        }),
        school_name: new FormGroup({
          active: new FormControl(true, Validators.required),
          mandatory: new FormControl(true, [Validators.required]),
          order: new FormControl('7', [Validators.required]),
        }),
      }),
    }),
    theme: new FormGroup({
      primary_color: new FormControl('', [Validators.required]),
      secondary_color: new FormControl('', [Validators.required]),
      primary_font: new FormControl('', [Validators.required]),
      secondary_font: new FormControl('', [Validators.required]),
      theme_color: new FormControl('', [Validators.required])
    })
  })


  getFormData(object: any) {
    const formData = new FormData();
    Object.keys(object).forEach(key => {
      if (typeof object[key] != "object") {
        formData.append(key, object[key]);
      }
      else {
        console.log("length", Object.keys(object[key]).length, "--", Object.keys(object[key]));
        if (Object.keys(object[key]).length === 0) {
          formData.append(key, object[key]);
        } else {
          formData.append(key, JSON.stringify(object[key]));
        }
        console.log("key", key, "object", object[key], "typeof", typeof object[key])
      }

    });
    console.log("foemData", formData);
    return formData;

  }

  schoolFormSubmit() {
    console.log(this.schoolForm.value)
    if (this.schoolForm.valid) {
      console.log("if part", this.schoolForm.value)
      this.isPreview = true;
      const formData = this.getFormData(this.schoolForm.value);
      if (this.isUpdate) {
        this.commonApi.updateSchool(this.id, formData).subscribe({
          next: (response: any) => {
            console.log(response);
            Swal.fire("Form Updated successfully.", ``, "success");
            // this.onClickSubmitHandler();
            this.schoolForm.reset();
            this.pictureUrl = "";
            this.isUpdate = false;
            this.id = "";

          }, error: (err: any) => {
            Swal.fire("Unable to update school", `please try again!`, "error");
            console.log(err)
            // this.onClickEditModeHandler();

          }
        })
      } else {
        this.commonApi.createSchool(formData).subscribe({
          next: (response: any) => {
            console.log(response);
            Swal.fire("Form submitted successfully.", ``, "success");
            // this.onClickSubmitHandler();
            this.schoolForm.reset();
            this.pictureUrl = "";

          }, error: (err: any) => {
            Swal.fire("Unable to submit your application", `please try again!`, "error");
            console.log(err)
            // this.onClickEditModeHandler();

          }
        })
      }
    } else {

      console.log("fill form correctly", this.schoolForm.value)
    }
  }

  fileUpload(event: any) {
    const file = event.target.files[0];
    console.log("file is", file)
    this.myForm.get('organisationDetails').get('logo').patchValue(file);
    this.pictureUrl = this.getPictureUrl(file);
  }


  getPictureUrl(picture: File) {
    return picture ? URL.createObjectURL(picture) : '';
  }

  addItem(s: number) {
    console.log("add 1", this.myForm.get('sections').get([s]).get('items'))
    const item = this.fb.group({
      field_name: ['', Validators.required],
      field_type: ['text', Validators.required],
      field_description: [''],
      field_required: [false, Validators.required],
      field_validation_type: [{ label: "Length", value: 'length' }],
      field_validation_sub_type: [''],
      field_validation_value: [''],
      field_validation_message: [''],
      field_options: this.fb.array([this.fb.group({
        label: [''],
      })])
    });
    this.myForm.get('sections').get([s]).get('items').push(item);
    console.log("add 2", this.myForm.get('sections').get([s]).get('items'))
  }

  addSection() {
    const section = this.fb.group({
      section_name: ['', Validators.required],
      section_desc: ['', Validators.required],
      items: this.fb.array([this.fb.group({
        field_name: ['', Validators.required],
        field_type: ['text', Validators.required],
        field_description: [''],
        field_required: [false, Validators.required],
        field_validation_type: [{ label: "Length", value: 'length' }],
        field_validation_sub_type: [''],
        field_validation_value: [''],
        field_validation_message: [''],
        field_options: this.fb.array([this.fb.group({
          label: [''],
        })])
      })])
    });
    // Add the new item to the FormArray
    this.sections.push(section);
    // console.log("section",this.sections)
  }

  removeSection(index?: number) {
    // Remove the item at the specified index from the FormArray
    this.sections.removeAt(index);
  }

  removeItem(s: number, i: number) {
    // Remove the item at the specified index from the FormArray
    this.myForm.get('sections').get([s]).get('items').removeAt(i);
  }

  addOptions(s: number, i: number, fo: number) {
    const options = this.fb.group({
      label: [''],
    })
    this.myForm.get('sections').get([s]).get('items').get([i]).get('field_options').push(options);
  }

  removeOptions(s: number, i: number, fo: number) {
    this.myForm.get('sections').get([s]).get('items').get([i]).get('field_options').removeAt(fo);
  }

  // Getter for the FormArray
  // get items() {
  //   // console.log("form before",this.myForm.get('items'));
  //   // return this.myForm.get('items') ;
  //   return this.myForm.controls["sections"];
  // }

  get sections() {
    // console.log("form before",this.myForm.get('items'));
    // return this.myForm.get('sections') ;
    return this.myForm.controls["sections"];
  }

  // onItemDropped(event: any) {
  //   console.log("event",event)
  //   // Reorder the items based on the drop event
  //   moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  //   console.log("this.items",this.items)
  // }

  formSubmit() {
    console.log("form submitted", this.myForm.value);

  }

  showContent(section: any, s: any) {
    console.log("show content", section, "s", s)
  }

  showIcons(type: string) {
    console.log('type', type)
    switch (type) {
      case 'dropdown': return 'pi-angle-down';
        break;
      case 'radio': return 'pi-circle';
        break;
      case 'checkbox': return 'pi-check-square';
        break;
      default: return '';
        break;
    }
  }

  gotoPrevious() {
    this.step -= 1;
  }
  gotoNext() {
    this.step += 1;
  }

  isFormGroupValid() {

    switch (this.step) {
      case 1:
        // console.log("step-1",this.myForm.get('organisationDetails').valid);
        return this.myForm.get('organisationDetails').valid;
        break;
      case 2:
        // console.log("step-2",this.myForm.get('sections').valid);
        return this.myForm.get('sections').valid;
        break;
      case 3:
        // console.log("step-3",this.myForm.get('themeDetails').valid)
        return this.myForm.get('themeDetails').valid;
        break;
      default:
        console.log("step-0", this.myForm)
        return this.myForm.valid
        break;
    }
  }


  onTypeChange(value:any){
    console.log("value-->",value)
    // const value=this.myForm.get('sections').get([s]).get('items').get([i]).get('field_type').value.value;
    if(value.value === 'number' || value.value === 'text' || value.value === 'email' || value.value === 'password' || value.value === 'url'){
      console.log("df",this.fieldTypeList.some(obj => obj.value === 'input' && obj.items.some(list => list.value === 'text')),this.fieldTypeList)
      if(this.fieldTypeList.some(obj => obj.value === 'input' && obj.items.some(list => list.value === 'text'))){
        console.log('matched')
      }else{
        this.validationTypeList.push({label:'Length',value:'length'})
      }
     
    }
     if(value.value === 'number' || value.value === 'date' || value.value === 'time' || value.value === 'datetime'){
      if(value.value === 'date' || value.value === 'time' || value.value === 'datetime'){
        if(this.validationTypeList.some(obj=> obj.value === 'length')){
          this.validationTypeList=this.validationTypeList.filter(obj => obj.value !== 'length')
        }
      }
      if(this.validationTypeList.some(obj=> obj.value === 'range')){
        
      }else{
        this.validationTypeList.push({label:'Range',value:'range'})
      }
    }
    
  }


  checkLengthAndRange(expression:any){
    console.log('expression',expression)
    if(expression === 'length') return true;
    else if(expression === 'number') return true;
    else if(expression === 'date') return true;
    else if(expression === 'time') return true;
    else if(expression === 'datetime') return true;
    else if(expression === 'range') return true;
    else return false;
  }

}

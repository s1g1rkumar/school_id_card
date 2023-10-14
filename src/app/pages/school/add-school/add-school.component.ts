import { Component,Input, OnInit,ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validator, Validators, FormBuilder,FormArray } from "@angular/forms"
import { HttpClient } from "@angular/common/http"
import { CommonApiService } from 'src/app/_services/common-api.service';
import Swal from 'sweetalert2';
import { ActivatedRoute,Router } from '@angular/router';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss'],
})
export class AddSchoolComponent {
  @Input() editData:any;
  constructor(http: HttpClient, private commonApi: CommonApiService,private route: ActivatedRoute,private router:Router,private fb:FormBuilder) {
  }
  isPreview: Boolean = false;
  isUpdate: Boolean = false;
  data: any;
  pictureUrl: any = '';
  id:any=""
  products:string[] = ['a'];
  fieldTypeList=[{label:"Text",value:"text"},{label:"Number",value:"number"},{label:"Currency",value:"currency"},{label:"Dropdown",value:"dropdown"},{label:"Mutiple Choice",value:"radio"},{label:"Checkbox",value:"checkbox"}]
 
  // myForm: any=new FormGroup({});
  myForm:any;
  ngOnInit() {
    this.myForm = this.fb.group({
      sections:this.fb.array([this.fb.group({
        section_name:['Untitled section', Validators.required],
        section_desc:['', Validators.required],
        items: this.fb.array([this.fb.group({
          field_name: ['', Validators.required],
          field_type: ['text', Validators.required],
          field_description:[''],
          field_required: [false, Validators.required],
          field_options:this.fb.array([this.fb.group({
            label:[''],
            value:['']
          })])
        })])
      })]),
      // items: this.fb.array([this.fb.group({
      //   field_name: ['', Validators.required],
      //   field_type: ['text', Validators.required],
      //   field_description:[''],
      //   field_required: [false, Validators.required],
      // })]), // FormArray for dynamic list
    });
    console.log("items",this.sections)
    // console.log("fb value",this.myForm.value)

    // if(this.editData){
    //   this.schoolForm.patchValue(this.editData);
    // }
    this.route.paramMap.subscribe((params) => {
       this.id = params.get('id');
      console.log("id",this.id);
      if(this.id){
        this.commonApi.getSchoolDetail(this.id).subscribe({
          next: (response: any) => {
            console.log(response);
            this.schoolForm.patchValue(response);
            this.pictureUrl=response.logo;
            this.isUpdate=true;
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
      basic_details:new FormGroup({
        name:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('1',[Validators.required]),
        }),
        admission_no:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('2',[Validators.required]),
        }),
        class:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('3',[Validators.required]),
        }),
        section:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('4',[Validators.required]),
        }),
        roll_no:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('5',[Validators.required]),
        }),
        admission_date:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('6',[Validators.required]),
        }),
        dob:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('7',[Validators.required]),
        }),
        gender:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('8',[Validators.required]),
        }),
        category:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('9',[Validators.required]),
        }),
        religion:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('10',[Validators.required]),
        }),
        picture:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('11',[Validators.required]),
        }),
      }),
      parent_details:new FormGroup({
        father_name:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('1',[Validators.required]),
        }),
        father_occupation:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('2',[Validators.required]),
        }),
        mother_name:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('3',[Validators.required]),
        }),
        mother_occupation:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('4',[Validators.required]),
        }),
        father_annual_income:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('5',[Validators.required]),
        }),
        mother_annual_income:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('6',[Validators.required]),
        }),
      }),
      communication_details:new FormGroup({
        mobile_no:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('1',[Validators.required]),
        }),
        whatsapp_no:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('2',[Validators.required]),
        }),
        mail_id:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('3',[Validators.required]),
        }),
        transportation:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('4',[Validators.required]),
        }),
        address:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('5',[Validators.required]),
        }),
      }),
      other_details:new FormGroup({
        aadhar_no:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('1',[Validators.required]),
        }),
        blood_group:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('2',[Validators.required]),
        }),
        faculty:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('3',[Validators.required]),
        }),
        admitted_in:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('4',[Validators.required]),
        }),
        house_name:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('5',[Validators.required]),
        }),
        school_code:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('6',[Validators.required]),
        }),
        school_name:new FormGroup({
          active: new FormControl(true,Validators.required),
          mandatory:new FormControl(true,[Validators.required]),
          order:new FormControl('7',[Validators.required]),
        }),
      }),
    }),
    theme:new FormGroup({
      primary_color:new FormControl('',[Validators.required]),
      secondary_color:new FormControl('',[Validators.required]),
      primary_font:new FormControl('',[Validators.required]),
      secondary_font:new FormControl('',[Validators.required]),
      theme_color:new FormControl('',[Validators.required])
    })
  })


  getFormData(object: any) {
    const formData = new FormData();
    Object.keys(object).forEach(key => {
      if(typeof object[key] != "object"){
        formData.append(key, object[key]);
      }
      else{
        console.log("length",Object.keys(object[key]).length,"--",Object.keys(object[key]));
        if(Object.keys(object[key]).length === 0){
          formData.append(key, object[key]);
        }else{
          formData.append(key,JSON.stringify(object[key]));
        }
        console.log("key",key,"object",object[key],"typeof",typeof object[key])
      }
      
    });
    console.log("foemData",formData);
    return formData;
    
  }

  schoolFormSubmit() {
    console.log(this.schoolForm.value)
    if (this.schoolForm.valid) {
      console.log("if part", this.schoolForm.value)
      this.isPreview = true;
      const formData = this.getFormData(this.schoolForm.value);
      if(this.isUpdate){
        this.commonApi.updateSchool(this.id,formData).subscribe({
          next: (response: any) => {
            console.log(response);
            Swal.fire("Form Updated successfully.", ``, "success");
            // this.onClickSubmitHandler();
            this.schoolForm.reset();
            this.pictureUrl = "";
            this.isUpdate=false;
            this.id="";
  
          }, error: (err: any) => {
            Swal.fire("Unable to update school", `please try again!`, "error");
            console.log(err)
            // this.onClickEditModeHandler();
  
          }
        })
      }else{
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
    this.schoolForm.patchValue({
      logo: file
    })
    this.pictureUrl = this.getPictureUrl(file);
  }


  getPictureUrl(picture: File) {
    return picture ? URL.createObjectURL(picture) : '';
  }

  addItem(s:number) {
    const item = this.fb.group({
      field_name: ['', Validators.required],
      field_type: ['text', Validators.required],
      field_description:[''],
      field_required: [false, Validators.required],
      field_options:this.fb.array([this.fb.group({
        label:[''],
        value:['']
      })])
    });
    this.myForm.get('sections').get([s]).get('items').push(item);
  }

  addSection() {
    const section = this.fb.group({
      section_name: ['', Validators.required],
      section_desc: ['', Validators.required],
      items:this.fb.array([this.fb.group({
        field_name: ['sdfg', Validators.required],
        field_type: ['text', Validators.required],
        field_description:[''],
        field_required: [false, Validators.required],
        field_options:this.fb.array([this.fb.group({
          label:[''],
          value:['']
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
  
  removeItem(s: number,i:number) {
    // Remove the item at the specified index from the FormArray
    this.myForm.get('sections').get([s]).get('items').removeAt(i);
  }

  addOptions(s:number,i:number,fo:number){
    const options=this.fb.group({
      label:[''],
      value:['']
    })
    this.myForm.get('sections').get([s]).get('items').get([i]).get('field_options').push(options);
  }

  removeOptions(s:number,i:number,fo:number){
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

  formSubmit(){
    console.log("form submitted",this.myForm.value);
    
  }

  showContent(section:any,s:any){
    console.log("show content",section,"s", s )
  }

}

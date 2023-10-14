import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonApiService } from 'src/app/_services/common-api.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {
  doc: any = new jsPDF();
  constructor(private commonApi: CommonApiService, private router: Router,private el: ElementRef) { }
  @Input() data: any;
  @Output() dataEvent = new EventEmitter<string>();
  @Output() submitClearData = new EventEmitter<string>();



  onClickEditModeHandler() {
    this.dataEvent.emit();
  }
  onClickSubmitHandler() {
    this.submitClearData.emit();
  }

  getPictureUrl(picture: File) {
    console.log("conv file", picture)
    return picture ? URL.createObjectURL(picture) : '';
  }


  getFormData(object: any) {
    const formData = new FormData();
    Object.entries(object).forEach(([key, value]) => {
      formData.append(key, JSON.stringify(object[key]));
      // Object.entries(object[key]).forEach(([k, val]) => {
      //   if(Object.keys(object[`${key}`][`${k}`]).length === 0 && typeof val === 'object' && val instanceof File){
      //     console.log("acccess",`${key}[${k}]`)
      //     console.log(k,"---",val,"---",typeof val,"type",Object.keys(object[`${key}`][`${k}`]).length,"ttt");
      //     const fmdata:any=formData.get('basic_details');
      //     console.log("fmdata",fmdata);
      //     const josnData=fmdata;
      //     fmdata.picture = val;
      //     console.log("josnData",fmdata);
      //     formData.set('basic_details', fmdata);
      //   }
      // })
    });

    return formData;
  }

  onClickSubmit() {
    if (this.data) {
      console.log("submit data", this.data);

      const picformData = new FormData();
      picformData.append('picture', this.data.basic_details.picture);

      this.commonApi.uploadToAws(picformData).subscribe({
        next: (res: any) => {
          this.data.basic_details.picture = res;
          this.commonApi.createUser(this.data).subscribe({
            next: (response: any) => {
              console.log(response);
              Swal.fire({
                title: 'Form submitted successfully.',
                icon: 'success',
                text: `You application no. is : ${response.application_no}`,
                // showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Download Acknowledgement',
                cancelButtonText: 'Close',
                // denyButtonText: `Don't save`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  this.downloadPdf(response)
                  // this.commonApi.generateAcknowledgement(response).subscribe({
                  //   next: (res:Blob) => {
                  //     console.log("blob",res)
                  //     let blob = new Blob([res], { type: 'application/pdf' });
                  //     const url = window.URL.createObjectURL(blob);
                  //     // window.open(url);
                  //     const link = document.createElement('a');
                  //     link.href = url;
                  //     link.download = `acknowledgement`;
                  //     link.click();
                  //   }
                  // })
                  Swal.fire('Downloaded!', '', 'success')
                } else if (result.isDenied) {
                  Swal.fire('Changes are not saved', '', 'info')
                }
              })

              this.onClickSubmitHandler();



            }, error: (err: any) => {
              Swal.fire("Unable to submit your application", `please try again!`, "error");
              console.log(err)
              this.onClickEditModeHandler();

            }
          })
        }
      })

      const formData = this.getFormData(this.data)

      // const jsonFormData=JSON.stringify(formData);
      // this.commonApi.createUser(formData).subscribe({
      //   next: (response: any) => {
      //     console.log(response);
      //     // Swal.fire("Form submitted successfully.", `You application no. is : ${response.application_no}, click to download `, "success");
      //     // Swal.fire({
      //     //   icon: 'success',
      //     //   title: 'Form submitted successfully.',
      //     //   text: `You application no. is : ${response.application_no}`,
      //     //   footer: '<button (click)="downloadPdf()">Download acknowledgement</button>'
      //     // })

      //     Swal.fire({
      //       title: 'Form submitted successfully.',
      //       icon: 'success',
      //       text: `You application no. is : ${response.application_no}`,
      //       // showDenyButton: true,
      //       showCancelButton: true,
      //       confirmButtonText: 'Download Acknowledgement',
      //       cancelButtonText: 'Close',
      //       // denyButtonText: `Don't save`,
      //     }).then((result) => {
      //       /* Read more about isConfirmed, isDenied below */
      //       if (result.isConfirmed) {
      //         this.downloadPdf(response)
      //         Swal.fire('Downloaded!', '', 'success')
      //       } else if (result.isDenied) {
      //         Swal.fire('Changes are not saved', '', 'info')
      //       }
      //     })

      //     this.onClickSubmitHandler();



      //   }, error: (err: any) => {
      //     Swal.fire("Unable to submit your application", `please try again!`, "error");
      //     console.log(err)
      //     this.onClickEditModeHandler();

      //   }
      // })
    }
  }

  private convertBase64ToBlob(Base64Image: any) {
    // SPLIT INTO TWO PARTS
    const parts = Base64Image.split(';base64,');
    // HOLD THE CONTENT TYPE
    const imageType = parts[0].split(':')[1];
    // DECODE BASE64 STRING
    const decodedData = window.atob(parts[1]);
    // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
    const uInt8Array = new Uint8Array(decodedData.length);
    // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // RETURN BLOB IMAGE AFTER CONVERSION
    return new Blob([uInt8Array], { type: imageType });
  }

  downloadPdf(responseData: any) {
    console.log("data", responseData)
    const fontSize = 15;
    this.doc.setFont("arial");
    this.doc.setFontSize(fontSize);
    this.doc.setPage(1)




    // this.doc.addImage(responseData?.picture, 'JPEG', 120, 20, 70, 100);

    //? basic-details
    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 100, 'Admission No.')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 100, responseData.basic_details.admission_no? responseData.basic_details.admission_no.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 105, 'Name')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 105, responseData?.basic_details.name ? responseData?.basic_details.name.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 110, 'Class')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 110, responseData?.basic_details.class ? responseData?.basic_details.class.value.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 115, 'Section')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 115, responseData?.basic_details.section ? responseData?.basic_details.section.value.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 120, 'Roll No.')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 120, responseData?.basic_details.roll_no  ? responseData?.basic_details.roll_no.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 125, 'Date of Admission')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 125, responseData?.basic_details.admission_date ? moment(responseData?.basic_details.admission_date).format("DD/MM/YYYY") : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 130, 'Date of Birth')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 130, responseData?.basic_details.dob ? moment(responseData?.basic_details.dob).format("DD/MM/YYYY") : "");

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 135, 'Gender')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 135, responseData?.basic_details.gender ? responseData?.basic_details.gender.value.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 140, 'Category')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 140, responseData?.basic_details.category ? responseData?.basic_details.category.value.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 145, 'Religion')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 145, responseData?.basic_details.religion ? responseData?.basic_details.religion.value.toString() : "")


    //? parent-details
    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 155, 'Father Name')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 155, responseData?.parent_details?.father_name ? responseData?.parent_details?.father_name.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(120, 155, 'Mother Name')
    this.doc.setTextColor("#020202");
    this.doc.text(170, 155, responseData?.parent_details?.mother_name ? responseData?.parent_details?.mother_name.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 160, 'Father Occupation')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 160, responseData?.parent_details?.father_occupation ? responseData?.parent_details?.father_occupation.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(120, 160, 'Mother Occupation')
    this.doc.setTextColor("#020202");
    this.doc.text(170, 160, responseData?.parent_details?.father_occupation ? responseData?.parent_details?.father_occupation.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 165, 'Father Annual Income')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 165, responseData?.parent_details?.father_annual_income ? responseData?.parent_details?.father_annual_income.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(120, 165, 'Mother Annual Income')
    this.doc.setTextColor("#020202");
    this.doc.text(170, 165, responseData?.parent_details?.mother_annual_income ? responseData?.parent_details?.mother_annual_income.toString() : "")


    //? communication-details
    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 175, 'Mobile Number')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 175, responseData?.communication_details?.mobile_no ? responseData?.communication_details?.mobile_no.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(120, 175, 'Whatsapp Number')
    this.doc.setTextColor("#020202");
    this.doc.text(170, 175, responseData?.communication_details?.whatsapp_no ? responseData?.communication_details?.whatsapp_no.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 180, 'Email ID')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 180, responseData?.communication_details?.mail_id ? responseData?.communication_details?.mail_id.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(120, 180, 'Transportaion')
    this.doc.setTextColor("#020202");
    this.doc.text(170, 180, responseData?.communication_details?.transportation.value ? responseData?.communication_details?.transportation.value.toString() : "")

    this.doc.setTextColor("#0D324D");
    this.doc.text(20, 185, 'Address')
    this.doc.setTextColor("#020202");
    this.doc.text(70, 185, responseData?.communication_details?.address ? responseData?.communication_details?.address.toString() : "")


        //? other-details
        this.doc.setTextColor("#0D324D");
        this.doc.text(20, 195, 'Aadhar Number')
        this.doc.setTextColor("#020202");
        this.doc.text(70, 195, responseData?.other_details?.aadhar_no ? responseData?.other_details?.aadhar_no.toString() : "")
    
        this.doc.setTextColor("#0D324D");
        this.doc.text(120, 195, 'Bloodgroup')
        this.doc.setTextColor("#020202");
        this.doc.text(170, 195, responseData?.other_details?.blood_group ? responseData?.other_details?.blood_group.value.toString() : "")
    
        this.doc.setTextColor("#0D324D");
        this.doc.text(20, 200, 'Faculty')
        this.doc.setTextColor("#020202");
        this.doc.text(70, 200, responseData?.other_details?.faculty ? responseData?.other_details?.faculty.value.toString() : "")
    
        this.doc.setTextColor("#0D324D");
        this.doc.text(120, 200, 'Admitted In')
        this.doc.setTextColor("#020202");
        this.doc.text(170, 200, responseData?.other_details?.admitted_in ? responseData?.other_details?.admitted_in.value.toString() : "")
    
        this.doc.setTextColor("#0D324D");
        this.doc.text(20, 205, 'House Name')
        this.doc.setTextColor("#020202");
        this.doc.text(70, 205, responseData?.other_details?.house_name ? responseData?.other_details?.house_name.toString() : "")
    


    this.addWatermarkToPDF(this.doc, "Watermark")
    this.doc.save();

    // const ele2=this.el.nativeElement.querySelector('#printForm');
    // const ele="<h2>hello user. how are you.</h2>"
    // console.log("ele",ele2)
    //   this.doc.html(ele2, {
    //     callback: function (d:any) {
    //       d.save();
    //     },
    //     x: 10,
    //     y: 10
    //  });



  }

  addWatermarkToPDF(pdf: any, watermarkText: any) {
    const totalPages = pdf.internal.getNumberOfPages();
    console.log("pages", totalPages);

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(30);
      pdf.setTextColor(200);
      pdf.text(105, 60, watermarkText);
    }
  }
}

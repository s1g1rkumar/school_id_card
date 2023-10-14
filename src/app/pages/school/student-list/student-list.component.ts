import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http"
import { CommonApiService } from "src/app/_services/common-api.service"
import * as FileSaver from 'file-saver';
import * as moment from 'moment';


interface Column {
  field: string;
  header: string;
}


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent {
  // @Input() schoolId:string="";
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private commonApi: CommonApiService) {
  }
  isEdit: Boolean = false;
  schoolId: string | null = "";
  data: any = [];
  stdListInOneLine:string[]=[];
  products!: any[];
  cols: Column[]=[];
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  body: any = {
    _id: "",
    page: 1,
    limit: 10,
    customFilterField: {
      other_details: {} as any,
    } as any,
  };
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.body.customFilterField.other_details.school_code = params.get('id');
      if (this.body.customFilterField.other_details.school_code) {
        // console.log("schoolId params", this.body);
        this.commonApi.getStudentList(this.body).subscribe({
          next: (response: any) => {
            // console.log("response",response);
            this.data = response;
            this.data.data=this.convertDataIntoSingleStringArray(this.data.data);
            // console.log("data",this.data.data);
            this.createDymanicHeader(this.data.data);
            // console.log("cols",this.cols);
          }, error: (err: any) => {
            console.log(err)

          }
        })
      }

    });
  }

  printData(data: any) {
    console.log("table data", data)
  }

  changeStatus(e: any, id: any) {
    const data = { status: e.checked, id: id }
    this.commonApi.changeStatus(data).subscribe({
      next: (response: any) => {
        // console.log(response, "thsi is response");
        this.ngOnInit();
      }
    })
  }

  onClickEdit(id: any) {
    this.isEdit = false;

    this.router.navigate(['/school/add-school', id]);
    // this.editData=data;
  }

  navigateToAddSchool() {
    this.router.navigate(['/school/add-school']);
  }

  downloadQRCode(school_code: string) {
    const qrImgEle: any = document.querySelector('.qrcode img ');
    const src: any = qrImgEle.src;
    let blobData = this.convertBase64ToBlob(src);
    const blob = new Blob([blobData], { type: "image/png" });
    const url = window.URL.createObjectURL(blob);
    // window.open(url);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${school_code} Qrcode`;
    link.click();

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

  // copyTextManually(school_code: string, id: string) {
  //   this.copiedData = { id, status: true };
  //   this.clipboardService.copy(`${this.domainName}/?school_code=${school_code}`);
  // }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      // const stdListInOneLine:any = [];
     
      // console.log("stdListInOneLine",stdListInOneLine);
      const worksheet = xlsx.utils.json_to_sheet(this.data.data);
      console.log("worksheet", worksheet)
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'products');
    });
  }

  convertDataIntoSingleStringArray(data:any){
    const newArr:any[]=[];
    data.map((ele: any, ind: number) => {
      const tempObj: any = {};
     Object.entries(ele).forEach(([key,value])=>{
      if (typeof value === 'object') {
        if (Object.prototype.toString.call(value) === '[object Object]') { 
          Object.entries(value as any).forEach(([k, v]) => {
            if(typeof v ==='object'){
              Object.entries(v as any).forEach(([i, j]) => {
                tempObj[`${k}`]=j;
              });
            }else{
              // console.log("key",k,"value",v,typeof v)
              if(typeof v === 'string'){
                const date=new Date(v);
                if(!isNaN(date.getTime())){
                  tempObj[`${k}`]=moment(date).format("DD-MM-YYYY");
                }else{
                  tempObj[`${k}`]=v;
                }
              }
              else{
                tempObj[`${k}`]=v;
              }
            }
          });
        }
      }else{
        tempObj[`${key}`]=value;
      }
     })
      newArr.push(tempObj);
    })
    return newArr;
  }

  createDymanicHeader(data:any){
   Object.entries(data[0]).forEach(([key,value])=>{
    // console.log("key",key,value,'value')
    if(key !== '_id'){
      this.cols.push({field:key,header:this.capitalizeString(key) })
    }
   })
  }

  capitalizeString(str:string){
    const arr = str.split("_" || " ");
//loop through each element of the array and capitalize the first letter.
for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
}
//Join all the elements of the array back into a string 
const str2 = arr.join(" ");
// console.log(str2);
return str2;
  }

 isImageUrl(url:string) {
    // Define a regular expression to match common image file extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp)/g;
  console.log("url",url,imageExtensions.test(url))
    // Use a regular expression to check if the URL ends with an image extension
    return imageExtensions.test(url);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  onClickApplications(code: string) {
    console.log("code click", code)
    this.router.navigate(['/school/student-list', code]);
  }
}

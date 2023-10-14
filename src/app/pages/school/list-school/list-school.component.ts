import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonApiService } from 'src/app/_services/common-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import  * as FileSaver from 'file-saver';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-list-school',
  templateUrl: './list-school.component.html',
  styleUrls: ['./list-school.component.scss']
})

export class ListSchoolComponent implements OnInit {
  // @ViewChild("qrcode", {static : true}) qrcode!: QRCodeComponent;
  data: any = [];
  isEdit: Boolean = false;
  products!: any[];
  editData: any;
  link: string = "";
  textToCopy: string = '';
  domainName: string = '';
  qrcodeStr:string='';
  copiedData: { id: string | null, status: boolean } = { id: null, status: false };
  first: number = 0;
  rows: number = 10;
  totalRecords:number=0;


  selectedProduct!: any;
  constructor(private commonApi: CommonApiService, private router: Router, private clipboardService: ClipboardService, private route: ActivatedRoute) {
    this.domainName = window.location.hostname;
    if (this.domainName === 'localhost') {
      this.domainName += ':4200';
    }
  }
  ngOnInit(): void {
    this.commonApi.getSchoolList().subscribe({
      next: (response: any) => {
        this.data = response;
        this.totalRecords=response.length;
      }
    })
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

  downloadQRCode(school_code:string) {
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

  copyTextManually(school_code: string, id: string) {
    this.copiedData = { id, status: true };
    this.clipboardService.copy(`${this.domainName}/?school_code=${school_code}`);
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'products');
    });
}

saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}


onClickApplications(code:string){
  console.log("code click",code)
  this.router.navigate(['/school/student-list',code]);
}

}

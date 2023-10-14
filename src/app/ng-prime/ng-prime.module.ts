import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { PickListModule } from 'primeng/picklist';
import { InputSwitchModule } from 'primeng/inputswitch'
import { ColorPickerModule } from 'primeng/colorpicker';
import { ImageModule } from 'primeng/image';
import { TabViewModule } from 'primeng/tabview';
@NgModule({
  exports: [
    ButtonModule,
    DynamicDialogModule,
    DialogModule,
    ProgressSpinnerModule,
    InputMaskModule,
    InputTextModule,
    AvatarModule,
    MenuModule,
    TableModule,
    PaginatorModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    DividerModule,
    MultiSelectModule,
    FileUploadModule,
    CardModule,
    PanelModule,
    PickListModule,
    InputSwitchModule,
    ColorPickerModule,
    ImageModule,
    TabViewModule
  ]
})
export class NgPrimeModule { }

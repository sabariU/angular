import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../app.component';
import { ComponentDiagramComponent } from '../shared/util/component-diagram/component-diagram.component';



@NgModule({
  declarations: [
    ComponentDiagramComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [ComponentDiagramComponent],
  providers: [],
})
export class AppModuleModule { }

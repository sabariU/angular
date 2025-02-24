import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentDiagramComponent } from './shared/util/component-diagram/component-diagram.component';

const routes: Routes = [
  { path: 'diagram', component: ComponentDiagramComponent }, // Route to directly access the diagram
  { path: '**', redirectTo: 'diagram', pathMatch: 'full' }  // Default redirect (optional)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

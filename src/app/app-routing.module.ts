import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestsComponent } from './tests/tests.component';
import { Test1Component } from './test1/test1.component';
import { PersonaComponent } from './persona/persona.component';
import { ListaComponent } from './lista/lista.component';

const routes: Routes = [
  {path: '', component: TestsComponent},
  {path: 'persona', component:PersonaComponent},
  {path: 'test1', component: Test1Component},
  {path: 'lista', component: ListaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

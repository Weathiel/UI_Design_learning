import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselComponent } from 'ngx-owl-carousel-o';
import { BookComponentComponent } from './book-component/book-component.component';
import { HomeComponent } from './home/home.component';
import { MemoryGameComponent } from './memory-game/memory-game.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'book', component: BookComponentComponent },
  { path: 'game', component: MemoryGameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

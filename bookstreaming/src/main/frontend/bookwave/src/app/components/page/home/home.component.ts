import { Component, OnInit } from '@angular/core';
import { NewBookComponent } from "../../home/new-book/new-book.component";
import { ContinueReadingComponent } from "../../home/continue-reading/continue-reading.component";
import { RecommendedBooksComponent } from "../../home/recommended-books/recommended-books.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ CommonModule,
    RouterModule,
    NewBookComponent,
    ContinueReadingComponent,
    RecommendedBooksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  

}

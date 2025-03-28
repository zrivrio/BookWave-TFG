import { Component, OnInit } from '@angular/core';
import { NewBookComponent } from "../../home/new-book/new-book.component";
import { ContinueReadingComponent } from "../../home/continue-reading/continue-reading.component";
import { RecommendedBooksComponent } from "../../home/recommended-books/recommended-books.component";
import { CommonModule } from '@angular/common';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../models/Book';
import { AuthService } from '../../../service/auth.service';
import { Router, RouterModule } from '@angular/router';

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

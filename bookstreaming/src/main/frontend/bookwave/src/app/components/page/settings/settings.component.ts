import { Component, Input } from '@angular/core';
import { Book } from '../../../models/Book';
import { ReadingList } from '../../../models/ReadingList';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../../service/book.service';
import { UserService } from '../../../service/user.service';
import { LibraryService } from '../../../service/library.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}

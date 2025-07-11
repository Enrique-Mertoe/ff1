import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {debounceTime} from "rxjs";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {DefaultFlexDirective, DefaultLayoutDirective} from "ngx-flexible-layout";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    NgIf,
    DefaultFlexDirective,
    MatInput,
    DefaultLayoutDirective
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  @Input() placeholder = 'Search keyword here...';
  @Output() onSearch =  new EventEmitter<string>()
  form!: FormGroup;
  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.builder.group({
      search: ['', Validators.required]
    })
    this.form.controls['search'].valueChanges.pipe(debounceTime(500))
      .subscribe(filter => {
        this.onSearch.emit(filter);
      });
  }

  resetForm() {
    this.form.patchValue({search: ''});
  }
}


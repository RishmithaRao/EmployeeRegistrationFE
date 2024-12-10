import { Component } from '@angular/core';

import { Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  @Input() isLoading: boolean = false; // Control loader visibility
}


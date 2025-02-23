import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TopFilterComponent } from './top-filter/top-filter.component';
import { FilterParams } from './model/filter.params.model';
import { ArcCardComponent } from './arc-card/arc-card.component';
import { ActionCardComponent } from './action-card/action-card.component';
import { DeviationCardComponent } from './deviation-card/deviation-card.component';
import { CoeCardComponent } from './coe-card/coe-card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,  HttpClientModule,
    TopFilterComponent, ArcCardComponent, ActionCardComponent,
    DeviationCardComponent,
    CoeCardComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'donut-chart-project';

  filterParams: FilterParams = new FilterParams();

  onFilterChange(filterValues: FilterParams) {
    this.filterParams = filterValues;
  }
}

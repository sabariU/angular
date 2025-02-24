import { AfterViewInit, Component } from '@angular/core';
import mermaid from 'mermaid';
@Component({
  selector: 'app-component-diagram',
  templateUrl: './component-diagram.component.html',
  styleUrl: './component-diagram.component.scss',
  standalone : false
})
export class ComponentDiagramComponent implements AfterViewInit {
  diagram = `
    graph TD
        A[AppComponent] --> B[TopFilterComponent]
        A --> C[ArcCardComponent]
        A --> D[ActionCardComponent]
        A --> E[DeviationCardComponent]
        A --> F[CoeCardComponent]

        subgraph Shared
            G[BaseCardComponent]
            H[ChartProviderService]
        end

        C --> G
        D --> G
        E --> G
        F --> G

        C --> H
        D --> H
        E --> H
        F --> H

        B --> I[FilterParams]
        C --> I
        D --> I
        E --> I
        F --> I
  `;

  ngAfterViewInit(): void {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded(); // Ensures rendering when the page loads
  }
}


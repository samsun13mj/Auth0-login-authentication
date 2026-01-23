import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as joint from '@joint/core';

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagram-component.html',
  styleUrls: ['./diagram-component.scss']
})
export class DiagramComponent implements AfterViewInit {

  ngAfterViewInit(): void {

    const graph = new joint.dia.Graph();

    const paper = new joint.dia.Paper({
      el: document.getElementById('paper')!,
      model: graph,
      width: '100%',
      height: '100%',
      gridSize: 10,
      drawGrid: true,
      background: { color: '#f9fafb' }
    });

    /* Node 1 */
    const rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 100);
    rect.resize(120, 40);
    rect.attr({
      body: {
        fill: '#1976d2'
      },
      label: {
        text: 'Start',
        fill: '#ffffff'
      }
    });
    rect.addTo(graph);

    /* Node 2 */
    const rect2 = rect.clone();
    rect2.translate(200, 120);
    rect2.attr('label/text', 'End');
    rect2.addTo(graph);

    /* Link */
    const link = new joint.shapes.standard.Link();
    link.source(rect);
    link.target(rect2);
    link.addTo(graph);
  }
}

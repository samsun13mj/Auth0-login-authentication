import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as joint from '@joint/core';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagram-component.html',
  styleUrls: ['./diagram-component.scss']
})
export class DiagramComponent implements AfterViewInit {

  graph!: joint.dia.Graph;
  paper!: joint.dia.Paper;

  ngAfterViewInit(): void {
    this.initDiagram();
    this.loadUsersAndBuildDiagram();
  }

  //  Initialize JointJS Canvas
  initDiagram() {
    this.graph = new joint.dia.Graph();

    const el = document.getElementById('paper')!;

    this.paper = new joint.dia.Paper({
      el,
      model: this.graph,
      width: el.clientWidth,
      height: el.clientHeight,
      gridSize: 10,
      drawGrid: true,
      interactive: true,
      background: { color: '#f9fafb' }
    });
  }

  //  Random Color Generator for Users
  getUserColor(index: number): string {
    const colors = [
      '#1976d2', // blue
      '#388e3c', // green
      '#f57c00', // orange
      '#7b1fa2', // purple
      '#0288d1', // cyan
      '#c2185b', // pink
      '#455a64', // gray
      '#009688'  // teal
    ];
    return colors[index % colors.length];
  }

  //  Create Node
  createNode(text: string, x: number, y: number, color: string) {
    const node = new joint.shapes.standard.Rectangle();

    node.position(x, y);
    node.resize(200, 65);
    node.attr({
      body: {
        fill: color,
        rx: 12,
        ry: 12,
        stroke: '#222',
        strokeWidth: 1.2
      },
      label: {
        text,
        fill: '#fff',
        fontSize: 13,
        fontWeight: '600'
      }
    });

    node.addTo(this.graph);
    return node;
  }

  //  Link Style
  createLink(source: any, target: any) {
    const link = new joint.shapes.standard.Link();

    link.source(source);
    link.target(target);

    link.attr({
      line: {
        stroke: '#555',
        strokeWidth: 2,
        targetMarker: {
          type: 'path',
          d: 'M 10 -5 0 0 10 5 z'
        }
      }
    });

    link.router('orthogonal');
    link.connector('rounded');

    link.addTo(this.graph);
  }

  //  ORG CHART LAYOUT 
  async loadUsersAndBuildDiagram() {
    const res = await fetch('http://localhost:3000/users');
    const users: User[] = await res.json();

    const admin = users.find(u => u.role === 'Admin');
    const normalUsers = users.filter(u => u.role === 'User');

    if (!admin) return;

    const paperWidth = this.paper.options.width as number;

    // =========================
    //  ADMIN NODE 
    // =========================
    const nodeWidth = 200;
    const adminX = paperWidth / 2 - nodeWidth / 2;
    const adminY = 60;

    const adminNode = this.createNode(
      admin.name + ' (Admin)',
      adminX,
      adminY,
      '#d32f2f'
    );

    // =========================
    //  USERS GRID LAYOUT (AUTO WRAP)
    // =========================
    const gapX = 60;   // horizontal gap
    const gapY = 140;  // vertical gap
    const maxPerRow = Math.floor(paperWidth / (nodeWidth + gapX)); // auto-fit

    const startY = 260;
    const userNodes: any[] = [];

    normalUsers.forEach((user, index) => {
      const row = Math.floor(index / maxPerRow);
      const col = index % maxPerRow;

      const rowUsers = Math.min(maxPerRow, normalUsers.length - row * maxPerRow);
      const totalRowWidth = rowUsers * nodeWidth + (rowUsers - 1) * gapX;

      const startX = paperWidth / 2 - totalRowWidth / 2;
      const x = startX + col * (nodeWidth + gapX);
      const y = startY + row * gapY;

      const node = this.createNode(
        user.name + ' (User)',
        x,
        y,
        this.getUserColor(index)
      );

      userNodes.push(node);
    });

    // =========================
    //  CONNECT ADMIN → USERS (SMART LINKS)
    // =========================
    userNodes.forEach(node => {
      this.createLink(adminNode, node);
    });
  }

  //  Export JSON
  exportFlow() {
    const json = this.graph.toJSON();
    console.log(json);
    alert('Diagram exported! Check console.');
  }
}

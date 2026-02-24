import { Component, OnInit } from '@angular/core';
import { ClaudinaryService } from '../../../core/claudinary.service';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  templateUrl: './splash-screen.html',
  styleUrl: './splash-screen.css',
})
export class SplashScreenComponent implements OnInit {
  logoUrl = '';

  constructor(private cloudinary: ClaudinaryService) {}

  ngOnInit() {
    this.logoUrl = this.cloudinary.getOptimizedImage('logoms2_exyhn7.png', 400);
  }
}


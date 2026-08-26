import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../core/config/environment';
import {
  WEEKLY_WORSHIP_SERVICES,
  WorshipService,
  getLiveStatus,
} from '../../core/live-schedule';

@Component({
  selector: 'app-live-component',
  imports: [CommonModule],
  templateUrl: './live-component.html',
  styleUrl: './live-component.css',
})
export class LiveComponent implements OnInit, OnDestroy {
  readonly services = WEEKLY_WORSHIP_SERVICES;
  readonly channelUrl = environment.youtubeChannelUrl;
  isLive = false;
  currentService: WorshipService | null = null;
  nextService: WorshipService | null = null;
  playerUrl: SafeResourceUrl | null = null;
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(private sanitizer: DomSanitizer) {
    this.playerUrl = this.buildPlayerUrl();
  }

  get hasPlayer(): boolean {
    return this.playerUrl !== null;
  }

  ngOnInit() {
    this.refreshStatus();
    this.timerId = setInterval(() => this.refreshStatus(), 30_000);
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private refreshStatus() {
    const status = getLiveStatus();
    this.isLive = status.isLive;
    this.currentService = status.current;
    this.nextService = status.next?.service ?? null;
  }

  private buildPlayerUrl(): SafeResourceUrl | null {
    const videoId = environment.youtubeLiveVideoId?.trim();
    const channelId = environment.youtubeChannelId?.trim();
    let url = '';

    if (videoId) {
      url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    } else if (channelId) {
      url = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&rel=0`;
    }

    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  }
}

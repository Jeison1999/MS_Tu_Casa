import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../core/config/environment';
import {
  WEEKLY_WORSHIP_SERVICES,
  WorshipService,
  extractYoutubeVideoId,
  getLiveStatus,
  isBroadcastLive,
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
  watchUrl = '';
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  get hasPlayer(): boolean {
    return this.playerUrl !== null;
  }

  ngOnInit() {
    this.watchUrl = this.buildWatchUrl();
    this.playerUrl = this.buildPlayerUrl();
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
    this.isLive = isBroadcastLive();
    this.currentService = status.current;
    this.nextService = status.next?.service ?? null;
  }

  private buildWatchUrl(): string {
    const videoId = extractYoutubeVideoId();
    if (videoId) return `https://www.youtube.com/watch?v=${videoId}`;
    const channelId = environment.youtubeChannelId?.trim();
    if (channelId) return `https://www.youtube.com/channel/${channelId}/live`;
    return this.channelUrl;
  }

  private buildPlayerUrl(): SafeResourceUrl | null {
    const videoId = extractYoutubeVideoId();
    const channelId = environment.youtubeChannelId?.trim();
    const origin = encodeURIComponent(window.location.origin);
    const extra = `autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${origin}`;
    let url = '';

    if (videoId) {
      url = `https://www.youtube.com/embed/${videoId}?${extra}`;
    } else if (channelId) {
      url = `https://www.youtube.com/embed/live_stream?channel=${channelId}&${extra}`;
    }

    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  }

}

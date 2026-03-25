import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ClaudinaryService } from '../../core/claudinary.service';
import {
  MinistryMomentAsset,
  MinistryMomentMedia,
  MinistryMomentsTheme,
} from './ministry-moments-section.model';

@Component({
  selector: 'app-ministry-moments-section',
  imports: [],
  templateUrl: './ministry-moments-section.component.html',
  styleUrl: './ministry-moments-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistryMomentsSectionComponent implements OnDestroy {
  theme = input.required<MinistryMomentsTheme>();
  sectionClass = input<string>('');

  title = input.required<string>();
  description = input.required<string>();

  assets = input.required<MinistryMomentAsset[]>();
  autoPlayMs = input<number>(5000);
  defaultWidth = input<number>(1600);
  defaultQuality = input<number>(90);

  private readonly cloudinary = inject(ClaudinaryService);

  currentSlide = signal(0);
  isDragging = signal(false);
  dragOffset = signal(0);

  private startX = 0;
  private currentX = 0;
  private readonly threshold = 50;
  private autoSlideInterval: ReturnType<typeof setInterval> | null = null;

  hostClass = computed(() =>
    ['mms', `mms--${this.theme()}`, this.sectionClass().trim()].filter(Boolean).join(' ')
  );

  transformValue = computed(
    () => `translateX(calc(-${this.currentSlide() * 100}% + ${this.dragOffset()}px))`
  );

  gallery = computed<MinistryMomentMedia[]>(() =>
    this.assets().map((asset) => {
      const media = this.cloudinary.getOptimizedMedia(
        asset.publicId,
        asset.width ?? this.defaultWidth(),
        asset.quality ?? this.defaultQuality()
      );

      return {
        ...media,
        alt: asset.alt ?? this.title(),
      };
    })
  );

  constructor() {
    effect(() => {
      const total = this.gallery().length;
      const delay = this.autoPlayMs();

      this.stopAutoSlide();
      this.currentSlide.set(0);

      if (total > 1) {
        this.autoSlideInterval = setInterval(() => this.nextSlide(), delay);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  nextSlide(): void {
    const total = this.gallery().length;
    if (!total) return;

    this.currentSlide.update((value) => (value + 1) % total);
  }

  prevSlide(): void {
    const total = this.gallery().length;
    if (!total) return;

    this.currentSlide.update((value) => (value - 1 + total) % total);
  }

  goToSlide(index: number): void {
    const total = this.gallery().length;
    if (!total) return;

    this.currentSlide.set(index);
    this.restartAutoSlide();
  }

  onMouseEnter(): void {
    this.stopAutoSlide();
  }

  onMouseLeave(): void {
    this.startAutoSlide();
  }

  onDragStart(event: MouseEvent): void {
    this.isDragging.set(true);
    this.startX = event.clientX;
    this.currentX = event.clientX;
    this.stopAutoSlide();
    event.preventDefault();
  }

  onDragMove(event: MouseEvent): void {
    if (!this.isDragging()) return;

    this.currentX = event.clientX;
    this.dragOffset.set(this.currentX - this.startX);
  }

  onDragEnd(): void {
    if (!this.isDragging()) return;

    const distance = this.currentX - this.startX;

    if (distance < -this.threshold) {
      this.nextSlide();
    } else if (distance > this.threshold) {
      this.prevSlide();
    }

    this.isDragging.set(false);
    this.dragOffset.set(0);
    this.startAutoSlide();
  }

  onTouchStart(event: TouchEvent): void {
    this.isDragging.set(true);
    this.startX = event.touches[0].clientX;
    this.currentX = event.touches[0].clientX;
    this.stopAutoSlide();
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging()) return;

    this.currentX = event.touches[0].clientX;
    this.dragOffset.set(this.currentX - this.startX);
  }

  onTouchEnd(): void {
    if (!this.isDragging()) return;

    const distance = this.currentX - this.startX;

    if (distance < -this.threshold) {
      this.nextSlide();
    } else if (distance > this.threshold) {
      this.prevSlide();
    }

    this.isDragging.set(false);
    this.dragOffset.set(0);
    this.startAutoSlide();
  }

  private startAutoSlide(): void {
    if (this.autoSlideInterval || this.gallery().length <= 1) return;

    this.autoSlideInterval = setInterval(() => this.nextSlide(), this.autoPlayMs());
  }

  private restartAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}

import * as React from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import styles from './BannerCarousel.module.scss';

const launchBanner = require('../../assets/testing-banner.png');

/* ── Slide data ────────────────────────────────────────────────────────────────
 * Each slide defines its own content and visual style.
 * Replace this array with SharePoint list data later.
 * ──────────────────────────────────────────────────────────────────────────── */
export interface IBannerSlide {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  /** URL or require()'d image module */
  backgroundImage?: string;
  /** CSS gradient for the overlay — keeps contrast on text */
  overlayGradient?: string;
  /** Accessible description of the background image */
  backgroundAlt?: string;
  /** Left-border accent colour */
  accentColor?: string;
  /** If true, hide text overlay and gradient (image already contains text) */
  hideOverlay?: boolean;
}

const BANNER_SLIDES: IBannerSlide[] = [
  {
    id: 'launch',
    title: 'Prepare to Launch: Welcome to Testing',
    subtitle: 'RCT Intranet — Mission Ready',
    iconName: 'Rocket',
    backgroundImage: launchBanner,
    backgroundAlt:
      'Space themed banner with Earth horizon and rocket trajectory',
    accentColor: 'var(--rct-brand-gold)',
    hideOverlay: true,
  },
  {
    id: 'easter',
    title: 'Holiday Hours: Good Friday',
    subtitle:
      'The office will be operating on holiday hours Friday, April 18. Wishing everyone a happy Easter!',
    iconName: 'Calendar',
    overlayGradient:
      'linear-gradient(135deg, rgba(31,76,127,0.88) 0%, rgba(24,115,137,0.90) 100%)',
    backgroundAlt: 'Easter holiday notice banner',
    accentColor: 'var(--rct-blue-accessible)',
  },
  {
    id: 'company',
    title: 'Stay Connected on Microsoft Teams',
    subtitle:
      'Check the #general channel for daily updates, shout-outs, and important company announcements.',
    iconName: 'TeamsLogo',
    overlayGradient:
      'linear-gradient(135deg, rgba(38,41,49,0.85) 0%, rgba(31,76,127,0.78) 100%)',
    backgroundAlt: 'Microsoft Teams company communications banner',
    accentColor: 'var(--rct-brand-gold)',
  },
];

export const BannerCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const slideCount = BANNER_SLIDES.length;

  const goTo = React.useCallback(
    (index: number) => {
      setActiveIndex(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount]
  );

  const goPrev = React.useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = React.useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    },
    [goPrev, goNext]
  );

  const slide = BANNER_SLIDES[activeIndex];

  return (
    <section
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-label="Banner announcements"
      onKeyDown={handleKeyDown}
    >
      {/* ── Slide ────────────────────────────────────────────────────────── */}
      <div
        className={styles.banner}
        role="group"
        aria-roledescription="slide"
        aria-label={`Slide ${activeIndex + 1} of ${slideCount}: ${slide.title}`}
        style={{
          backgroundImage: !slide.hideOverlay && slide.backgroundImage
            ? `url(${slide.backgroundImage})`
            : 'none',
          borderLeftColor: slide.accentColor || 'var(--rct-brand-gold)',
        }}
      >
        {slide.hideOverlay && slide.backgroundImage && (
          <img
            className={styles.bannerImg}
            src={slide.backgroundImage}
            alt={slide.backgroundAlt || slide.title}
          />
        )}

        {!slide.hideOverlay && (
          <div
            className={styles.bannerOverlay}
            aria-hidden="true"
            style={{
              background: slide.overlayGradient,
            }}
          />
        )}

        {!slide.hideOverlay && (
          <div className={styles.card}>
            <div className={styles.headerRow}>
              <Icon
                iconName={slide.iconName}
                className={styles.icon}
                aria-hidden="true"
              />
              <h2 className={styles.title}>{slide.title}</h2>
            </div>
            <p className={styles.subtitle}>{slide.subtitle}</p>
          </div>
        )}

        {/* ── Prev / Next arrows ──────────────────────────────────────── */}
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={goPrev}
          aria-label="Previous slide"
        >
          <Icon iconName="ChevronLeft" />
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={goNext}
          aria-label="Next slide"
        >
          <Icon iconName="ChevronRight" />
        </button>
      </div>

      {/* ── Dot indicators ───────────────────────────────────────────── */}
      <div className={styles.dots} role="tablist" aria-label="Banner slides">
        {BANNER_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerCarousel;

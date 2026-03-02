import * as React from 'react';
import styles from './Hero.module.scss';

const TITLE = 'Rapid City Transportation Hub';
const SUBTITLE = 'Your central hub for tools, updates, and employee resources';

export const Hero: React.FC = () => (
  <section className={styles.hero} aria-labelledby="hero-title">
    <div className={styles.heroInner}>
      <h1 id="hero-title" className={styles.title}>
        {TITLE}
      </h1>
      <p className={styles.subtitle}>{SUBTITLE}</p>
    </div>
  </section>
);

export default Hero;

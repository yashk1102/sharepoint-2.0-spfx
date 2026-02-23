import * as React from 'react';
import styles from './Hero.module.scss';

const TITLE = 'Welcome to the Rapid City Transportation Hub';
const SUBTITLE = 'Your central hub for tools, updates, and employee resources';

export const Hero: React.FC = () => (
  <section className={styles.hero} aria-labelledby="hero-title">
    <h1 id="hero-title" className={styles.title}>
      {TITLE}
    </h1>
    <p className={styles.subtitle}>{SUBTITLE}</p>
  </section>
);

export default Hero;

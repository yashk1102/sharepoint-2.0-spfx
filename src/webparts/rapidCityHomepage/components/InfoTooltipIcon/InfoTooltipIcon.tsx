import * as React from 'react';
import { TooltipHost, ITooltipHostStyles } from '@fluentui/react/lib/Tooltip';
import { Icon } from '@fluentui/react/lib/Icon';
import { useId } from '@fluentui/react-hooks';
import styles from './InfoTooltipIcon.module.scss';

export interface IInfoTooltipIconProps {
  /** Tooltip text (e.g. "Use 01/31 for return time TBD") */
  text: string;
  /** Optional aria-label override; defaults to "More information" */
  ariaLabel?: string;
  className?: string;
}

const hostStyles: Partial<ITooltipHostStyles> = {
  root: { display: 'inline-block' },
};

/**
 * Reusable instruction/info icon with tooltip. Use in Contact Cards and elsewhere.
 */
export const InfoTooltipIcon: React.FC<IInfoTooltipIconProps> = (props) => {
  const id = useId('info-tooltip');
  const ariaLabel = props.ariaLabel ?? 'More information';

  return (
    <TooltipHost
      content={props.text}
      id={id}
      styles={hostStyles}
      calloutProps={{ gapSpace: 4 }}
    >
      <span
        className={styles.iconWrapper}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={id}
      >
        <Icon
          iconName="Info"
          className={styles.icon}
          aria-hidden="true"
        />
      </span>
    </TooltipHost>
  );
};

export default InfoTooltipIcon;

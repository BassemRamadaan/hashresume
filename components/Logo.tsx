import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 810 810" 
    className={className}
    fill="currentColor"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <clipPath id="eba3f9bce8">
        <path d="M 43 35 L 744 35 L 744 674 L 43 674 Z M 43 35 " clipRule="nonzero"/>
      </clipPath>
      <clipPath id="703bd5be0d">
        <path d="M 415.867188 35.558594 L 762.074219 641.933594 L 207.152344 958.765625 L -139.054688 352.386719 Z M 415.867188 35.558594 " clipRule="nonzero"/>
      </clipPath>
      <clipPath id="b0f70feb94">
        <path d="M 415.867188 35.558594 L 762.074219 641.933594 L 207.152344 958.765625 L -139.054688 352.386719 Z M 415.867188 35.558594 " clipRule="nonzero"/>
      </clipPath>
      <clipPath id="4fb3555339">
        <path d="M 415.867188 35.558594 L 762.074219 641.933594 L 207.152344 958.765625 L -139.054688 352.386719 Z M 415.867188 35.558594 " clipRule="nonzero"/>
      </clipPath>
    </defs>
    {/* Removed white background rects to allow transparent usage in dark mode */}
    <g clipPath="url(#eba3f9bce8)">
      <g clipPath="url(#703bd5be0d)">
        <g clipPath="url(#b0f70feb94)">
          <g clipPath="url(#4fb3555339)">
            <path d="M 265.234375 673.777344 L 191.449219 673.449219 L 303.046875 482.308594 L 266.457031 418.226562 L 117.652344 673.097656 L 43.855469 672.746094 L 415.863281 35.558594 L 452.425781 99.65625 L 303.632812 354.488281 L 340.21875 418.570312 L 489.023438 163.699219 L 525.585938 227.792969 Z M 337.667969 671.851562 L 560.84375 289.550781 L 743.777344 609.898438 L 743.71875 609.898438 L 743.730469 609.921875 L 706.566406 673.625 L 632.746094 673.289062 L 632.757812 673.25 L 598.464844 613.191406 L 558.984375 672.886719 L 558.996094 672.910156 L 558.972656 672.921875 L 485.238281 672.570312 L 522.425781 608.851562 L 485.835938 544.769531 L 411.441406 672.21875 L 411.453125 672.242188 L 411.429688 672.253906 Z M 523.046875 481.039062 L 596.171875 609.171875 L 669.945312 609.535156 L 669.96875 609.519531 L 669.953125 609.496094 L 560.21875 417.300781 Z M 523.046875 481.039062 " fillOpacity="1" fillRule="nonzero"/>
          </g>
        </g>
      </g>
    </g>
  </svg>
);
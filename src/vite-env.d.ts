/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      src?: string;
      trigger?: string;
      colors?: string;
      delay?: string;
      state?: string;
      style?: React.CSSProperties;
    }, HTMLElement>;
  }

declare module 'canvas-confetti';
declare module 'react-dom/client';

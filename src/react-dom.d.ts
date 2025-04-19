declare module 'react-dom' {
  import * as React from 'react';
  
  function render(
    element: React.ReactElement,
    container: Element | null,
    callback?: () => void
  ): void;
  
  function hydrate(
    element: React.ReactElement,
    container: Element | null,
    callback?: () => void
  ): void;
  
  function unmountComponentAtNode(container: Element): boolean;
  
  const version: string;
  
  function createPortal(
    children: React.ReactNode,
    container: Element
  ): React.ReactPortal;
  
  export {
    render,
    hydrate,
    unmountComponentAtNode,
    version,
    createPortal
  };
} 
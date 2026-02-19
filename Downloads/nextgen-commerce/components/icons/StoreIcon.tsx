import React from 'react';

export const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H10.5a2.25 2.25 0 00-2.25 2.25v7.5m5.25-7.5H9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75V21h18V9.75l-9-6.75-9 6.75z" />
  </svg>
);

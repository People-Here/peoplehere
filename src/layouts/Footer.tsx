import type { PropsWithChildren } from 'react';

type Props = {
  bottom?: number;
};

const Footer = ({ bottom = 0, children }: PropsWithChildren<Props>) => {
  return (
    <footer className={`fixed left-0 right-0 p-4 bg-white bottom-${bottom}`}>{children}</footer>
  );
};

export default Footer;

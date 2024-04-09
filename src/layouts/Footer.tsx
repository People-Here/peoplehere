import { IonFooter, IonToolbar } from '@ionic/react';

import type { PropsWithChildren } from 'react';

const Footer = ({ children }: PropsWithChildren) => {
  return (
    <IonFooter class="ion-no-border" className="fixed bottom-0 left-0 right-0 bg-white">
      <IonToolbar className="p-4">{children}</IonToolbar>
    </IonFooter>
  );
};

export default Footer;

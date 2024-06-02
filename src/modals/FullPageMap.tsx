import { GoogleMap } from '@capacitor/google-maps';
import { IonButtons, IonContent, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { useRef } from 'react';

import CloseIcon from '../assets/svgs/close.svg';
import MapPinIcon from '../assets/images/map-pin.png';

import type { ModalProps } from '.';

type Props = {
  lat: number;
  lng: number;
  title: string;
  address: string;
};

const FullPageMap = ({ lat, lng, title, address, ...rest }: Props & ModalProps) => {
  // eslint-disable-next-line no-undef
  const modalRef = useRef<HTMLIonModalElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const createMap = async () => {
    const map = await GoogleMap.create({
      id: 'place-detail-map',
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
      element: mapRef.current!,
      config: {
        mapId: '50768681a96d17df',
        center: { lat, lng },
        zoom: 17,
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        clickableIcons: false,
        mapTypeControl: false,
        panControl: false,
        scaleControl: false,
        zoomControl: false,
      },
    });

    await map.addMarker({
      coordinate: { lat, lng },
      iconUrl: MapPinIcon,
      iconSize: {
        width: 32,
        height: 32,
      },
    });
  };

  return (
    <IonModal ref={modalRef} onDidPresent={createMap} {...rest}>
      <IonContent fullscreen>
        <IonToolbar className="px-4 h-14">
          <IonButtons slot="start">
            <IonIcon
              icon={CloseIcon}
              className="svg-lg"
              onClick={() => modalRef.current?.dismiss()}
            />
          </IonButtons>

          <IonTitle class="ion-text-center" className="font-headline3 text-gray8">
            지도
          </IonTitle>
        </IonToolbar>

        <div className="relative w-full h-[calc(100%-3.5rem)] overflow-hidden">
          <div ref={mapRef} className="relative inline-block w-full h-full" />

          <div className="absolute z-30 w-full px-4 bottom-6">
            <div className="w-full border-[1.5px] border-gray2 rounded-xl flex items-center gap-3 p-3 bg-white">
              <div>
                <p className="font-subheading2 text-gray7 mb-0.5">{title}</p>
                <p className="font-caption2 text-gray5">{address}</p>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default FullPageMap;

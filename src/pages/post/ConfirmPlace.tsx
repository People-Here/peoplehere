import { IonContent, IonIcon, IonPage, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { useLocation } from 'react-router';
import { GoogleMap } from '@capacitor/google-maps';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import MapPinIcon from '../../assets/svgs/location.svg';
import MapIcon from '../../assets/svgs/map.svg';
import Header from '../../components/Header';
import Footer from '../../layouts/Footer';
import usePostPlaceStore from '../../stores/place';

import '../../theme/google-map.css';

const ConfirmPlace = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const { setPlace } = usePostPlaceStore((state) => state);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const lat = params.get('lat') ?? '37.5665';
  const lng = params.get('lng') ?? '126.9780';
  const title = params.get('title') ?? '';
  const address = params.get('address') ?? '';
  const id = params.get('id') ?? '';

  const mapRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useIonViewWillEnter(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createMap();
  });

  const createMap = async () => {
    if (!mapRef.current) return;

    const map = await GoogleMap.create({
      id: `google-map-${title}`,
      element: mapRef.current,
      apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY as string,
      config: {
        mapId: '9ba511c953e3f78',
        iOSMapId: '8a84aa7b5c7d513',
        androidMapId: 'a4b7a11734117836',
        width: 400,
        height: 700,
        center: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
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
      coordinate: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
      iconUrl: MapPinIcon,
      iconSize: {
        width: 32,
        height: 32,
      },
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': 'transparent' }}>
        <Header type="close" />

        <div className="px-4">
          <p className="font-headline2 text-gray8 mt-0.5 mb-5">{t('newPost.place.confirm')}</p>

          <div className="px-2 border-[1.5px] border-gray2 p-3 flex items-center gap-3 rounded-xl mb-4">
            <IonIcon icon={MapIcon} className="svg-xl shrink-0" />

            <div>
              <p className="font-subheading2 text-gray7 mb-0.5">{title}</p>
              <p className="font-caption2 text-gray5">{address}</p>
            </div>
          </div>

          <div
            ref={mapContainerRef}
            className="relative w-full h-[17.75rem] overflow-hidden rounded-xl border border-gray2"
          >
            <capacitor-google-map ref={mapRef} />
          </div>
        </div>

        <Footer>
          <div className="flex items-center w-full gap-3">
            <button
              className="flex-1 w-full button-line button-lg font-subheading1 text-gray6"
              onClick={() => router.goBack()}
            >
              {t('progress.goBack')}
            </button>
            <button
              className="flex-[2] w-full text-white button-primary button-lg font-subheading1"
              onClick={() => {
                setPlace({ id, title, address });
                router.goBack();
              }}
            >
              {t('progress.continue')}
            </button>
          </div>
        </Footer>
      </IonContent>
    </IonPage>
  );
};

export default ConfirmPlace;

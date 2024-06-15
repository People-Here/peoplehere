import { IonContent, IonIcon, IonPage, useIonViewWillEnter } from '@ionic/react';
import { useLocation } from 'react-router';
import { GoogleMap } from '@capacitor/google-maps';
import { useRef } from 'react';

import Header from '../../components/Header';
import MapPinIcon from '../../assets/svgs/location.svg';
import MapIcon from '../../assets/svgs/map.svg';

import '../../theme/google-map-sm.css';
import Footer from '../../layouts/Footer';

const ConfirmPlace = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const lat = params.get('lat') ?? '37.5665';
  const lng = params.get('lng') ?? '126.9780';
  const title = params.get('title');
  const address = params.get('address');

  const mapRef = useRef<HTMLDivElement>(null);

  useIonViewWillEnter(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createMap();
  });

  const createMap = async () => {
    if (!mapRef.current) return;

    const map = await GoogleMap.create({
      id: 'google-map',
      element: mapRef.current,
      apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY as string,
      config: {
        mapId: '50768681a96d17df',
        iOSMapId: 'cf72b44089ef16e3',
        androidMapId: 'b6e7531585349271',
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
      <Header type="close" />

      <IonContent fullscreen style={{ '--background': 'transparent' }}>
        <div className="px-4">
          <p className="font-headline2 text-gray8 mt-0.5 mb-5">장소의 위치와 주소가 맞나요?</p>

          <div className="px-2 border-[1.5px] border-gray2 p-3 flex items-center gap-3 rounded-xl mb-4">
            <IonIcon icon={MapIcon} className="svg-xl" />

            <div>
              <p className="font-subheading2 text-gray7 mb-0.5">{title}</p>
              <p className="font-caption2 text-gray5">{address}</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border-[1.5px] border-gray2">
            <capacitor-google-map ref={mapRef} />
          </div>
        </div>
      </IonContent>

      <Footer>
        <div className="flex items-center w-full gap-3">
          <button className="button-line button-lg font-subheading1 text-gray6">뒤로</button>
          <button className="text-white button-primary button-lg font-subheading1">계속</button>
        </div>
      </Footer>
    </IonPage>
  );
};

export default ConfirmPlace;

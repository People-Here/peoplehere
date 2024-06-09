import { IonContent, IonPage, useIonViewWillEnter } from '@ionic/react';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap } from '@capacitor/google-maps';

import Header from '../../components/Header';
import MapPinIcon from '../../assets/svgs/location.svg';

import '../../theme/google-map.css';

const FullPageMap = () => {
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

    // console.log('map info', googleMap);

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
      <IonContent fullscreen>
        <Header type="close" title="지도" />

        <div className="relative w-full h-[calc(100%-3.5rem)] overflow-hidden">
          <capacitor-google-map ref={mapRef} />

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
    </IonPage>
  );
};

export default FullPageMap;

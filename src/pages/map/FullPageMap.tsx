import { IonContent, IonPage, isPlatform, useIonViewWillEnter } from '@ionic/react';
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
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const isIOS = isPlatform('ios');

  useIonViewWillEnter(() => {
    if (!lat || !lng) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createMap(lat, lng);
  }, [title, address, lat, lng]);

  const createMap = async (lat: string, lng: string) => {
    if (!mapRef.current) return;

    const map = await GoogleMap.create({
      id: `google-map-${title}`,
      element: mapRef.current,
      apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY as string,
      config: {
        mapId: '50768681a96d17df',
        iOSMapId: 'cf72b44089ef16e3',
        androidMapId: 'b6e7531585349271',
        center: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
        zoom: 17,
        width: 400,
        height: 1000,
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
        <Header type="close" title="지도" />

        <div
          ref={mapContainerRef}
          className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden"
        >
          <capacitor-google-map ref={mapRef} />

          <div
            className={
              isIOS ? 'absolute z-30 w-full px-4 bottom-20' : 'absolute z-30 w-full px-4 bottom-6'
            }
          >
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

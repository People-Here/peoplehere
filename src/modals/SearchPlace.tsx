import {
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonText,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';

import ArrowLeftIcon from '../assets/svgs/arrow-left.svg';
import { searchPlace, type SearchPlaceResponse } from '../api/search';
import useSignInStore from '../stores/signIn';

import type { FormEvent } from 'react';
import type { ModalProps } from '.';

type PlaceItem = {
  id: string;
  title: string;
  address: string;
};

type Props = {
  onClickItem: (item: PlaceItem) => void;
};

const SearchPlace = ({ onClickItem, ...rest }: ModalProps & Props) => {
  const router = useIonRouter();
  const region = useSignInStore((state) => state.region);

  // eslint-disable-next-line no-undef
  const modalRef = useRef<HTMLIonModalElement>(null);

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<SearchPlaceResponse['predictions']>([]);

  useEffect(() => {
    if (!search) {
      setSearchResult([]);
    }
  }, [search]);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();

    const { data } = await searchPlace({ name: search, region: region.countryCode });

    if (data.status === 'OK') {
      setSearchResult(data.predictions);
    }
  };

  return (
    <IonModal ref={modalRef} {...rest}>
      <IonContent fullscreen>
        <IonToolbar className="px-4 h-14">
          <IonButtons slot="start">
            <IonIcon icon={ArrowLeftIcon} className="svg-lg" onClick={() => router.goBack()} />
          </IonButtons>
        </IonToolbar>

        <div className="px-4 mt-2.5">
          <SearchBar search={search} setSearch={setSearch} onSearch={onSearch} />

          {search.length === 0 ? (
            <div className="mt-5">
              <IonText className="font-body1 text-gray6 mb-2.5">최근 검색 내역</IonText>

              {/* TODO: 최근 검색 내역 백엔드 나오면 추가 필요 */}
            </div>
          ) : (
            <div className="mt-2.5">
              {/* 검색 결과 */}
              <SearchList
                list={searchResult.map((item) => {
                  return {
                    id: item.placeId,
                    title: item.structuredFormatting.mainText,
                    address: item.description,
                  };
                })}
                onClickItem={(item) => {
                  onClickItem && onClickItem(item);
                }}
              />
            </div>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
  onSearch: (event: FormEvent) => void;
};

const SearchBar = ({ search, setSearch, onSearch }: SearchBarProps) => {
  return (
    <form className="flex items-center w-full gap-2" onSubmit={onSearch}>
      <div className="border border-gray3 rounded-lg bg-gray1.5 px-4 flex w-full items-center">
        <IonInput
          placeholder="지역명, 장소명, 주소 검색"
          className="h-full font-body1 text-gray8"
          clearInput
          value={search}
          onIonInput={(e) => setSearch(e.detail.value as string)}
        />
      </div>

      <button type="submit" className="px-3 button-primary button-md shrink-0">
        검색
      </button>
    </form>
  );
};

type SearchListProps = {
  list: PlaceItem[];
  onClickItem: (item: PlaceItem) => void;
};
const SearchList = ({ list, onClickItem }: SearchListProps) => {
  return (
    <IonList lines="none">
      {list.map((item) => (
        <IonItem
          key={item.id}
          className="ion-no-padding"
          onClick={() => {
            onClickItem(item);
          }}
        >
          <IonLabel>
            <IonText className="block font-subheading2 text-gray8">{item.title}</IonText>
            <IonText className="font-caption2 text-gray5">{item.address}</IonText>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default SearchPlace;

import {
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import { searchPlace } from '../../api/search';
import useUserStore from '../../stores/userInfo';

import type { SearchPlaceResponse } from '../../api/search';
import type { FormEvent } from 'react';

const Search = () => {
  const region = useUserStore((state) => state.region);

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
    <IonContent fullscreen>
      <Header type="back" />

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
            />
          </div>
        )}
      </div>
    </IonContent>
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
  list: {
    id: string;
    title: string;
    address: string;
  }[];
};
const SearchList = ({ list }: SearchListProps) => {
  const router = useIonRouter();

  return (
    <IonList lines="none">
      {list.map((item) => (
        <IonItem
          key={item.id}
          className="ion-no-padding"
          onClick={() => {
            router.push(`/home?search=${item.title}`, 'forward', 'replace');
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

export default Search;

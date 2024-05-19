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
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ArrowLeftIcon from '../assets/svgs/arrow-left.svg';
import { enrollPlace, getSearchHistory, searchPlace } from '../api/search';
import useSignInStore from '../stores/signIn';
import { getNewToken } from '../api/login';

import type { AxiosError } from 'axios';
import type { SearchPlaceResponse, SearchHistory } from '../api/search';
import type { FormEvent } from 'react';
import type { ModalProps } from '.';

export type PlaceItem = {
  id: string;
  title: string;
  address: string;
};

type Props = {
  onClickItem: (item: PlaceItem) => void;
};

const SearchPlace = ({ onClickItem, ...rest }: ModalProps & Props) => {
  const { t } = useTranslation();

  const region = useSignInStore((state) => state.region);

  // eslint-disable-next-line no-undef
  const modalRef = useRef<HTMLIonModalElement>(null);

  const [search, setSearch] = useState('');
  const [history, setHistory] = useState<SearchHistory['places']>([]);
  const [searchResult, setSearchResult] = useState<SearchPlaceResponse['predictions']>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!search) {
      setSearchResult([]);
      setShowResult(false);
    }
  }, [search]);

  const getHistory = async () => {
    try {
      const response = await getSearchHistory();
      setHistory(response.data.places);
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 401) {
        await getNewToken();

        const response = await getSearchHistory();
        setHistory(response.data.places);
      }
    }
  };

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await searchPlace({ name: search, region: region.countryCode });
      setShowResult(true);
      setSearchResult(data.predictions);
    } catch (error) {
      console.error('search error', error);
    }
  };

  const onClick = async (item: PlaceItem) => {
    try {
      await enrollPlace({ placeId: item.id, region: region.countryCode.toUpperCase() });
      onClickItem(item);
      await modalRef.current?.dismiss();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <IonModal
      ref={modalRef}
      {...rest}
      onDidDismiss={() => setSearch('')}
      onWillPresent={getHistory}
    >
      <IonContent fullscreen>
        <IonToolbar className="px-4 h-14">
          <IonButtons slot="start">
            <IonIcon
              icon={ArrowLeftIcon}
              className="svg-lg"
              onClick={() => modalRef.current?.dismiss()}
            />
          </IonButtons>
        </IonToolbar>

        <div className="px-4 mt-2.5">
          <SearchBar search={search} setSearch={setSearch} onSearch={onSearch} />

          {!showResult ? (
            <div className="mt-5">
              <IonText className="font-body1 text-gray6 mb-2.5">{t('search.recent')}</IonText>

              {/* TODO: 최근 검색 내역 백엔드 나오면 추가 필요 */}
              <SearchList
                list={history.map((item) => {
                  return {
                    id: item.placeId,
                    title: item.name,
                    address: item.address,
                  };
                })}
                onClickItem={(item) => onClick(item)}
              />
            </div>
          ) : (
            <div className="mt-2.5">
              {/* 검색 결과 */}
              {searchResult.length === 0 ? (
                <NoResult keyword={search} />
              ) : (
                <SearchList
                  list={searchResult.map((item) => {
                    return {
                      id: item.placeId,
                      title: item.structuredFormatting.mainText,
                      address: item.description,
                    };
                  })}
                  onClickItem={(item) => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    onClick(item);
                  }}
                />
              )}
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
  const { t } = useTranslation();

  return (
    <form className="flex items-center w-full gap-2" onSubmit={onSearch}>
      <div className="border border-gray3 rounded-lg bg-gray1.5 px-4 flex w-full items-center">
        <IonInput
          placeholder={t('search.placeholder')}
          className="h-full font-body1 text-gray8"
          clearInput
          value={search}
          onIonInput={(e) => setSearch(e.detail.value as string)}
        />
      </div>

      <button type="submit" className="px-3 button-primary button-md shrink-0">
        {t('common.search')}
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

const NoResult = ({ keyword }: { keyword: string }) => {
  return (
    <div className="flex items-center justify-center w-full mt-44">
      <IonText className="font-headline3 text-gray5.5 whitespace-pre-line">{`'${keyword}'를 찾을 수 없습니다.\n검색어를 바르게 입력했는지 확인하세요.`}</IonText>
    </div>
  );
};

export default SearchPlace;

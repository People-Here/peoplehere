import { IonInput, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import { useState } from 'react';

import Header from '../../components/Header';

const Search = () => {
  const [search, setSearch] = useState('');

  return (
    <>
      <Header type="back" />

      <div className="px-4 mt-2.5">
        <SearchBar search={search} setSearch={setSearch} />

        {search.length === 0 ? (
          <div className="mt-5">
            <IonText className="font-body1 text-gray6 mb-2.5">최근 검색 내역</IonText>

            {/* 최근 검색 내역 */}
            <SearchList />
          </div>
        ) : (
          <div className="mt-2.5">
            {/* 검색 결과 */}
            <SearchList />
          </div>
        )}
      </div>
    </>
  );
};

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  return (
    <div className="border border-gray3 rounded-lg bg-gray1.5 px-4 flex items-center">
      <IonInput
        placeholder="지역명, 장소명, 주소 검색"
        className="h-full font-body1 text-gray8"
        clearInput
        value={search}
        onIonInput={(e) => setSearch(e.detail.value as string)}
      />
    </div>
  );
};

const SearchList = () => {
  return (
    <IonList lines="none">
      <IonItem className="ion-no-padding">
        <IonLabel>
          <IonText className="block font-subheading2 text-gray8">로니로티 건대점</IonText>
          <IonText className="font-caption2 text-gray5">
            서울특별시 광진구 아차산로 225 단산화빌딩
          </IonText>
        </IonLabel>
      </IonItem>
      <IonItem className="ion-no-padding">
        <IonLabel>
          <IonText className="block font-subheading2 text-gray8">로니로티 건대점</IonText>
          <IonText className="font-caption2 text-gray5">
            서울특별시 광진구 아차산로 225 단산화빌딩
          </IonText>
        </IonLabel>
      </IonItem>
      <IonItem className="ion-no-padding">
        <IonLabel>
          <IonText className="block font-subheading2 text-gray8">로니로티 건대점</IonText>
          <IonText className="font-caption2 text-gray5">
            서울특별시 광진구 아차산로 225 단산화빌딩
          </IonText>
        </IonLabel>
      </IonItem>
      <IonItem className="ion-no-padding">
        <IonLabel>
          <IonText className="block font-subheading2 text-gray8">로니로티 건대점</IonText>
          <IonText className="font-caption2 text-gray5">
            서울특별시 광진구 아차산로 225 단산화빌딩
          </IonText>
        </IonLabel>
      </IonItem>
    </IonList>
  );
};

export default Search;
import {
  IonContent,
  IonIcon,
  IonImg,
  IonLabel,
  IonPage,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import Header from '../../components/Header';
import PlusCircleOrange from '../../assets/svgs/plus-circle-orange.svg';
import GlobeIcon from '../../assets/svgs/globe.svg';
import LanguageIcon from '../../assets/svgs/language.svg';
import DoubleHeartIcon from '../../assets/svgs/double-heart.svg';
import ClockIcon from '../../assets/svgs/clock.svg';
import DogIcon from '../../assets/svgs/dog.svg';
import CakeIcon from '../../assets/svgs/cake.svg';
import LocationIcon from '../../assets/svgs/location.svg';
import BagIcon from '../../assets/svgs/bag.svg';
import SchoolIcon from '../../assets/svgs/school.svg';
import Footer from '../../layouts/Footer';
import Introduce from '../../modals/Introduce';
import SelectRegion from '../../modals/SelectRegion';
import useSignInStore from '../../stores/signIn';
import SimpleInputModal from '../../modals/SimpleInputModal';
import ShowAge from '../../modals/ShowAge';
import SelectLanguages from '../../modals/SelectLanguages';
import useProfileStore from '../../stores/user';
import DefaultUserImage from '../../assets/images/default-user.png';
import { getUserProfile, updateUserProfile } from '../../api/profile';
import { getNewToken } from '../../api/login';
import EditIcon from '../../assets/svgs/pencil-with-circle-black.svg';
import { findKoreanLanguageName, findLanguageCode } from '../../utils/find';
import { capitalizeFirstLetter, roundAge } from '../../utils/mask';
import SelectCity from '../../modals/SelectCity';
import { imageToFile } from '../../utils/image';

import type { Language } from '../../modals/SelectLanguages';
import type { AxiosError } from 'axios';

const EditProfile = () => {
  const { t, i18n } = useTranslation();

  const router = useIonRouter();

  const region = useSignInStore((state) => state.region);
  const userId = useProfileStore((state) => state.user.id);

  const [firstName, setFirstName] = useState('');
  const [image, setImage] = useState('');
  const [introduce, setIntroduce] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [favorite, setFavorite] = useState('');
  const [hobby, setHobby] = useState('');
  const [pet, setPet] = useState('');
  const [age, setAge] = useState('');
  const [showAge, setShowAge] = useState(false);
  const [location, setLocation] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [job, setJob] = useState('');
  const [school, setSchool] = useState('');

  const [showIntroduceModal, setShowIntroduceModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await FirebaseAnalytics.setScreenName({
        screenName: 'set_profile',
        nameOverride: 'SetProfile',
      });
    })();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      if (userId) {
        const response = await getUserProfile(userId, 'KR');

        if (response.status === 200) {
          setImage(response.data.profileImageUrl);
          setIntroduce(response.data.introduce);
          setLanguages(
            response.data.languages.map((lang) => ({
              koreanName: findKoreanLanguageName(lang),
              englishName: capitalizeFirstLetter(lang),
              lang: findLanguageCode(lang),
            })),
          );
          setFavorite(response.data.favorite ?? '');
          setHobby(response.data.hobby ?? '');
          setPet(response.data.pet ?? '');
          setJob(response.data.job ?? '');
          setSchool(response.data.school ?? '');
          setFirstName(response.data.firstName);
          setAge(response.data.birthDate);
          setShowAge(response.data.showBirth);
          setLocation(response.data.cityName ?? '');
        }
      }
    })();
  }, [userId]);

  const listItems = [
    {
      iconSrc: GlobeIcon,
      title: t('profile.country'),
      value: i18n.resolvedLanguage === 'ko' ? region.koreanName : region.englishName,
      modalId: 'region-modal',
      onClick: () => setShowRegionModal(true),
      required: true,
    },
    {
      iconSrc: LanguageIcon,
      title: t('profile.languages'),
      value: languages.map((lang) => lang.koreanName).join(', '),
      modalId: 'language-modal',
      onClick: () => setShowLanguageModal(true),
      required: true,
    },
    {
      iconSrc: DoubleHeartIcon,
      title: t('profile.favorite'),
      value: favorite ?? '',
      modalId: 'favorite-modal',
      required: false,
    },
    {
      iconSrc: ClockIcon,
      title: t('profile.hobby'),
      value: hobby,
      modalId: 'hobby-modal',
      required: false,
    },
    {
      iconSrc: DogIcon,
      title: t('profile.pet'),
      value: pet,
      modalId: 'pet-modal',
      required: false,
    },
    {
      iconSrc: CakeIcon,
      title: t('profile.age'),
      value: roundAge(age, i18n.resolvedLanguage),
      modalId: 'age-modal',
      onClick: () => setShowAgeModal(true),
      required: false,
    },
    {
      iconSrc: LocationIcon,
      title: t('profile.location'),
      value: location,
      modalId: 'search-place',
      onClick: () => setShowCityModal(true),
      required: false,
    },
    {
      iconSrc: BagIcon,
      title: t('profile.work'),
      value: job,
      modalId: 'job-modal',
      required: false,
    },
    {
      iconSrc: SchoolIcon,
      title: t('profile.school'),
      value: school,
      modalId: 'school-modal',
      required: false,
    },
  ];

  const saveProfile = async () => {
    if (!image || !introduce || !languages.length) {
      console.error('Required fields are missing');
      return;
    }

    setLoading(true);

    const formData = new FormData();

    if (!image.startsWith('http')) {
      const imageBlob = await imageToFile(image);
      formData.append('profileImage', imageBlob);
    }

    formData.append('id', userId);
    formData.append('introduce', introduce);
    formData.append('region', region.countryCode);
    languages.forEach((lang) => {
      formData.append('languages', lang.englishName.toUpperCase());
    });
    formData.append('favorite', favorite);
    formData.append('hobby', hobby);
    formData.append('pet', pet);
    formData.append('birthDate', '');
    formData.append('showBirth', String(showAge));
    formData.append('job', job);
    formData.append('school', school);
    formData.append('cityId', placeId);

    try {
      await updateUserProfile(formData);
      router.goBack();
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 403) {
        await getNewToken();

        await updateUserProfile(formData);
        router.goBack();
      }

      console.error('Failed to update user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletedItemList = () => {
    const completedItems = [];

    if (favorite) {
      completedItems.push('favorite');
    }
    if (hobby) {
      completedItems.push('hobby');
    }
    if (pet) {
      completedItems.push('pet');
    }
    if (age) {
      completedItems.push('age');
    }
    if (location) {
      completedItems.push('location');
    }
    if (job) {
      completedItems.push('job');
    }
    if (school) {
      completedItems.push('school');
    }

    return completedItems.join(', ');
  };

  const onClickComplete = async () => {
    await FirebaseAnalytics.logEvent({
      name: 'profile_complete',
      params: {
        country: region.countryCode,
        languages: languages.map((lang) => lang.koreanName).join(','),
        introduction_item_name: getCompletedItemList(),
      },
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header
          type="close"
          title={firstName}
          fixed
          onClickIcon={async () => {
            await FirebaseAnalytics.logEvent({
              name: 'click_close_profile',
              params: {
                add_profile_photo_status: image.length > 0 ? 'yes' : 'no',
                introduction_status: introduce.length > 0 ? 'yes' : 'no',
                language_status: languages.length > 0 ? 'yes' : 'no',
              },
            });
            router.goBack();
          }}
        />

        {/* title area */}
        <div className="px-4 mt-16 mb-4">
          <div className="border border-gray3 rounded-2xl flex items-center py-2 flex-col gap-1.5 px-8">
            <IonText className="text-center whitespace-pre-wrap font-body1 text-gray6">
              {t('editProfile.guide')}
            </IonText>
            <IonText className="font-caption1 text-gray5">{t('editProfile.translation')}</IonText>
          </div>
        </div>

        {/* image area */}
        <ImageArea image={image} setImage={setImage} />

        {/* content area */}
        <div className="px-4 pb-28 mt-7">
          <div className="flex items-center justify-between mb-4">
            <IonText className="font-headline2 text-gray7">{t('editProfile.introduction')}</IonText>
            <RequiredChip />
          </div>

          <div
            id="introduce-modal"
            className="p-4 bg-gray1.5 rounded-xl mb-4"
            onClick={() => setShowIntroduceModal(true)}
          >
            <IonText className="whitespace-pre-wrap font-body1 text-gray8">
              {introduce ? introduce : t('editProfile.introduction2')}
            </IonText>
          </div>

          <div role="list">
            {listItems.map((item) => (
              <ListItem
                key={item.title}
                id={item.modalId}
                iconSrc={item.iconSrc}
                title={item.title}
                value={item.value}
                required={item.required}
                onClick={item?.onClick}
              />
            ))}
          </div>
        </div>

        <Footer>
          <button
            className="w-full button-primary button-lg"
            onClick={async () => {
              await onClickComplete();
              await saveProfile();
            }}
            disabled={!image || !introduce || !region.countryCode || languages.length === 0}
          >
            {t('progress.done')}
          </button>
        </Footer>
      </IonContent>

      {/* modals */}
      <Introduce
        isOpen={showIntroduceModal}
        closeModal={() => setShowIntroduceModal(false)}
        introduce={introduce}
        setIntroduce={setIntroduce}
      />
      <SelectRegion isOpen={showRegionModal} closeModal={() => setShowRegionModal(false)} />
      <SelectLanguages
        isOpen={showLanguageModal}
        closeModal={() => setShowLanguageModal(false)}
        languages={languages}
        setLanguages={setLanguages}
      />
      <SimpleInputModal
        trigger="favorite-modal"
        title={t('editProfile.favorite')}
        placeholder={t('editProfile.favorite2')}
        maxLength={40}
        value={favorite}
        setValue={setFavorite}
      />
      <SimpleInputModal
        trigger="hobby-modal"
        title={t('editProfile.hobby')}
        placeholder={t('editProfile.hobby2')}
        maxLength={40}
        value={hobby}
        setValue={setHobby}
      />
      <SimpleInputModal
        trigger="pet-modal"
        title={t('editProfile.pets')}
        placeholder={t('editProfile.pets2')}
        maxLength={40}
        value={pet}
        setValue={setPet}
      />
      <SimpleInputModal
        trigger="job-modal"
        title={t('editProfile.work')}
        placeholder={t('editProfile.work2')}
        maxLength={40}
        value={job}
        setValue={setJob}
      />
      <SimpleInputModal
        trigger="school-modal"
        title={t('editProfile.school')}
        placeholder={t('editProfile.school2')}
        maxLength={40}
        value={school}
        setValue={setSchool}
      />
      <ShowAge
        isOpen={showAgeModal}
        closeModal={() => setShowAgeModal(false)}
        age={age}
        showAge={showAge}
        setShowAge={setShowAge}
      />
      <SelectCity
        isOpen={showCityModal}
        closeModal={() => setShowCityModal(false)}
        onClickItem={(item) => {
          setLocation(
            i18n.resolvedLanguage === 'ko'
              ? item.cityInfoList.filter((info) => info.langCode === 'KOREAN')[0].name
              : item.cityInfoList.filter((info) => info.langCode === 'ENGLISH')[0].name,
          );
          setPlaceId(String(item.id));
        }}
      />
    </IonPage>
  );
};

const RequiredChip = () => {
  const { t } = useTranslation();

  return (
    <span className="px-2 py-0.5 border border-orange2 bg-orange1 rounded-full font-caption1 text-orange5 shrink-0">
      {t('editProfile.required')}
    </span>
  );
};

type ImageProps = {
  image: string;
  setImage: (image: string) => void;
};
const ImageArea = ({ image, setImage }: ImageProps) => {
  const { t } = useTranslation();

  const selectPhoto = async () => {
    const selectedImage = await Camera.getPhoto({
      quality: 70,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      promptLabelHeader: t('editProfile.photo'),
      promptLabelPicture: t('editProfile.takePhoto'),
      promptLabelPhoto: t('editProfile.album'),
      promptLabelCancel: t('progress.cancel'),
    });

    if (selectedImage.webPath) {
      await FirebaseAnalytics.logEvent({
        name: 'add_profile_photo_complete',
        params: {},
      });
    }

    setImage(selectedImage.webPath ?? '');
  };

  return (
    <div className="bg-gray1 w-full h-[20.5rem] flex items-center justify-center relative overflow-hidden">
      {image ? (
        <>
          <IonImg
            src={image}
            className="object-cover w-full h-full"
            onClick={selectPhoto}
            onIonError={(e) => (e.target.src = DefaultUserImage)}
          />
          <IonIcon icon={EditIcon} className="absolute w-8 h-8 right-4 top-4" />
        </>
      ) : (
        <>
          <div className="absolute top-4 right-4">
            <RequiredChip />
          </div>

          <div className="flex flex-col items-center gap-3" onClick={selectPhoto}>
            <IonIcon icon={PlusCircleOrange} className="w-9 h-9" />
            <IonText className="font-subheading2 text-gray5.5">{t('editProfile.photo')}</IonText>
          </div>
        </>
      )}
    </div>
  );
};

type ListItemProps = {
  iconSrc: string;
  title: string;
  id?: string;
  value?: string;
  required?: boolean;
  onClick?: () => void;
};
const ListItem = ({ iconSrc, title, id, value, required, onClick }: ListItemProps) => {
  return (
    <div
      className="flex items-center justify-between py-4 border-b border-gray1.5"
      id={id}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <IonIcon icon={iconSrc} className="svg-lg" />
        <IonLabel className={value ? 'font-body1 text-gray8' : 'font-body1 text-gray5.5'}>
          {title}
          {value && `: ${value}`}
        </IonLabel>
      </div>

      {required && <RequiredChip />}
    </div>
  );
};

export default EditProfile;

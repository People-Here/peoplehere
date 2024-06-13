import { IonContent, IonPage } from '@ionic/react';

import Header from '../../components/Header';

const Privacy = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="bg-white">
        <Header type="close" />

        <div className="px-4 pb-10">
          <div className="mb-6">
            <p className="mb-1 font-body1 text-gray5">법적 약관</p>
            <p className="font-headline1 text-gray8">한국 내 정보의 수집 및 사용</p>
          </div>

          <p className="mb-6 font-headline2 text-gray8">피플히어가 수집하는 개인정보</p>

          <div className="mb-6">
            <p className="mb-2 font-headline3 text-gray8">
              피플히어 플랫폼을 이용하는 데 필요한 정보
            </p>
            <p className="mb-2 font-body2 text-gray8">
              당사는 회원님이 피플히어 플랫폼을 이용할 때 회원님의 개인정보를 수집합니다. 그렇지
              않은 경우, 피플히어는 요청하신 서비스를 회원님께 제공하지 못할 수 있습니다. 이러한
              정보에는 다음이 포합됩니다.
            </p>

            <ul className="pl-5 list-disc">
              <li className="font-body1 text-gray8">연락처 정보, 계정, 프로필 정보.</li>
              <p className="font-body2 text-gray8">
                회원님의 이름, 전화번호, 이메일 주소, 생년월일, 프로필 사진 등.
              </p>
            </ul>
          </div>

          <div className="mb-6">
            <p className="mb-2 font-headline3 text-gray8">
              회원님이 자발적으로 피플히어에 제공하는 정보
            </p>
            <p className="mb-2 font-body2 text-gray8">
              회원님은 추가적인 개인정보를 피플히어에 제공할 수 있습니다. 이러한 정보에는 다음이
              포함될 수 있습니다.
            </p>

            <ul className="pl-5 list-disc">
              <li className="font-body1 text-gray8">추가적인 프로필 정보.</li>
              <p className="font-body2 text-gray8">
                구사하는 언어, 거주 도시, 인적 사항 등. 이러한 정보는 공개 프로필 페이지에 포함되며
                다른 사람들이 볼 수 있습니다.
              </p>
            </ul>
            <ul className="pl-5 list-disc">
              <li className="font-body1 text-gray8">기타 정보.</li>
              <p className="font-body2 text-gray8">
                예를들어, 양식을 작성하거나, 계정에 정보를 추가하거나, 설문조사에 응답하거나,
                프로모션에 참여하거나, 커뮤니티에 데이트립을 만들어 올리거나, 당사의 고객지원팀 및
                다른 회원들과 소통하거나, 본인의 경험을 당사와 공유하는 경우. 여기에는 회원님이
                당사에 자발적으로 공유하는 건강정보도 포함될 수 있습니다.
              </p>
            </ul>
          </div>

          <p className="mb-6 font-headline2 text-gray8">수집한 정보의 활용</p>

          <div className="mb-6">
            <p className="mb-2 font-headline3 text-gray8">피플히어 플랫폼의 제공, 개선, 개발</p>
            <p className="mb-2 font-body2 text-gray8">예:</p>
            <ul className="pl-5 list-disc">
              <li className="font-body2 text-gray8">
                회원님이 다른 회원과 커뮤니케이션할 수 있도록 지원.
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <p className="mb-6 font-headline2 text-gray8">보유 기간</p>
            <p className="font-body2 text-gray8">
              기본적으로 사용자가 계정 삭제 또는 계정 탈퇴를 요청하는 경우 당사는 사용자의
              개인정보를 삭제 처리합니다.
            </p>
          </div>

          <div className="mb-6">
            <p className="mb-6 font-headline2 text-gray8">개인정보 수집 및 이용을 거부할 권리</p>
            <p className="font-body2 text-gray8">
              사용자는 개인정보 수집 및 이용을 거부할 권리가 있습니다. 사용자가 회원가입 과정에서
              필수로 요구되는 최소한의 개인정보의 수집 및 이용을 거부하는 경우, 피플히어 서비스
              이용이 어려울 수 있습니다.
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Privacy;

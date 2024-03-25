import { useState } from 'react';
import CloseHeader from '../../components/CloseHeader';
import { IonInput, IonItem, IonLabel } from '@ionic/react';
import LabelInput from '../../components/LabelInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <CloseHeader />

      <div className="flex flex-col items-center justify-center px-4 mt-[3.125rem]">
        <h1 className="font-suite text-orange5 text-[2rem] font-black leading-[1.875rem]">
          PeopleHere
        </h1>
        <p className="mt-4 text-center whitespace-pre-wrap font-body1 text-gray6">
          {'여기를 살아가는 사람들을 만나,\n이곳의 삶을 여행하세요.'}
        </p>

        <form>
          <LabelInput label="이메일" value={email} onChange={setEmail} />
          <LabelInput label="비밀번호" value={password} onChange={setPassword} />
        </form>
      </div>
    </>
  );
};

export default Login;

import { Route } from 'react-router';

import AlarmAgreement from '../pages/sign-in/AlarmAgreement';
import UserInfo from '../pages/sign-in/UserInfo';
import SetPassword from '../pages/sign-in/SetPassword';
import EmailAuth from '../pages/sign-in/EmailAuth';
import PhoneAuth from '../pages/sign-in/PhoneAuth';

const SigninRouter = () => {
  return (
    <>
      <Route path="/sign-in/phone">
        <PhoneAuth />
      </Route>
      <Route path="/sign-in/email">
        <EmailAuth />
      </Route>
      <Route path="/sign-in/password">
        <SetPassword />
      </Route>
      <Route path="/sign-in/info">
        <UserInfo />
      </Route>
      <Route path="/sign-in/alarm">
        <AlarmAgreement />
      </Route>
    </>
  );
};

export default SigninRouter;

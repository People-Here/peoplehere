import { Redirect, Route } from 'react-router';

import Region from './pages/region/Region';
import HomeTab from './tabs/HomeTab';
import BookmarkTab from './tabs/BookmarkTab';
import PostTab from './tabs/PostTab';
import Message from './tabs/MessageTab';
import ProfileTab from './tabs/ProfileTab';
import Login from './pages/login/Login';
import PhoneAuth from './pages/sign-in/PhoneAuth';
import EmailAuth from './pages/sign-in/EmailAuth';
import SetPassword from './pages/sign-in/SetPassword';
import UserInfo from './pages/sign-in/UserInfo';
import AlarmAgreement from './pages/sign-in/AlarmAgreement';
import CheckEmail from './pages/login/CheckEmail';
import ResetPassword from './pages/login/ResetPassword';
import Search from './pages/search/Search';
import ProfileOnboarding from './pages/profile/Onboarding';

const Router = () => {
  return (
    <>
      <Route exact path="/home">
        <HomeTab />
      </Route>
      <Route exact path="/bookmark">
        <BookmarkTab />
      </Route>
      <Route path="/post">
        <PostTab />
      </Route>
      <Route path="/message">
        <Message />
      </Route>
      <Route path="/profile">
        <ProfileTab />
      </Route>

      <Route path="/search">
        <Search />
      </Route>

      <Route path="/region">
        <Region />
      </Route>

      <Route exact path="/login">
        <Login />
      </Route>

      <Route exact path="/reset-password">
        <ResetPassword />
      </Route>
      <Route path="/reset-password/check-email">
        <CheckEmail />
      </Route>

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

      <Route path={'/profile/onboarding'}>
        <ProfileOnboarding />
      </Route>

      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </>
  );
};

export default Router;

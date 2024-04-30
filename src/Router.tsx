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
import EditProfile from './pages/profile/EditProfile';
import Profile from './pages/profile/Profile';
import MessageRoom from './pages/message/MessageRoom';
import Preview from './pages/post/Preview';
import Settings from './pages/settings/Settings';
import Policy from './pages/settings/Policy';
import Privacy from './pages/settings/Privacy';
import Informations from './pages/settings/Informations';
import ChangeName from './pages/settings/ChangeName';
import ChangeEmail from './pages/settings/ChangeEmail';
import ManageAlerts from './pages/settings/ManageAlerts';
import Support from './pages/settings/Support';

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
      <Route exact path="/message">
        <Message />
      </Route>
      <Route exact path="/profile">
        <ProfileTab />
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

      <Route path="/profile/:id">
        <Profile />
      </Route>
      <Route path="/profile/edit">
        <EditProfile />
      </Route>

      <Route path="/message/:id">
        <MessageRoom />
      </Route>

      <Route path="/post/preview">
        <Preview />
      </Route>

      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="/settings/informations">
        <Informations />
      </Route>
      <Route path="/settings/informations/name">
        <ChangeName />
      </Route>
      <Route path="/settings/informations/email">
        <ChangeEmail />
      </Route>
      <Route path="/settings/alert">
        <ManageAlerts />
      </Route>
      <Route path="/settings/support">
        <Support />
      </Route>
      <Route path="/settings/policy">
        <Policy />
      </Route>
      <Route path="/settings/policy/privacy">
        <Privacy />
      </Route>

      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </>
  );
};

export default Router;

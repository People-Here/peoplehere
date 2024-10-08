import { Redirect, Route } from 'react-router';

import Region from './pages/region/Region';
import HomeTab from './tabs/HomeTab';
import BookmarkTab from './tabs/BookmarkTab';
import PostTab from './tabs/PostTab';
import Message from './tabs/MessageTab';
import ProfileTab from './tabs/ProfileTab';
import Login from './pages/login/Login';
import PhoneAuth from './pages/sign-up/PhoneAuth';
import EmailAuth from './pages/sign-up/EmailAuth';
import SetPassword from './pages/sign-up/SetPassword';
import UserInfo from './pages/sign-up/UserInfo';
import AlarmAgreement from './pages/sign-up/AlarmAgreement';
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
import TourDetail from './pages/tour/TourDetail';
import ChangeStatus from './pages/my-page/ChangeStatus';
import Translate from './pages/settings/Translate';
import ChangePhone from './pages/settings/ChangePhone';
import FullPageMap from './pages/map/FullPageMap';
import ConfirmPlace from './pages/post/ConfirmPlace';
import EditPost from './pages/post/EditPost';

const Router = () => {
  return (
    <>
      <Route exact path="/home">
        <HomeTab />
      </Route>
      <Route exact path="/bookmark">
        <BookmarkTab />
      </Route>
      <Route exact path="/post">
        <PostTab />
      </Route>
      <Route exact path="/message">
        <Message />
      </Route>
      <Route exact path="/profile">
        <ProfileTab />
      </Route>
      <Route exact path="/detail-profile/:id">
        <Profile />
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

      <Route path="/sign-up/phone">
        <PhoneAuth />
      </Route>
      <Route path="/sign-up/email">
        <EmailAuth />
      </Route>
      <Route path="/sign-up/password">
        <SetPassword />
      </Route>
      <Route path="/sign-up/info">
        <UserInfo />
      </Route>
      <Route path="/sign-up/alarm">
        <AlarmAgreement />
      </Route>

      <Route path="/edit-profile">
        <EditProfile />
      </Route>

      <Route path="/change-status/:id">
        <ChangeStatus />
      </Route>

      <Route path="/room-message/:id">
        <MessageRoom />
      </Route>

      <Route path="/edit-post">
        <EditPost />
      </Route>
      <Route path="/preview-post">
        <Preview />
      </Route>
      <Route path="/confirm-place">
        <ConfirmPlace />
      </Route>

      <Route exact path="/settings">
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
      <Route path="/settings/informations/phone">
        <ChangePhone />
      </Route>
      <Route path="/settings/translate">
        <Translate />
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

      <Route path="/tour/:id">
        <TourDetail />
      </Route>

      <Route path="/place-map">
        <FullPageMap />
      </Route>

      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </>
  );
};

export default Router;

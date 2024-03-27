import { Redirect, Route } from 'react-router';
import Region from './pages/region/Region';
import Home from './tabs/Home';
import Bookmark from './tabs/Bookmark';
import Post from './tabs/Post';
import Message from './tabs/Message';
import Profile from './tabs/Profile';
import Login from './pages/login/Login';
import PhoneAuth from './pages/sign-in/PhoneAuth';
import EmailAuth from './pages/sign-in/EmailAuth';
import SetPassword from './pages/sign-in/SetPassword';

const Router = () => {
  return (
    <>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/bookmark">
        <Bookmark />
      </Route>
      <Route path="/post">
        <Post />
      </Route>
      <Route path="/message">
        <Message />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>

      <Route exact path="/login">
        <Login />
      </Route>
      <Route path="/login/region">
        <Region />
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

      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </>
  );
};

export default Router;

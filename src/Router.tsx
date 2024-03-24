import { Redirect, Route } from 'react-router';
import LoginLanding from './pages/login/LoginLanding';
import Home from './tabs/Home';
import Bookmark from './tabs/Bookmark';
import Post from './tabs/Post';
import Message from './tabs/Message';
import Profile from './tabs/Profile';

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
      <Route path="/login">
        <LoginLanding />
      </Route>

      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </>
  );
};

export default Router;

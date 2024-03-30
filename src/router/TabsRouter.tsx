import { Route } from 'react-router';

import Home from '../tabs/Home';
import Bookmark from '../tabs/Bookmark';
import Post from '../tabs/Post';
import Message from '../tabs/Message';
import Profile from '../tabs/Profile';

const TabsRouter = () => {
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
    </>
  );
};

export default TabsRouter;

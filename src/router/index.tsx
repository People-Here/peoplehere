import { Redirect, Route } from 'react-router';

import LoginRouter from './LoginRouter';
import ResetPasswordRouter from './ResetPasswordRouter';
import SigninRouter from './SigninRouter';
import TabsRouter from './TabsRouter';

const Router = () => {
  return (
    <>
      <TabsRouter />
      <LoginRouter />
      <ResetPasswordRouter />
      <SigninRouter />

      <Route path="/">
        <Redirect to="/home" />
      </Route>
    </>
  );
};

export default Router;

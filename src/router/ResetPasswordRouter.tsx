import { Route } from 'react-router';

import CheckEmail from '../pages/login/CheckEmail';
import ResetPassword from '../pages/login/ResetPassword';

const ResetPasswordRouter = () => {
  return (
    <>
      <Route exact path="/reset-password">
        <ResetPassword />
      </Route>
      <Route path="/reset-password/check-email">
        <CheckEmail />
      </Route>
    </>
  );
};

export default ResetPasswordRouter;

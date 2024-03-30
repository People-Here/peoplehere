import { Route } from 'react-router';

import Login from '../pages/login/Login';
import Region from '../pages/region/Region';

const LoginRouter = () => {
  return (
    <>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route path="/login/region">
        <Region />
      </Route>
    </>
  );
};

export default LoginRouter;

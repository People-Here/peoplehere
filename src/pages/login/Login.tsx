import useRegionStore from '../../stores/user';

const Login = () => {
  const userRegion = useRegionStore((state) => state.region);

  return <div>login</div>;
};

export default Login;

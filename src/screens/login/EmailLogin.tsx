import Input from '@components/Input';
import { useState } from 'react';
import { SafeAreaView } from 'react-native';

const EmailLoginScreen = () => {
  const [value, setValue] = useState('');

  return (
    <SafeAreaView>
      <Input type='email' value={value} onChange={setValue} label='Email' />
    </SafeAreaView>
  );
};

export default EmailLoginScreen;

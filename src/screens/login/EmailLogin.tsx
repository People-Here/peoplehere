import Input from '@components/Input';
import { useState } from 'react';
import { SafeAreaView, Text } from 'react-native';

const EmailLoginScreen = () => {
  const [value, setValue] = useState('');

  return (
    <SafeAreaView>
      <Text>email login</Text>
      <Input type='text' value={value} onChange={setValue} label='Email' />
    </SafeAreaView>
  );
};

export default EmailLoginScreen;

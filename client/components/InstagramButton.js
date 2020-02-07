import React from 'react';
import { Linking } from 'react-native'
import { Entypo } from '@expo/vector-icons';

export default function FacebookButton ({ link }) {
  return (
    <Entypo
      name='instagram'
      color='#59C3D1'
      style={{padding: 5}}
      size={34}
      onPress={() => {
        Linking.openURL(`${link}`);
      }}
    />
  )
}

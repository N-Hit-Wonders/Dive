import React, { useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  SafeAreaView,
  SectionList, 
} from 'react-native';
import { SignedInContext } from '../App'
import MenuButton from '../components/MenuButton'

export default function Shows(props) {
  ///global user signin info and editing function
  const [userInfo, setUserInfo] = useContext(SignedInContext);

  return (
    <View style={styles.container}>
      <MenuButton navigation={props.navigation}/>
      <Text style={styles.text}>Shows</Text>
    </View>


    <SafeAreaView style={styles.container}>
      <SectionList
        sections={'DATA'}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D323A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    color: '#fff'
  }
})

import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { AsyncStorage, Dimensions } from 'react-native';
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import MaStyles from '../assets/styles/MaStyles';
import Globals from '../constants/Globals';
import logo from '../assets/images/logokia.png';
import { newCar, RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

export default function NewCarScreen({ navigation }) {

  const [newCars, setNewCars] = useState([]);

  useEffect(() => {
    getNewCars()
  }, []);

  const viewSubModels = async (model: any,make:any) => {
    await AsyncStorage.setItem('model', model);
    await AsyncStorage.setItem('fk_make', make);
    navigation.navigate('NewCar', {
      screen: 'SubModel',
      //params: { idModel: id }
    })
  }

  const getNewCars = async () => {

    fetch(Globals.BASE_URL + "Maxauto/getMainNewCar")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setNewCars(data.data);
      });
  }

  const renderItem = ({ item }) => {
    //const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';

    return ( 

      <TouchableOpacity 
      onPress={() => viewSubModels(item.fk_make,item.model)}
      >
        <View style={{ marginHorizontal: 20, marginVertical: 15, backgroundColor: "#0e4e922b", borderRadius: 7 }}>
          <Text style={{ position: "absolute", marginTop: 42, marginStart: 10 }}>
            {item.make_description}
          </Text>
          <Image
            style={{ width: 60, height: 30, marginTop: 10, marginStart: 0 }}
            source={logo}
          />
          <Text style={{ position: "absolute", marginTop: 60, marginStart: 10, fontFamily: "commi_medium", fontSize: 20 }}>
            {item.model}
          </Text>
          <Image
            style={{ aspectRatio: 3 / 2, width: width / 1.3, alignSelf:"center" }}
            source={{
              uri:
                "https://maxauto.s3-ap-southeast-2.amazonaws.com/maxauto/" + item.url_image
            }}
          />
        </View>
      </TouchableOpacity>);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[MaStyles.textHeader, { marginHorizontal: 20, marginTop: 20 }]}>New Cars</Text>
      <FlatList
        data={newCars}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      //extraData={selectedId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  }, 
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

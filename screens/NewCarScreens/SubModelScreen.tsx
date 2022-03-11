import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ImageBackground, Image, TextInput, Dimensions, AsyncStorage, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import MaStyles from '../../assets/styles/MaStyles';
import Globals from '../../constants/Globals';
import logo from '../../assets/images/logokia.png';

import { NewsCarStackParamList } from '../../types';

const { width, height } = Dimensions.get('window');

export default function SubModelScreen({ route, navigation }) {

    const [newCars, setNewCars] = useState([]);

    const [mainModel, setMainModel] = useState([]);
    const [secondsModel, setSecondsModels] = useState([]);

    useEffect(() => {
        setup()
    }, []);

    const setup = async () => {
        const modelId = await AsyncStorage.getItem('model');
        const fk_make = await AsyncStorage.getItem('fk_make');

        console.log(modelId + "-" + fk_make);
        getNewCars(modelId, fk_make);
    }

    const getNewCars = async (model, make) => {
        fetch(Globals.BASE_URL + "Maxauto/getSubModels/" + make + "/" + model)
            .then(response => response.json())
            .then(data => {
                let newCars = data.data
                let mainModel;
                let secondsModel = [];
                for (let i = 0; i < newCars.length; i++) {
                    console.log()

                    if (newCars[i].mainmodel == "1") {
                        mainModel = newCars[i]
                    } else {
                        secondsModel.push(newCars[i]);
                    }
                }
                setMainModel(mainModel);
                setSecondsModels(secondsModel);
            });
    }

    const renderItem = ({ item }) => {
        //const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';

        return (
            <TouchableOpacity>
                <View style={{ marginHorizontal: 20, marginVertical: 15, backgroundColor: "#0e4e922b", borderRadius: 7 }}>
    
                    <Image
                        style={{ width: 40, height: 30, marginTop: 10, marginStart: 0 }}
                        source={logo}
                    />
                    <Text style={{ position: "absolute", marginTop: 40, marginStart: 10, fontFamily: "commi_medium", fontSize: 15 }}>
                         {item.submodel}
                    </Text>
                    <View style={{overflow:"hidden",marginTop:10}}>
                        <Image
                            style={{ aspectRatio: 4 / 2, width: width / 1.5, alignSelf: "center",
                            transform: [{ translateX: 65 }],overflow:"hidden" }}
                            source={{
                                uri:
                                    "https://maxauto.s3-ap-southeast-2.amazonaws.com/maxauto/" + item.url_image
                            }}
                        />
                    </View>

                </View>
            </TouchableOpacity>);
    };
    //use effect
    // const logged = await AsyncStorage.getItem('logged');
    //const { idModel } = ; 

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[MaStyles.textHeader, { marginHorizontal: 20, marginTop: 20 }]}>New Cars</Text>
            <TouchableOpacity>
                <View style={{ marginHorizontal: 20, marginVertical: 15, backgroundColor: "#0e4e922b", width: width - 40, borderRadius: 7 }}>
                    <Text style={{ position: "absolute", marginTop: 42, marginStart: 10 }}>
                        {mainModel.make_description}
                    </Text>
                    <Image
                        style={{ width: 60, height: 30, marginTop: 10, marginStart: 0 }}
                        source={logo}
                    />
                    <Text style={{ position: "absolute", marginTop: 60, marginStart: 10, fontFamily: "commi_medium", fontSize: 20 }}>
                        {mainModel.model} {mainModel.submodel}
                    </Text>
                    <View style={{overflow:"hidden",marginTop:10}}>
                    <Image
                        style={{ aspectRatio: 3 / 2, width: width / 1.1, alignSelf: "flex-end", position: "relative",
                        transform: [{ translateX: 65 }],overflow:"hidden"
                    }}
                        source={{
                            uri:
                                "https://maxauto.s3-ap-southeast-2.amazonaws.com/maxauto/" + mainModel.url_image
                        }}
                    />
                    </View>
                </View>
            </TouchableOpacity>

            <FlatList
                horizontal={true}
                data={secondsModel}
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



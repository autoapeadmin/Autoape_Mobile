import { Component } from 'react';
import React, { useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { Card } from 'react-native-shadow-cards';
import MaStyles from '../../assets/styles/MaStyles';
import Globals from '../../constants/Globals';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function VehicleListGrid(props) {

    const [listCar, setListCar] = useState([]);
    const [page, setPage] = useState(1);
    const [refresh, setRefresh] = useState(true);
    const [showingList, setShowingListing] = useState([]);
    const [urlCall, setUrlCall] = useState("");


    useEffect(() => {
        setupPage()
    }, []);

    const setupPage = () => {
        console.log(props.listVehicle);
        setListCar(paginate(props.listVehicle, 10, 1));
        setShowingListing(props.listVehicle);
        setUrlCall(props.urlPagination);
        setRefresh(!refresh);
        //setShowingListing( setShowingListing(paginate(listCar,10,1)););

        console.log(urlCall);
    }

    const paginate = (array, page_size, page_number) => {
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    const loadMore = () => {
        let ind = page + 1;
        console.log("***********************************...................................");
        console.log(ind);
        console.log(paginate(showingList, 10, ind));
        let array = paginate(showingList, 10, ind);
        setListCar(listCar.concat(array));
        setPage(ind);

        // setPage(page + 1)

        // let datas = urlCall + page + "/" + checked
        // console.log(datas);

        // fetch(urlCall + page)
        //     .then(response => response.json())
        //     .then(data => {
        //         let array = data.data;
        //         array.forEach(element => {
        //             listCar.push(element);
        //         });
        //     });
    };

    const getDetails = (id: string) => {
        //navigation.navigate('CarDetails', {
        //    carId: id
        //});
    }

    const format = (amount) => {
        return Number(amount)
            .toFixed(0)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };

    return (
        <FlatList
            style={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
            data={listCar}
            numColumns={2}
            onEndReached={loadMore}
            extraData={refresh}
            keyExtractor={item => item.pic_url}
            renderItem={({ item }) => {
                return (
                    <Card style={{ width: width / 2 - 30, margin: 8, borderRadius: 0 }} >
                        <TouchableOpacity
                            onPress={() => getDetails(item.vehicule_id)}
                        >

                            <Image source={{ uri: Globals.S3_THUMB_URL + item.pic_url }} resizeMode='cover' style={{ width: "100%", height: 100, marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }} />
                            <View style={{ margin: 8, marginBottom: 15 }}>
                                <Text style={MaStyles.TextCard}>{item.vehicule_year} {item.make_description} {item.model_desc}</Text>
                                <Text style={MaStyles.subTextCard}>${format(item.vehicule_price)}</Text>
                            </View>
                        </TouchableOpacity>
                    </Card>
                )
            }
            }
        />
    )

}

export default VehicleListGrid;
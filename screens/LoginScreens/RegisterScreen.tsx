import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, TextInput, AsyncStorage } from 'react-native';
import MaStyles from '../../assets/styles/MaStyles';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import { Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';


import { LoginStackParamList } from '../../types';
import Globals from '../../constants/Globals';
import { AntDesign } from '@expo/vector-icons';
import { Col, Grid } from 'react-native-easy-grid';
import Toast from 'react-native-toast-message';


export default function RegisterScreen({ navigation }: StackScreenProps<LoginStackParamList, 'Login'>) {

    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    //validations
    const [vFullName, setVFull] = useState(true);
    const [vEmail, setVEmail] = useState(true);
    const [vPassword, setVPass] = useState(true);

    const [allOk, setAllOk] = useState(false);

    const [showToast, setShowToast] = useState(false);

    //Listo
    const handleSignInResult = async (result: Google.LogInResult) => {

        //$name = $this->input->post_get('name');
        //$email = $this->input->post_get('email');
        //$mobile = $this->input->post_get('mobile');
        //$password = $this->input->post_get("password");
        fetch(Globals.BASE_URL + "Maxauto/signInGoogle?social_id=" + result.user.id + "&social_name=" + result.user.name + "&social_email=" + result.user.email + "&access_token=1030")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUser(data.data.customer_id);
            });

        await AsyncStorage.setItem('customer_id', user);
        await AsyncStorage.setItem('login_token', result.user.id);
        await AsyncStorage.setItem('user_name', result.user.name);
        await AsyncStorage.setItem('user_photo', result.user.photoUrl);
        await AsyncStorage.setItem('logged', "true");

        navigation.replace("Root");

    }
    //Listo

    const signUp = async () => {

        if (vFullName && vEmail && vPassword) { setAllOk(true) }

        if (!password) { setAllOk(false); setVPass(false) }
        if (!name) { setAllOk(false); setVFull(false) }
        if (!user) { setAllOk(false); setVEmail(false) }

        if (allOk) {
            setLoading(true);
            fetch(Globals.BASE_URL + "Maxauto/signUp?email=" + user.toLowerCase() + "&password=" + password + "&name=" + name + "&access_token=1030")
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    //setUser(data.data.customer_id);
                    if (data.errorcode != 0) {
                        Toast.show({
                            type: 'error',
                            position: 'top',
                            text1: 'Error',
                            text2: data.errormsg,
                            topOffset: 50,
                        });
                    } else {

                    }
                });

        } else {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Empty Fields',
                text2: 'Empty fields👋',
                topOffset: 50,
            });
        }
    }
    //await AsyncStorage.setItem('customer_id', data.customer_id);
    //await AsyncStorage.setItem('customer_id', user);
    //await AsyncStorage.setItem('login_token', result.user.id);
    //await AsyncStorage.setItem('user_name', result.user.name);
    //await AsyncStorage.setItem('user_photo', result.user.photoUrl);
    //await AsyncStorage.setItem('logged', "true");‡



    const handleSignInEmail = async () => {

        console.log("aca");
        fetch(Globals.BASE_URL + "Maxauto/signInEmail?email=" + user + "&password=" + password + "&access_token=1030")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setUser(data.data.customer_id);
            });

        await AsyncStorage.setItem('customer_id', user);
        //await AsyncStorage.setItem('login_token', result.user.id);
        //await AsyncStorage.setItem('user_name', result.user.name);
        //await AsyncStorage.setItem('user_photo', result.user.photoUrl);
        await AsyncStorage.setItem('logged', "true");

    }

    const handlesignInFacebook = async () => {

    }

    const signInAsync = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: "210955108243-4gcovdsa11l5c9jaj6omhc4t13pnn85h.apps.googleusercontent.com",
                iosClientId: "210955108243-4n9m00tcu995pophga98u2qf7rsp06a9.apps.googleusercontent.com",
                scopes: ["profile", "email"]
            });

            if (result.type === "success") {
                console.log(result)
                handleSignInResult(result);
            } else {
                return { cancelled: true };
            }
        } catch (err) {
            console.log("err:", err);
        }
    };

    async function signInFacebook() {
        try {
            await Facebook.initializeAsync({
                appId: '285038205957351',
            });
            const {
                type,
                token,
                expirationDate,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email', 'first_name'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                //Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
                console.log((await response.json()));
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            alert(console.log(message));
        }
    }

    const loginFacebook = () => {
        signInFacebook();
    }

    const loginGoogle = () => {
        signInAsync();
    };

    const loginEmail = () => {
        handleSignInEmail();
    };


    //validacion
    const validateFullName = (text: string) => {
        if (text != "") {
            setName(text)
            setVFull(true)
        }
        else {
            setVFull(false)
        }
    }

    const validateEmail = (text: string) => {
        if (text != "") {
            setUser(text)
            setVEmail(true)
        }
        else {
            setVEmail(false)
        }
    }

    const validatePassword = (text: string) => {
        if (text != "") {
            setPassword(text)
            setVPass(true)
        }
        else {
            setVPass(false)
        }
    }



    return (
        <View style={MaStyles.container}>

            <Spinner
                visible={loading}
                textContent={'Loading...'}
            />

            <View style={{ flex: 1 }}>
                <Text style={MaStyles.textHeader}>Create an account </Text>
            </View>

            <View style={{ flex: 2, width: "100%" }}>
                <TextInput placeholderTextColor={'gray'} placeholder={"Enter your full name"} style={vFullName ? MaStyles.textInput : MaStyles.textInputInvalidate}
                    onChangeText={(text) => validateFullName(text)}
                />

                <TextInput placeholderTextColor={'gray'} placeholder={"Enter your email"} style={vEmail ? MaStyles.textInputUnder : MaStyles.textInputInvalidateUnder}
                    onChangeText={text => validateEmail(text)}
                />

                <TextInput placeholderTextColor={'gray'} secureTextEntry={true} placeholder={"Enter your password"} style={vPassword ? MaStyles.textInputUnder : MaStyles.textInputInvalidateUnder}
                    onChangeText={text => validatePassword(text)}
                />
                <Text style={[MaStyles.subText, { marginTop: 15, marginHorizontal: 4 }]}>By registering, you confirm that you accept our Term of Use and Privace Policy</Text>
            </View>

            <View style={{ flex: 7, width: "100%" }}>
                <TouchableOpacity style={{ marginTop: 80 }} onPress={() => signUp()}>
                    <View style={MaStyles.buttonView}>
                        <Text style={MaStyles.buttonText}>JOIN US</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ marginTop: 50, width: "100%" }}>
                    <Text style={{ alignSelf: "center" }}>Or</Text>
                </View>

                <View style={{ marginTop: 30 }}>
                    <TouchableOpacity style={{ marginTop: 0 }} onPress={() => loginFacebook()}>
                        <View style={MaStyles.buttonView}>
                            <Grid>
                                <Col><AntDesign name="facebook-square" size={20} color="white" style={{ alignSelf: "flex-end", marginTop: 13, marginEnd: 5 }} />
                                </Col>
                                <Col size={2}><Text style={MaStyles.buttonText}>Sign in with facebook</Text>
                                </Col>
                            </Grid>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 0 }} onPress={() => loginGoogle()}>
                        <View style={MaStyles.buttonViewWhite}>
                            <Grid>
                                <Col><AntDesign name="google" size={20} color="#0e4e92" style={{ alignSelf: "flex-end", marginTop: 13, marginEnd: 5 }} />
                                </Col>
                                <Col size={2}><Text style={MaStyles.buttonTextWhite}>Sign in with google</Text>
                                </Col>
                            </Grid>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
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
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
});

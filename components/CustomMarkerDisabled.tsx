import React from 'react';
import { StyleSheet, Image } from 'react-native';

class CustomMarkerNo extends React.Component {
    
    render() {
        return (
            <Image
                style={styles.image}
                source={
                    this.props.pressed ? require('../assets/images/icons/filled-circleno.png') : require('../assets/images/icons/filled-circleno.png')
                }
                resizeMode="contain"
            />
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 25,
        width: 25,
        marginTop:5
    },
});

export default CustomMarkerNo;
import React from 'react';
import { StyleSheet, Image } from 'react-native';

class CustomMarker extends React.Component {
    
    render() {
        return (
            <Image
                style={styles.image}
                source={
                    this.props.pressed ? require('../assets/images/icons/dry-clean.png') : require('../assets/images/icons/dry-clean.png')
                }
                resizeMode="contain"
            />
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 33,
        width: 33,
        marginTop:5
    },
});

export default CustomMarker;
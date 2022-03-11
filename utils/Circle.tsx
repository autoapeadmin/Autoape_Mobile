import * as React from 'react';
import {
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Animated,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';
import { AntDesign } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);

const DURATION = 1000;
const TEXT_DURATION = DURATION * 0.8;

const quotes = [
  {
    quote:
      'For the things we have to learn before we can do them, we learn by doing them.',
    author: 'Aristotle, The Nicomachean Ethics',
  },
  {
    quote: 'The fastest way to build an app.',
    author: 'The Expo Team',
  },
  {
    quote:
      'The greatest glory in living lies not in never falling, but in rising every time we fall.',
    author: 'Nelson Mandela',
  },
  {
    quote: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
  },
  {
    quote:
      "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking.",
    author: 'Steve Jobs',
  },
  {
    quote:
      'If life were predictable it would cease to be life, and be without flavor.',
    author: 'Eleanor Roosevelt',
  },
  {
    quote:
      "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
    author: 'Oprah Winfrey',
  },
  {
    quote:
      "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
    author: 'James Cameron',
  },
  {
    quote: "Life is what happens when you're busy making other plans.",
    author: 'John Lennon',
  },
];

const Circle = ({ onPress, index, quotes, animatedValue, animatedValue2 }) => {
  const { initialBgColor, nextBgColor, bgColor } = colors[index];
  const inputRange = [0, 0.001, 0.5, 0.501, 1];
  const backgroundColor = animatedValue2.interpolate({
    inputRange,
    outputRange: [
      initialBgColor,
      initialBgColor,
      initialBgColor,
      bgColor,
      bgColor,
    ],
  });
  const dotBgColor = animatedValue2.interpolate({
    inputRange: [0, 0.001, 0.5, 0.501, 0.9, 1],
    outputRange: [
      bgColor,
      bgColor,
      bgColor,
      initialBgColor,
      initialBgColor,
      nextBgColor,
    ],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.container,
        { backgroundColor },
      ]}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: dotBgColor,
            transform: [
              { perspective: 200 },
              {
                rotateY: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ['0deg', '-90deg', '-180deg'],
                }),
              },

              {
                scale: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 6, 1],
                }),
              },

              {
                translateX: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ['0%', '50%', '0%'],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={onPress}>
          <Animated.View
            style={[
              styles.button,
              {
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [0, 0.05, 0.5, 1],
                      outputRange: [1, 0, 0, 1],
                      // extrapolate: "clamp"
                    }),
                  },
                  {
                    rotateY: animatedValue.interpolate({
                      inputRange: [0, 0.5, 0.9, 1],
                      outputRange: ['0deg', '180deg', '180deg', '180deg'],
                    }),
                  },
                ],
                opacity: animatedValue.interpolate({
                  inputRange: [0, 0.05, 0.9, 1],
                  outputRange: [1, 0, 0, 1],
                }),
              },
            ]}
          >
            <AnimatedAntDesign name='arrowright' size={28} color={'white'} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

/* 
initialBgColor -> Big background of the element
bgColor -> initial circle bg color that will be the next slide initial BG Color
nextBgColor -> next circle bg color after we fully transition the circle and this will be small again
prev bgColor === next initialBgColor
prev nextBgColor === next bgColor
*/

const colors = [
  {
    initialBgColor: 'goldenrod',
    bgColor: '#222',
    nextBgColor: '#222',
  },
  {
    initialBgColor: 'goldenrod',
    bgColor: '#222',
    nextBgColor: 'yellowgreen',
  },
  {
    initialBgColor: '#222',
    bgColor: 'yellowgreen',
    nextBgColor: 'midnightblue',
  },
  {
    initialBgColor: 'yellowgreen',
    bgColor: 'midnightblue',
    nextBgColor: 'turquoise',
  },
  {
    initialBgColor: 'midnightblue',
    bgColor: 'turquoise',
    nextBgColor: 'goldenrod',
  },
  {
    initialBgColor: 'turquoise',
    bgColor: 'goldenrod',
    nextBgColor: '#222',
  },
];


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingTop: Constants.statusBarHeight,
      padding: 8,
      paddingBottom: 50,
    },
    paragraph: {
      margin: 12,
      fontSize: 24,
      // fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'Menlo',
      color: 'white',
    },
    button: {
      height: 100,
      width: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      backgroundColor: 'turquoise',
      width: 100,
      height: 100,
      borderRadius: 50,
    },
  });
  
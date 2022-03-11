import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import Toast from "react-native-toast-message";
import * as Sentry from "sentry-expo";
import * as Notifications from "expo-notifications";
import firebase, { initializeApp } from "firebase";

// Show notifications when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

const firebaseConfig = {
  apiKey: "AIzaSyBFZlgYEAqHJH7D6UQWALnF5_yAG6w9-To",
  authDomain: "autoape-f56e1.firebaseapp.com",
  projectId: "autoape-f56e1",
  storageBucket: "autoape-f56e1.appspot.com",
  messagingSenderId: "71850515731",
  appId: "1:71850515731:web:b1527ed9388b8e0b0b0ee6",
  measurementId: "G-H3FSDJ8GHE",
};

if (firebase.apps.length === 0) {
  initializeApp(firebaseConfig);
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  //Alvaro 23d
  Sentry.init({
    dsn: "https://935290a40bbb4bc095586a95d6da29c9@o820474.ingest.sentry.io/5809101",
    enableInExpoDevelopment: true,
    debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
  });

  if (!isLoadingComplete) {
    return <Text>Aca</Text>;
  } else {
    //cambiar color en la barra de notificaciones.
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar style="dark-content" />
        <Toast ref={(ref: any) => Toast.setRef(ref)} />
      </SafeAreaProvider>
    );
  }
}

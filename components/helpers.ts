import { Alert } from "react-native";

export async function fetchPublishableKey(
  paymentMethod?: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://saber-strengthened-beech.glitch.me/stripe-key?paymentMethod=${paymentMethod}`
    );

    const { publishableKey } = await response.json();

    return publishableKey;e   
  } catch (e) {
    console.warn("Unable to fetch publishable key. Is your server running?");
    Alert.alert(
      "Error",
      "Unable to fetch publishable key. Is your server running?"
    );
    return null;
  }
}

import { Text, Dimensions } from "react-native";
import React from "react";
import { Col, Grid, Row } from "react-native-easy-grid";
import styles from "./styles";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { Calendar } from "react-native-calendars";

const height = Dimensions.get("window").height;

type CalendarModalProps = {
  title: string;
  onBackdropPress: () => void;
  onBackButtonPress: () => void;
  onDayPress: (day: any) => void;
  isVisible: boolean;
  value?: Date;
};

export default function CalendarModal(props: CalendarModalProps) {
  return (
    <Modal
      onBackButtonPress={() => props.onBackButtonPress}
      onBackdropPress={() => props.onBackdropPress}
      deviceHeight={height}
      animationIn={"slideInUp"}
      isVisible={props.isVisible}
      style={styles.modalContainer}
    >
      <Grid style={{ width: "100%" }}>
        <Row style={{ width: "100%" }}>
          <Calendar
            markingType={"custom"}
            current={props.value}
            onDayPress={(day) => {
              props.onDayPress(day);
            }}
            style={styles.calendar}
            hid
          />
        </Row>
      </Grid>
    </Modal>
  );
}

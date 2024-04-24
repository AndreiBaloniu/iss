import React from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
const IntroScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.buttonContainerSkip}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Intro3")}
            style={styles.buttonSkip}
          >
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Hello there</Text>
        <Text style={styles.text}>Welcome to SmartSubs</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Intro2")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  headerText: {
    fontSize: 16,
    textAlign: "right",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 400,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  footer: {
    width: "100%",
  },
  buttonContainerSkip: {
    width: "20%",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 20,
  },
  buttonSkip: {
    backgroundColor: "#FFF100",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#FFF100",
    width: "100%",
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default IntroScreen1;

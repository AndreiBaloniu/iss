import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import { auth, db } from "../firebase"; // Import auth and db from firebase
import { get, ref, set } from "firebase/database"; // Import get and ref from firebase/database

const WelcomeEmployee = ({ navigation }) => {
  const [email, setUserEmail] = useState("");
  const [emailPrefix, setEmailPrefix] = useState(""); // State to store email prefix
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { email } = user;
        setUserEmail(email);

        // Extract email prefix before "@" symbol
        const prefix = email.split("@")[0];
        setEmailPrefix(prefix);
      }
    });

    return unsubscribe; // Unsubscribe when component unmounts
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (email) {
          const userDataRef = ref(db, `users/${email.replace(".", "_")}`);
          const snapshot = await get(userDataRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setStatus(userData.status);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [email]);

  const handleCheckIn = () => {
    if (status === "Out") {
      setStatus("In");
      // Update status in the database
      const userRef = ref(db, `users/${email.replace(".", "_")}`);
      set(userRef, { status: "In" }) // Update user status
        .then(() => {
          console.log("Check-in successful");
          setModalMessage("Check-in successful!");
          setShowModal(true);
        })
        .catch((error) => {
          console.error("Error updating status:", error);
        });
    } else {
      console.log("User already checked in");
      setModalMessage("You have already checked in!");
      setShowModal(true);
    }
  };

  const handleCheckOut = () => {
    if (status === "In") {
      setStatus("Out");
      // Update status in the database
      const userRef = ref(db, `users/${email.replace(".", "_")}`);
      set(userRef, { status: "Out" }) // Update user status
        .then(() => {
          console.log("Check-out successful");
          setModalMessage("Check-out successful!");
          setShowModal(true);
        })
        .catch((error) => {
          console.error("Error updating status:", error);
        });
    } else {
      console.log("User already checked out");
      setModalMessage("You have already checked out!");
      setShowModal(true);
    }
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>
      <Text style={styles.welcome}>Welcome</Text>
      <Text style={styles.welcome}>{emailPrefix}!</Text>
      <TouchableOpacity onPress={status === "Out" ? handleCheckIn : handleCheckOut} style={status === "Out" ? styles.button2 : styles.button3}>
        <Text style={styles.buttonText}>{status === "Out" ? "Check-In" : "Check-Out"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("AssignmentsEmployee")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>View Assigments</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "110%",
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  logo: {
    width: 50,
    height: 50,
  },
  username: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  welcome: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#7392CC",
    width: "90%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#7392CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
  button2: {
    backgroundColor: "green",
    width: "90%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 25,
  },
  button3: {
    backgroundColor: "red",
    width: "90%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 25,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#7392CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default WelcomeEmployee;

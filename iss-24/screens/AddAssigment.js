// AddAssignmentScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, set, onValue } from "firebase/database";
import { auth, db } from "../firebase";

const AddAssignmentScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState(new Date()); // Initialize with current date
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState(""); // State for assignment description

  useEffect(() => {
    // Fetch user data on component mount
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email); // Set user email in state

      // Extract email prefix before "@" symbol
      const prefix = currentUser.email.split("@")[0];
      setEmailPrefix(prefix);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const croppedEmail = user.email.substring(0, user.email.indexOf("@"));
        setUserEmail(croppedEmail);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "users"), (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        const employeeList = Object.values(userData).filter(
          (user) => user.role === "Employee"
        );
        setEmployees(employeeList);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    if (currentDate >= new Date()) {
      setShowDatePicker(false);
      setDeadline(currentDate);
    } else {
      alert("Please select a date after today.");
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  function generateUniqueKey() {
    return new Date().getTime().toString();
  }
  const key = generateUniqueKey();

  const handleAddAssignment = () => {
    if (!name || !selectedEmployee || !deadline) {
      alert("Please fill in all fields.");
      return;
    }

    const assignmentData = {
      name: name,
      deadline: deadline.toDateString(), // Convert date to string
      assignedTo: selectedEmployee,
      description: description, // Add description to assignment data
    };

    set(
      ref(db, `assignments/${selectedEmployee.replace(".", "_")}/${key}`),
      assignmentData
    )
      .then(() => {
        alert("Assignment added successfully");
        navigation.navigate("WelcomeManager");
      })
      .catch((error) => {
        alert("Error adding assignment: " + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>
      <Text style={styles.heading}>Add Assignment</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />

      <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          {deadline.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={deadline}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      <Picker
        selectedValue={selectedEmployee}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
      >
        <Picker.Item label="Select Employee" value="" />
        {employees.map((employee, index) => (
          <Picker.Item
            key={index}
            label={employee.email}
            value={employee.email}
          />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Description (optional)"
      />

      <TouchableOpacity onPress={handleAddAssignment} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Assignment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
  heading: {
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateButton: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 16,
  },
  picker: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#7392CC",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#7392CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    fontWeight: "700",
  },
});

export default AddAssignmentScreen;

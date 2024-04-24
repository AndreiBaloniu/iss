import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { ref, onValue, remove } from "firebase/database";
import { db, auth } from "../firebase.js";

const EmployeesManager = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [emailPrefix, setEmailPrefix] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
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
    const employeesRef = ref(db, "users");
    const unsubscribe = onValue(employeesRef, (snapshot) => {
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

  const [employeeTasks, setEmployeeTasks] = useState([]);

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
    const sanitizedEmail = employee.email.replace(/\./g, "_");
    const tasksRef = ref(db, `assignments/${sanitizedEmail}`);
    const tasksForEmployee = [];
    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      if (tasksData) {
        Object.entries(tasksData).forEach(([taskId, task]) => {
          if (task.assignedTo === employee.email) {
            tasksForEmployee.push({ id: taskId, ...task });
          }
        });
        setEmployeeTasks(tasksForEmployee);
      }
    });
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setModalVisible(false);
  };

  const handleEmployeeStatusChange = (employee) => {
    update(ref(db, `users/${employee.email}`), { status: "In" })
      .then(() => {
        console.log("Employee status updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating employee status:", error);
      });
  };

  const handleDeleteEmployee = (employee) => {
    const sanitizedEmail = employee.email.replace(/\./g, "_");
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${employee.email}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            remove(ref(db, `users/${sanitizedEmail}`))
              .then(() => {
                console.log("Employee deleted successfully.");
              })
              .catch((error) => {
                console.error("Error deleting employee:", error);
              });
          },
          style: "destructive",
        },
      ]
    );
  };
  

  const filteredEmployees = employees.filter((employee) =>
    employee.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>

      <Text style={styles.heading}>Employees</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by email..."
        value={searchEmail}
        onChangeText={(text) => setSearchEmail(text)}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredEmployees.map((employee, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              openModal(employee);
            }}
          >
            <View style={styles.employeeItem}>
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeEmail}>
                  {employee.email}
                </Text>
                <Text style={styles.employeeStatus}>
                  {employee.status}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteEmployee(employee)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.topBar}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
          </View>
          {selectedEmployee && selectedEmployee.email ? (
            <>
              <Text style={styles.modalText}>{selectedEmployee.email}</Text>
              <Text style={styles.modalText}>Assignments:</Text>
              {employeeTasks.map((task, index) => (
                <View key={index} style={styles.assignmentItem}>
                  <Text style={styles.assignmentText}>{task.name}</Text>
                  <Text style={styles.assignmentDetails}>Deadline: {task.deadline.split("T")[0]}</Text>
                </View>
              ))}
            </>
          ) : null}
          <TouchableOpacity style={styles.backButton} onPress={closeModal}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  employeeEmail: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  employeeStatus: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  assignmentItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    marginBottom: 10,
    width: width * 0.9,
  },
  assignmentText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  assignmentDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteButtonText: {
    color: "red",
    fontWeight: "bold",
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
  heading: {
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  scrollContainer: {
    paddingTop: 80,
    paddingBottom: 100,
  },
  employeeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    width: width * 0.9,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  employeeInfo: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  employeeText: {
    fontSize: 16,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlignVertical: "top",
    color: "#333333",
  },
  modalButton: {
    backgroundColor: "#fff100",
    width: "90%",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  searchInput: {
    width: "90%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default EmployeesManager;

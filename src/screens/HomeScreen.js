import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // npm install @react-native-picker/picker

const API_URL = "http://localhost:3000"; // Adjust based on backend URL

  const HomeScreen = ({ route }) => {
    const [assignments, setAssignments] = useState([]);
    const [completedAssignments, setCompletedAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewCompleted, setViewCompleted] = useState(false);

    // Fetch assignments from API
    const fetchAssignments = async () => {
      setLoading(true);
      try {
          // Fetch pending assignments
          const responsePending = await fetch(`${API_URL}/assignments`);
          const dataPending = await responsePending.json();
          const sortedPending = (dataPending.assignments || []).sort(
              (a, b) => new Date(a.due_date) - new Date(b.due_date)
          );
  
          // Fetch completed assignments
          const responseCompleted = await fetch(`${API_URL}/completed-assignments`);
          const dataCompleted = await responseCompleted.json();
  
          setAssignments(sortedPending);
          setCompletedAssignments(dataCompleted.completed_assignments || []);
      } catch (error) {
          console.error("❌ Error fetching assignments:", error);
      } finally {
          setLoading(false);
      }
  };
  

  const markAsCompleted = async (id) => {
    try {
        const response = await fetch(`${API_URL}/complete-assignment/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
            Alert.alert("✅ Success", "Assignment marked as completed!");
            fetchAssignments(); // Refresh the assignment list
        } else {
            Alert.alert("❌ Error", "Failed to mark as completed: " + data.error);
        }
    } catch (error) {
        console.error("❌ Error updating assignment:", error);
        Alert.alert("❌ Error", "Failed to connect to server.");
    }
};

    useEffect(() => {
        fetchAssignments();
    }, []);

    // 🔥 Listen for New Assignment from Navigation Props (Passed from Modal)
    useEffect(() => {
        if (route.params?.newAssignment) {
            fetchAssignments();
        }
    }, [route.params?.newAssignment]);

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeMessage}>Welcome Back, Erik! 🎉</Text>

            <Picker
                selectedValue={viewCompleted.toString()}
                onValueChange={(value) => setViewCompleted(value === "true")}
                style={styles.picker}
            >
                <Picker.Item label="Upcoming Assignments" value="false" />
                <Picker.Item label="Completed Assignments" value="true" />
            </Picker>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text>Loading assignments...</Text>
                </View>
            ) : (
              <FlatList
              data={viewCompleted ? completedAssignments : assignments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                  <View style={styles.assignmentCard}>
                      <Text style={styles.assignmentName}>{item.name}</Text>
                      <Text style={styles.assignmentDetails}>
                          {item.course || "No Course"} - {item.type}
                      </Text>
                      <Text style={styles.assignmentDate}>Due: {item.due_date}</Text>
          
                      {/* Show 'Mark as Completed' button only for pending assignments */}
                      {!viewCompleted && (
                          <TouchableOpacity
                              onPress={() => markAsCompleted(item.id)}
                              style={styles.completeButton}
                          >
                              <Text style={styles.buttonText}>Mark as Completed</Text>
                          </TouchableOpacity>
                      )}
                  </View>
              )}
          />
          
            )}
        </View>
    );
};


export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20 },
  welcomeMessage: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  picker: { backgroundColor: "#f0f0f0", marginBottom: 10 },
  assignmentCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  assignmentName: { fontSize: 16, fontWeight: "bold" },
  assignmentDetails: { fontSize: 14, color: "gray" },
  assignmentDate: { fontSize: 14, color: "gray" },
  completeButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

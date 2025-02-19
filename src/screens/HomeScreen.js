import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // npm install @react-native-picker/picker

const API_URL = "http://localhost:3000"; // Adjust based on backend URL

const HomeScreen = () => {
  const [assignments, setAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewCompleted, setViewCompleted] = useState(false); // Toggle view state

  // Fetch assignments from API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${API_URL}/assignments`);
        const data = await response.json();
        setAssignments(data.assignments || []);
      } catch (error) {
        console.error("❌ Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCompletedAssignments = async () => {
      try {
        const response = await fetch(`${API_URL}/completed-assignments`);
        const data = await response.json();
        setCompletedAssignments(data.completed_assignments || []);
      } catch (error) {
        console.error("❌ Error fetching completed assignments:", error);
      }
    };

    fetchAssignments();
    fetchCompletedAssignments();
  }, []);

  // Mark assignment as completed
  const markAsCompleted = async (id) => {
    try {
      await fetch(`${API_URL}/complete-assignment/${id}`, { method: "PUT" });

      // Move assignment to completed list
      const completedItem = assignments.find((item) => item.id === id);
      setCompletedAssignments([
        ...completedAssignments,
        { ...completedItem, completed: 1 },
      ]);
      setAssignments(assignments.filter((item) => item.id !== id));
    } catch (error) {
      console.error("❌ Error updating assignment:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>Welcome Back, Erik! 🎉</Text>

      {/* Dropdown to Toggle Active vs Completed */}
      <Picker
        selectedValue={viewCompleted.toString()} // Convert boolean to string
        onValueChange={(value) => setViewCompleted(value === "true")} // Convert back to boolean
        style={styles.picker}
      >
        <Picker.Item label="Upcoming Assignments" value="false" />
        <Picker.Item label="Completed Assignments" value="true" />
      </Picker>

      {/* Display Assignments Based on Selected View */}
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

              {/* Mark as Complete Button (Only for Active Assignments) */}
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

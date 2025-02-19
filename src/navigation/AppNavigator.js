import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity, Modal, Text, TextInput, StyleSheet, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const CustomHeader = ({ navigation }) => {
    // State Variables
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentType, setAssignmentType] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [assignments, setAssignments] = useState([]); // Stores assignments list

    const courses = ['Math 101', 'Physics 201', 'Computer Science 301', 'History 101'];
    const assignmentTypes = ['Exam', 'Homework', 'Project', 'Quiz'];

    // Fetch Assignments from API
    const fetchAssignments = async () => {
        try {
            const response = await fetch("http://localhost:3000/assignments");
            const data = await response.json();
            if (response.ok) {
                setAssignments(data.assignments);
            } else {
                console.error("Error fetching assignments:", data.message);
            }
        } catch (error) {
            console.error("Network Error:", error);
        }
    };

    // Load assignments when the component mounts
    useEffect(() => {
        fetchAssignments();
    }, []);

    // Open Date Picker for Android & iOS
    const openDatePicker = () => {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: dueDate,
                mode: 'date',
                display: 'default',
                onChange: (event, selectedDate) => {
                    if (selectedDate) setDueDate(selectedDate);
                },
            });
        } else {
            if (!showDatePicker) {
                setShowDatePicker(true);
            }
        }
    };

    // Save Assignment to Database
    const handleSaveAssignment = async () => {
    if (!selectedCourse || !assignmentName || !assignmentType) {
        Alert.alert("Error", "Please fill all fields.");
        return;
    }

    const newAssignment = {
        course: selectedCourse,
        name: assignmentName,
        type: assignmentType,
        dueDate: dueDate.toISOString().split('T')[0], // Format YYYY-MM-DD
    };

    try {
        const response = await fetch("http://localhost:3000/assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAssignment),
        });

        const data = await response.json();
        if (response.ok) {
            Alert.alert("✅ Success", "Assignment added successfully!");
            setModalVisible(false);
            resetForm();
            
            // 🔥 Pass new assignment to HomeScreen to trigger refresh
            navigation.navigate("Home", { newAssignment: true });
        } else {
            Alert.alert("❌ Error", "Failed to add assignment: " + data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        Alert.alert("❌ Error", "Failed to connect to server.");
    }
};


    // Reset Form Fields
    const resetForm = () => {
        setSelectedCourse('');
        setAssignmentName('');
        setAssignmentType('');
        setDueDate(new Date());
    };

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    {/* Hamburger Menu */}
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <MaterialCommunityIcons name="menu" size={28} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Assignment Tracker</Text>

                    {/* Plus Button */}
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <MaterialCommunityIcons name="plus-circle" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Modal for Adding Assignments */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Assignment</Text>

                        {/* Course Dropdown */}
                        <Text style={styles.label}>Course</Text>
                        <Picker selectedValue={selectedCourse} onValueChange={setSelectedCourse} style={styles.picker}>
                            <Picker.Item label="Select Course" value="" />
                            {courses.map((course, index) => (
                                <Picker.Item key={index} label={course} value={course} />
                            ))}
                        </Picker>

                        {/* Assignment Name Input */}
                        <Text style={styles.label}>Assignment Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter assignment name"
                            value={assignmentName}
                            onChangeText={setAssignmentName}
                        />

                        {/* Assignment Type Dropdown */}
                        <Text style={styles.label}>Assignment Type</Text>
                        <Picker selectedValue={assignmentType} onValueChange={setAssignmentType} style={styles.picker}>
                            <Picker.Item label="Select Type" value="" />
                            {assignmentTypes.map((type, index) => (
                                <Picker.Item key={index} label={type} value={type} />
                            ))}
                        </Picker>

                        {/* Due Date Picker */}
                        <Text style={styles.label}>Due Date</Text>
                        <TouchableOpacity onPress={openDatePicker} style={styles.datePickerButton}>
                            <Text style={styles.datePickerText}>{dueDate.toDateString()}</Text>
                        </TouchableOpacity>

                        {/* iOS DateTimePicker */}
                        {Platform.OS === 'ios' && showDatePicker && (
                            <DateTimePicker
                                value={dueDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) setDueDate(selectedDate);
                                }}
                            />
                        )}

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveAssignment} style={styles.saveButton}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

// Stack Navigator
const StackNavigator = () => (
    <Stack.Navigator screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
    })}>
        <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
);

// App Navigation
const AppNavigator = () => (
    <NavigationContainer>
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="Home" component={StackNavigator} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
    </NavigationContainer>
);

export default AppNavigator;


const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },
  picker: {
    backgroundColor: "#f0f0f0",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  datePickerButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  datePickerText: {
    fontSize: 16,
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

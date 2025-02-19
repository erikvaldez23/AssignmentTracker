import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity, Modal, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const CustomHeader = ({ navigation }) => {
    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentType, setAssignmentType] = useState('');

    const courses = ['Math 101', 'Physics 201', 'Computer Science 301', 'History 101'];
    const assignmentTypes = ['Exam', 'Homework', 'Project', 'Quiz'];

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
                        <Picker
                            selectedValue={selectedCourse}
                            onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                            style={styles.picker}
                        >
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
                        <Picker
                            selectedValue={assignmentType}
                            onValueChange={(itemValue) => setAssignmentType(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Type" value="" />
                            {assignmentTypes.map((type, index) => (
                                <Picker.Item key={index} label={type} value={type} />
                            ))}
                        </Picker>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.saveButton}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

// Create a Stack Navigator for Screens with Custom Header
const StackNavigator = () => {
    return (
        <Stack.Navigator
        screenOptions={({ navigation }) => ({
            header: () => <CustomHeader navigation={navigation} />, // Custom Header Component
        })}
    >
        <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
    
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator screenOptions={{ headerShown: false }}>
                <Drawer.Screen name="Home" component={StackNavigator} />
                <Drawer.Screen name="Profile" component={ProfileScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '600',
    },
    picker: {
        backgroundColor: '#f0f0f0',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

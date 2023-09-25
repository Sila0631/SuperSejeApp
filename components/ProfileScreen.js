import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";

const ProfileScreen = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Handle logout
    const handleLogOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // If there's no active user, display a message
    if (!auth.currentUser) {
        return (
            <View style={styles.container}>
                <Text style={styles.notFoundText}>User not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>
            <View style={styles.userInfo}>
                <Text style={styles.userInfoText}>Current User:</Text>
                <Text style={styles.userInfoEmail}>{user.email}</Text>
            </View>
            <TouchableOpacity onPress={handleLogOut} style={styles.logoutButton}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
    },
    userInfo: {
        marginBottom: 16,
    },
    userInfoText: {
        fontSize: 18,
        marginBottom: 8,
        color: '#555',
    },
    userInfoEmail: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    notFoundText: {
        fontSize: 18,
        color: '#f44336',
    },
});

export default ProfileScreen;

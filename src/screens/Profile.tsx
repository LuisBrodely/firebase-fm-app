import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { collection, getDocs } from "firebase/firestore";
import { User } from '../types/UserTypes';
import Fire from '../utils/Fire';

export default function Profile() {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userId = Fire.shared.uid;
            if (!userId) {
                console.error("No user authenticated");
                return;
            }
            try {
                const querySnapshot = await getDocs(collection(Fire.shared.firestore, "users"));
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.id === userId) {
                        setUser(data as User);
                    }
                });
            } catch (error) {
                console.error("Error fetching user: ", error);
            }
        };
        fetchUser();
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 64, alignItems: "center" }}>
                <View style={styles.avatarContainer}>
                    <Image
                        style={styles.avatar}
                        source={
                            user?.avatar ? { uri: user.avatar } : require('../../assets/mockup.jpeg')
                        }
                    />
                </View>
                <Text style={styles.name}>{user?.name}</Text>
            </View>
            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statAmount}>21</Text>
                    <Text style={styles.statTitle}>Posts</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statAmount}>291</Text>
                    <Text style={styles.statTitle}>Followers</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statAmount}>64</Text>
                    <Text style={styles.statTitle}>Following</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => Fire.shared.signOut()}>
                <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Log out</Text>
            </TouchableOpacity>
        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101010',
    },
    avatarContainer: {
        shadowColor: '#151734',
        shadowRadius: 15,
        shadowOpacity: 0.4,
    },
    avatar: {
        width: 136,
        height: 136,
        borderRadius: 68,
    },
    name: {
        marginTop: 24,
        fontSize: 24,
        fontWeight: '600',
        color: '#C3C5CD',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 32,
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statAmount: {
        color: '#C3C5CD',
        fontSize: 20,
        fontWeight: '600',
    },
    statTitle: {
        color: '#4F566D',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
    },
    button: {
        backgroundColor: '#FF3040',
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 32,
    }
})
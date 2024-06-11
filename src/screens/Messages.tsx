import { View, StyleSheet, ScrollView, FlatList, SafeAreaView, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User } from '../types/UserTypes';
import Fire from '../utils/Fire';
import { collection, getDocs } from 'firebase/firestore';
import ChatRow from '../components/ChatRow';

export default function Messages() {

    const [users, setUsers] = useState<User[] | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const userId = Fire.shared.uid;
            if (!userId) {
                console.error("No user authenticated");
                return;
            }
            try {
                const querySnapshot = await getDocs(collection(Fire.shared.firestore, "users"));
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.id !== userId) {setUsers(querySnapshot.docs.map((doc) => doc.data() as User));}
                });
            } catch (error) {
                console.error("Error fetching user: ", error);
            }
        };
        fetchUsers();
    }, []);


    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}>Users created</Text>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerStyle={{ paddingTop: 18 }}>
                    <FlatList
                        data={users}
                        renderItem={({ item }) => <ChatRow {...item} />}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => (
                            <View style={[styles.separator, { marginLeft: 90 }]} />
                        )}
                        scrollEnabled={false}
                    />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101010',
        alignContent: 'center',
    },
    title: {
        marginLeft: 14,
        marginTop: 32,
        fontSize: 36,
        fontWeight: 'bold',
        color: "#f1f1f1",
        width: '100%',
    },
    avatar: {
        width: 136,
        height: 136,
        borderRadius: 68,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#DCDCE2',
        marginLeft: 50,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 1,
        height: '100%',
        backgroundColor: '#101010',
    },
})
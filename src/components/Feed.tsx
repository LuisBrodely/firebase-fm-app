import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import Fire from '../utils/Fire';
import { collection, getDocs } from "firebase/firestore";


interface Post {
    id: string;
    image: string;
    text: string;
    timestamp: number;
    uid: string;
    likes: number;
    isLiked: boolean;
    time: number;
}


const Feed = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState<{ [key: string]: boolean }>({});

    const fetchPosts = async () => {
        try {
            const querySnapshot = await getDocs(collection(Fire.shared.firestore, "posts"));
            const fetchedPosts: Post[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedPosts.push({
                    id: doc.id,
                    image: data.image,
                    text: data.text,
                    timestamp: data.timestamp,
                    uid: data.uid,
                    likes: 45, // Default likes to 0, can be updated to actual data if available
                    isLiked: false, // Default isLiked to false, can be updated to actual data if available
                    time: Math.floor((Date.now() - data.timestamp) / 60000), // Time in minutes
                });
            });
            setPosts(fetchedPosts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        }
    };


    useEffect(() => {
        fetchPosts();
    });

    const toggleLike = (postId: string) => {
        setLikes((prevLikes) => ({
            ...prevLikes,
            [postId]: !prevLikes[postId]
        }));
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY <= 0) {
            fetchPosts();
        }
    };

    if (loading) {
        return (
            <View style={{ backgroundColor: '#101010' }}>
                <ActivityIndicator size="large" color="#F1F1F1" />
            </View>
        )
    }
    return (
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
            {posts.map((data) => (
                <View
                    key={data.id}
                    style={{
                        paddingBottom: 10,
                        borderBottomColor: 'gray',
                        borderBottomWidth: 0.1,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 15,
                        }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: data.image }}
                                style={{ width: 40, height: 40, borderRadius: 100 }}
                            />
                            <View style={{ paddingLeft: 5 }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#f1f1f1', }}>
                                    Luis Brodely {/* Foto del usuario y nombre */}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Text style={{ color: '#777777' }}>{data.time} min</Text>
                            <Feather name="more-horizontal" style={{ fontSize: 20, color: '#f1f1f1', }} />
                        </View>
                    </View>
                    <View
                        style={{
                            position: 'relative',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image
                            source={{ uri: data.image }}
                            style={{ width: '100%', height: 400 }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 15,
                        }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => toggleLike(data.id)}>
                                <AntDesign
                                    name={likes[data.id] ? 'heart' : 'hearto'}
                                    style={{
                                        paddingRight: 10,
                                        fontSize: 20,
                                        color: likes[data.id] ? 'red' : '#f1f1f1',
                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons
                                    name="chatbubble-outline"
                                    style={{ fontSize: 20, paddingRight: 10, color: '#f1f1f1', }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Feather name="navigation" style={{ fontSize: 20, color: '#f1f1f1', }} />
                            </TouchableOpacity>
                        </View>
                        <Feather name="bookmark" style={{ fontSize: 20, color: '#f1f1f1', }} />
                    </View>
                    <View style={{ paddingHorizontal: 15 }}>
                        <Text style={{ color: '#f1f1f1', fontWeight: '700' }}>
                            Liked by {likes[data.id] ? 'you and' : ''}{' '}
                            {likes[data.id] ? data.likes + 1 : data.likes} others
                        </Text>
                        <Text
                            style={{
                                fontWeight: '300',
                                fontSize: 14,
                                paddingVertical: 2,
                                color: '#f1f1f1',
                            }}>
                            {data.text}
                        </Text>
                        <Text style={{ opacity: 0.4, paddingVertical: 2, color: '#f1f1f1' }}>
                            View all comments
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={{ uri: data.image }}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 100,
                                        backgroundColor: '#fff',
                                        marginRight: 10,
                                    }}
                                />
                                <TextInput
                                    placeholder="Add a comment "
                                    style={{ color: '#f1f1f1', }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default Feed;
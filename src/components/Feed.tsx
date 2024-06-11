import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import Fire from '../utils/Fire';
import { collection, getDocs } from "firebase/firestore";
import { ResizeMode, Video } from 'expo-av';
import moment from 'moment';

interface Post {
    id: string;
    media: string;
    text: string;
    timestamp: number;
    uid: string;
    likes: number;
    isLiked: boolean;
    mediaType: 'image' | 'video';
    userAvatar: string | null,
    userName: string,
    userEmail: string
}

export default function Feed() {
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
                    media: data.media,
                    text: data.text,
                    timestamp: data.timestamp,
                    uid: data.uid,
                    likes: data.likes || 0,
                    isLiked: false,
                    mediaType: data.mediaType,
                    userAvatar: data.userAvatar,
                    userName: data.userName,
                    userEmail: data.userEmail
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
    }, []);

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
            <View style={{ backgroundColor: '#101010', height: '100%', width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#F1F1F1" />
            </View>
        )
    }

    return (
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16} style={{ height: '100%', width: '100%' }}>
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
                                source={{ uri: data.userAvatar ?? '' }}
                                style={{ width: 40, height: 40, borderRadius: 100 }}
                            />
                            <View style={{ paddingLeft: 16 }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#f1f1f1', }}>
                                    {data.userName}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Text style={{ color: '#777777' }}>{moment(data.timestamp).fromNow()}</Text>
                            <Feather name="more-horizontal" style={{ fontSize: 20, color: '#f1f1f1', }} />
                        </View>
                    </View>
                    <View
                        style={{
                            position: 'relative',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {data.mediaType === 'image' ? (
                            <Image
                                source={{ uri: data.media }}
                                style={{ width: '100%', height: 400 }}
                            />
                        ) : (
                            <Video
                                source={{ uri: data.media }}
                                style={{ width: '100%', height: 400 }}
                                useNativeControls
                                resizeMode={ResizeMode.CONTAIN}
                                isLooping
                            />
                        )}
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
                            {likes[data.id] ? data.likes : data.likes} others
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
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

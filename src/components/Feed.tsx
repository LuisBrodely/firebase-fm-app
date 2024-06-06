import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';

const Feed = () => {
    const postInfo = [
        {
            postTitle: 'mr shermon',
            postPersonImage: require('../../assets/avatar1.jpeg'),
            postImage: require('../../assets/post2.jpeg'),
            likes: 765,
            isLiked: false,
        },
        {
            postTitle: 'TheBoyBag',
            postPersonImage: require('../../assets/avatar2.jpeg'),
            postImage: require('../../assets/post1.jpeg'),
            likes: 345,
            isLiked: false,
        },
        {
            postTitle: 'Tom',
            postPersonImage: require('../../assets/avatar3.jpeg'),
            postImage: require('../../assets/post3.jpeg'),
            likes: 734,
            isLiked: false,
        },
        {
            postTitle: 'Chinito',
            postPersonImage: require('../../assets/post4.jpeg'),
            postImage: require('../../assets/post4.jpeg'),
            likes: 875,
            isLiked: false,
        },
    ];

    return (
        <View>
            {postInfo.map((data, index) => {
                const [like, setLike] = useState(data.isLiked);
                return (
                    <View
                        key={index}
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
                                    source={data.postPersonImage}
                                    style={{ width: 40, height: 40, borderRadius: 100 }}
                                />
                                <View style={{ paddingLeft: 5 }}>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#f1f1f1', }}>
                                        {data.postTitle}
                                    </Text>
                                </View>
                            </View>
                            <Feather name="more-vertical" style={{ fontSize: 20, color: '#f1f1f1', }} />
                        </View>
                        <View
                            style={{
                                position: 'relative',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                source={data.postImage}
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
                                <TouchableOpacity onPress={() => setLike(!like)}>
                                    <AntDesign
                                        name={like ? 'heart' : 'hearto'}
                                        style={{
                                            paddingRight: 10,
                                            fontSize: 20,
                                            color: like ? 'red' : '#f1f1f1',
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
                            <Text style={{ color: '#f1f1f1', }}>
                                Liked by {like ? 'you and' : ''}{' '}
                                {like ? data.likes + 1 : data.likes} others
                            </Text>
                            <Text
                                style={{
                                    fontWeight: '700',
                                    fontSize: 14,
                                    paddingVertical: 2,
                                    color: '#f1f1f1',
                                }}>
                            </Text>
                            <Text style={{ opacity: 0.4, paddingVertical: 2, color: '#f1f1f1' }}>
                                View all comments
                            </Text>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={data.postPersonImage}
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
                );
            })}
        </View>
    );
};

export default Feed;
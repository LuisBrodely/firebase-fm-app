import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image, TextInput } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Constants from 'expo-constants'
import * as MediaLibrary from 'expo-media-library'
import Fire from '../utils/Fire'
import * as ImagePicker from 'expo-image-picker'

interface Post {
    text: string;
    image: string | null;
}



export default function PostModal() {

    const [post, setPost] = useState<Post>({ text: "", image: null });

    const getPhotoPermissions = async () => {
        if (Constants.platform?.ios) {
            const { status } = await MediaLibrary.requestPermissionsAsync();

            if (status !== "granted") {
                alert('We need permissions to access your camera roll');
            }
        }
    }

    useEffect(() => {
        getPhotoPermissions();
    }, []);


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPost({ ...post, image: result.assets[0].uri });
        }
    };

    const handlePost = () => {
        Fire.shared.addPost({ text: post.text.trim(), localUri: post.image }).then((ref: any) => {
            setPost({ text: "", image: null })
            alert("Ahuevo, buena publicacion papulince")
        }).catch((err: any) => {
            alert(err)
        })
    }




    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Feather name='arrow-left' size={24} color="#D8D9DB"></Feather>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePost}>
                    <Text style={{ color: '#F1F1F1' }}>Post</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Image source={require("../../assets/avatar2.jpeg")} style={styles.avatar}></Image>
                <TextInput
                    autoFocus={true}
                    multiline={true}
                    numberOfLines={4}
                    style={{ flex: 1 , color:'white'}}
                    placeholder='Want to share something?'
                    onChangeText={(text) => setPost({ ...post, text })}
                    value={post.text}
                ></TextInput>
            </View>
            <TouchableOpacity style={styles.photo} onPress={pickImage}>
                <Feather name='camera' size={24} color="#D8D9DB"></Feather>
            </TouchableOpacity>

            <View
                style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}
            >
                {post.image && (
                    <Image source={{ uri: post.image }} style={{ width: '100%', height: '100%' }} />
                )}
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101010'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 0.3,
        borderBottomColor: '#777777'
    },
    inputContainer: {
        margin: 32,
        flexDirection: 'row'
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: 'flex-end',
        marginHorizontal: 32
    }
})
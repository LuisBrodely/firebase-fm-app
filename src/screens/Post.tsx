import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image, TextInput, Button } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Fire from '../utils/Fire'
import * as ImagePicker from 'expo-image-picker'
import { ResizeMode, Video, Audio } from 'expo-av';
import UserPermissions from '../utils/UserPermissions'
import { collection, getDocs } from 'firebase/firestore'
import { User } from '../types/UserTypes'

interface Post {
    text: string;
    media: string | null;
    mediaType: 'image' | 'video' | null;
}


interface Recording {
    sound: Audio.Sound;
    duration: string;
    file: string | null;
}

export default function PostModal() {

    const [post, setPost] = useState<Post>({ text: "", media: null, mediaType: null });
    const [user, setUser] = useState<User | null>(null);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [recordings, setRecordings] = useState<Recording[]>([]);

    useEffect(() => {
        return recording
            ? () => {
                recording.stopAndUnloadAsync().catch(error => console.warn(error));
            }
            : undefined;
    }, [recording]);

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                alert("Permission to access microphone is required!");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recordingOptions = {
                android: {
                    extension: '.m4a',
                    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                    audioEncoder: Audio.AndroidAudioEncoder.AAC,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.caf',
                    audioQuality: Audio.IOSAudioQuality.HIGH,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {},
            };

            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(recordingOptions);
            await newRecording.startAsync();
            setRecording(newRecording);
        } catch (error: any) {
            alert(error.message);
        }
    }

    async function stopRecording() {
        try {
            if (!recording) return;

            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            const { sound, status } = await recording.createNewLoadedSoundAsync();
            const durationMillis = (status as any).playableDurationMillis;
            const newRecordings: Recording[] = [...recordings, {
                sound,
                duration: getDurationFormatted(durationMillis),
                file: uri
            }];
            setRecording(null);
            setRecordings(newRecordings);
        } catch (error: any) {
            alert(error.message);
        }
    }

    function getDurationFormatted(milliseconds: number) {
        const minutes = Math.floor(milliseconds / 1000 / 60);
        const seconds = Math.round((milliseconds / 1000) % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function getRecordingLines() {
        return recordings.map((recordingLine, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                <Text style={{ color: 'white' }}>Recording #{index + 1} | {recordingLine.duration}</Text>
                <Button title='Play' onPress={() => recordingLine.sound.replayAsync()} />
            </View>
        ));
    }

    function clearRecordings() {
        setRecordings([]);
    }

    useEffect(() => {
        UserPermissions.shared.getPhotoPermissions();
    }, []);


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


    const pickMedia = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const mediaType = result.assets[0].type === 'video' ? 'video' : 'image';
            setPost({ ...post, media: result.assets[0].uri, mediaType });
        }
    };

    const handlePost = () => {
        Fire.shared.addPost({ text: post.text.trim(), localUri: post.media, mediaType: post.mediaType }).then((ref: any) => {
            setPost({ text: "", media: null, mediaType: null });
            alert("Ahuevo, buena publicacion papulince");
        }).catch((err: any) => {
            alert(err);
        });
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.button} onPress={handlePost}>
                    <Text style={{ fontWeight: 'semibold', color: '#fff', fontSize: 14 }}>Post</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Image
                    source={user?.avatar ? { uri: user.avatar } : require('../../assets/mockup.jpeg')}
                    style={styles.avatar}
                />
                <TextInput
                    autoFocus={true}
                    multiline={true}
                    numberOfLines={4}
                    style={{ flex: 1, color: 'white' }}
                    placeholder='Want to share something?'
                    onChangeText={(text) => setPost({ ...post, text })}
                    value={post.text}
                ></TextInput>
            </View>
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginHorizontal: 32, gap: 16 }}>
                <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                    <Feather name='mic' size={24} color={recording ? "#FF3040" : "#D8D9DB"}></Feather>
                </TouchableOpacity>
                <TouchableOpacity onPress={pickMedia}>
                    <Feather name='camera' size={24} color="#D8D9DB"></Feather>
                </TouchableOpacity>
            </View>
            <View
                style={{ marginHorizontal: 12, marginTop: 32, height: 350 }}
            >
                {getRecordingLines()}
                <Button title={recordings.length > 0 ? 'Clear recordings' : ''} onPress={clearRecordings} />
                {post.media && post.mediaType === 'video' && (
                    <Video
                        source={{ uri: post.media }}
                        style={{ width: '100%', height: '100%' }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                    />
                )}
                {post.media && post.mediaType === 'image' && (
                    <Image
                        source={{ uri: post.media }}
                        style={{ width: '100%', height: '100%' }}
                    />
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
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.3,
        borderBottomColor: '#777777'
    },
    button: {
        backgroundColor: '#47D7AB',
        height: 32,
        width: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginVertical: 32,
        marginHorizontal: 12,
        flexDirection: 'row'
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12
    },
    photo: {
        marginHorizontal: 32
    }
})
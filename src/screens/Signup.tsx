import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, Keyboard } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import UserPermissions from '../utils/UserPermissions';
import * as ImagePicker from 'expo-image-picker';
import Fire from '../utils/Fire';
import { User } from '../types/UserTypes';




export default function Signup({ navigation }: { navigation: any }) {

  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    password: '',
    avatar: null
  });

  const onHandleSignup = () => {
    if (user.email === '' || user.password === '' || user.name === '', user.avatar === null) {
      Alert.alert('Invalid Input', 'Please fill in all fields', [{ text: 'OK' }]);
      return;
    }
    Fire.shared.createUser(user);
  };

  const handlePickAvatar = async () => {
    UserPermissions.shared.getPhotoPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.canceled) {
      setUser({ ...user, avatar: result.assets[0].uri });
    }

  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.form}>
        <View style={{ position: 'absolute', top: 92, alignItems: 'center', width: '100%', marginTop: 48 }}>
          <Text style={styles.title}>Sign Up</Text>
          <TouchableOpacity style={styles.avatarPlaceholder} onPress={handlePickAvatar}>
            <Image source={{ uri: user.avatar ?? undefined }} style={styles.avatar} />
            <Ionicons
              name='add'
              size={40}
              color='#F1F1F1'
              style={{ marginTop: 6, marginLeft: 2 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 128 }}>
          <Text style={styles.label}>
            Enter your name:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Luis Brodely"
            autoCapitalize="none"
            autoFocus={true}
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
          />
        </View>
        <View>
          <Text style={styles.label}>
            Enter your email:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Luis Brodely"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
          />
        </View>
        <View>
          <Text style={styles.label}>
            Enter your password:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="************"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            textContentType="password"
            value={user.password}
            onChangeText={(text) => setUser({ ...user, password: text })}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}> SignUp</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: '#f1f1f1', fontWeight: '600', fontSize: 14 }}> Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#f1f1f1",
    alignSelf: "flex-start",
    paddingBottom: 24,
  },
  input: {
    height: 48,
    marginBottom: 14,
    fontSize: 14,
    borderRadius: 8,
    padding: 12,
    color: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#323333',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  button: {
    backgroundColor: '#47D7AB',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    color: '#f1f1f1',
    fontSize: 14,
    fontWeight: 'regular',
    alignSelf: 'flex-start',
    paddingBottom: 12,
  },
  forgotten: {
    color: '#f1f1f1',
    fontSize: 14,
    fontWeight: 'regular',
    alignSelf: 'flex-end',
  },
  social: {
    flexDirection: 'row',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#323333',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#323333',
    borderWidth: 1,
  },
  avatar: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
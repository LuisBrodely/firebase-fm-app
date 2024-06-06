import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function Login({ navigation }: { navigation: any }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log("Login success"))
        .catch((err) => Alert.alert("Login error", err.message));
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Login</Text>
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
            value={email}
            onChangeText={(text) => setEmail(text)}
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
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity>
          <View>
            <Text style={styles.forgotten}>forgot password?</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}> Login</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{ color: '#F1F1F1', fontWeight: '600', fontSize: 14 }}> Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 20 }}>
          <Text style={{ color: '#696969' }}>or</Text>
        </View>
        <TouchableOpacity style={styles.social}>
          <Image source={require('../../assets/google.png')} style={styles.icon} />
          <Text style={{ fontWeight: 'regular', color: '#fff', fontSize: 14 }}> Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.social}>
        <Image source={require('../../assets/apple.png')} style={styles.icon} />
          <Text style={{ fontWeight: 'regular', color: '#fff', fontSize: 14 }}> Continue with Apple</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
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
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
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
});
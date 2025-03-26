import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { authStyles } from "../../styles/authStyles";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [childNumber, setChildNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (!fullName || !phoneNumber || !childNumber || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user details in Firestore
      await setDoc(doc(db, "User", user.uid), {
        fullName,
        phoneNumber,
        childNumber,
        email,
        uid: user.uid,
      });

      router.replace("/(tabs)/home"); // Navigate to main app
    } catch (error: any) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <Text style={authStyles.title}>Sign Up</Text>

      <TextInput 
        style={authStyles.input} 
        placeholder="Full Name" 
        value={fullName} 
        onChangeText={setFullName} 
      />
        <TextInput 
        style={authStyles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        style={authStyles.input} 
        placeholder="Phone Number" 
        value={phoneNumber} 
        onChangeText={setPhoneNumber} 
        keyboardType="phone-pad"
      />
      <TextInput 
        style={authStyles.input} 
        placeholder="No. of children" 
        value={childNumber} 
        onChangeText={setChildNumber} 
      />
      <TextInput 
        style={authStyles.input} 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />

      <TouchableOpacity style={authStyles.button} onPress={handleSignup}>
        <Text style={authStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("./login")}>
        <Text style={authStyles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

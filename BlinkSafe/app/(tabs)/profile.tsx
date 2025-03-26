import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Import the logo image
import AppLogo from "../../assets/logo.jpeg"; // Update the path to your logo

export default function ProfileScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "User", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserData(userSnap.data());
    }
    setLoading(false);
  };

  const pickImage = async () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 1 },
      async (response) => {
        if (response.didCancel || !response.assets) return;

        const imageUri = response.assets[0].uri;
        if (!imageUri || !auth.currentUser) return;

        const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}.jpg`);
        const responseBlob = await fetch(imageUri).then((res) => res.blob());

        await uploadBytes(storageRef, responseBlob);
        const downloadURL = await getDownloadURL(storageRef);

        await setDoc(doc(db, "User", auth.currentUser.uid), { profilePic: downloadURL }, { merge: true });

        setUserData((prev: any) => ({ ...prev, profilePic: downloadURL }));
      }
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image
          source={userData?.profilePic ? { uri: userData.profilePic } : AppLogo}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      {/* User Details */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData?.fullName || "User Name"}</Text>
        <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>

        {/* Additional User Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>📞 Phone: {userData?.phoneNumber || "Not set"}</Text>
          <Text style={styles.detailsText}>👶 Child Number: {userData?.childNumber || "Unknown"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginTop: 40,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#007AFF",
    padding: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  detailsContainer: {
    marginTop: 15,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 3,
  },
});

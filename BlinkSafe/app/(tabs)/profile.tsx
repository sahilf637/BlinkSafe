import { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView,
  Alert,
  SafeAreaView
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// Import the logo image
import AppLogo from "../../assets/logo.jpeg"; // Update the path to your logo

export default function ProfileScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!auth.currentUser) return;
    try {
      const userRef = doc(db, "User", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to load your profile information");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 0.8 },
      async (response) => {
        if (response.didCancel || !response.assets) return;
        const imageUri = response.assets[0].uri;
        if (!imageUri || !auth.currentUser) return;
        
        try {
          setUploadingImage(true);
          const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}.jpg`);
          const responseBlob = await fetch(imageUri).then((res) => res.blob());
          await uploadBytes(storageRef, responseBlob);
          const downloadURL = await getDownloadURL(storageRef);
          await setDoc(doc(db, "User", auth.currentUser.uid), { profilePic: downloadURL }, { merge: true });
          setUserData((prev) => ({ ...prev, profilePic: downloadURL }));
        } catch (error) {
          console.error("Error uploading image:", error);
          Alert.alert("Upload Failed", "Failed to update profile picture. Please try again.");
        } finally {
          setUploadingImage(false);
        }
      }
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => auth.signOut()
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4158D0" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Gradient */}
        <LinearGradient
          colors={["#4158D0", "#C850C0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          {/* Profile Picture */}
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer} disabled={uploadingImage}>
            {uploadingImage ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
              </View>
            ) : (
              <>
                <Image
                  source={userData?.profilePic ? { uri: userData.profilePic } : AppLogo}
                  style={styles.profileImage}
                />
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </>
            )}
          </TouchableOpacity>
          
          {/* User Name and Email */}
          <Text style={styles.userName}>{userData?.fullName || "User Name"}</Text>
          <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
        </LinearGradient>

        {/* User Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call-outline" size={20} color="#4158D0" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{userData?.phoneNumber || "Not set"}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil-outline" size={18} color="#4158D0" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="people-outline" size={20} color="#4158D0" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Number of Children</Text>
                <Text style={styles.infoValue}>{userData?.childNumber || "Not specified"}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil-outline" size={18} color="#4158D0" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#4158D0" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>{userData?.joinDate || "January 2025"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* App Settings
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Ionicons name="notifications-outline" size={20} color="#4158D0" />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" style={styles.chevron} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#4158D0" />
              </View>
              <Text style={styles.settingText}>Privacy Settings</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" style={styles.chevron} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Ionicons name="help-circle-outline" size={20} color="#4158D0" />
              </View>
              <Text style={styles.settingText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#999" style={styles.chevron} />
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>BlinkSafe v1.0.2</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f9fc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  headerGradient: {
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
    marginBottom: 15,
  },
  uploadingContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4158D0",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
  },
  detailsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    paddingLeft: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(65, 88, 208, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(65, 88, 208, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(65, 88, 208, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  chevron: {
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginHorizontal: 40,
    backgroundColor: "#f44336",
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#f44336",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  versionText: {
    fontSize: 13,
    color: "#999",
  },
});
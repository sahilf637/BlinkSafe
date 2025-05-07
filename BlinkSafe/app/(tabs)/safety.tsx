// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import * as ImageManipulator from 'expo-image-manipulator';

// export default function SafetyScreen() {
//   const [image, setImage] = useState<string | null>(null);
//   const [rednessRight, setRednessRight] = useState<number | null>(null);
//   const [drynessRight, setDrynessRight] = useState<number | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const openCamera = async () => {
//     const camPerm = await ImagePicker.requestCameraPermissionsAsync();
//     const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!camPerm.granted || !libPerm.granted) {
//       Alert.alert("Permission Required", "Camera and media access are needed.");
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.4, // Initial quality reduction
//       base64: true,
//     });
  
//     if (!result.canceled && result.assets.length > 0) {
//       const asset = result.assets[0];
//       setImage(asset.uri);
//       setErrorMessage(null);
  
//       try {
//         // Force resize to 800x800 with exact dimensions
//         const manipulatedImage = await ImageManipulator.manipulateAsync(
//           asset.uri,
//           [{
//             resize: {
//               width: 800,
//               height: 800,
//             }
//           }],
//           {
//             compress: 0.4, // Additional compression
//             format: ImageManipulator.SaveFormat.JPEG,
//             base64: true,
//           }
//         );
  
//         // Verify the processed image
//         console.log('Processed image size:', manipulatedImage.base64?.length);
        
//         if (manipulatedImage.base64) {
//           analyzeEyeHealth(manipulatedImage.base64);
//         } else {
//           setErrorMessage("Image processing failed");
//           resetResults();
//         }
//       } catch (error) {
//         console.error("Image processing error:", error);
//         setErrorMessage("Error processing image");
//         resetResults();
//       }
//     }
//   };

//   const analyzeEyeHealth = async (base64Image: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         "https://blinksafebackend.onrender.com/predict",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ image: base64Image }),
//         }
//       );
//       const text = await res.text();
//       console.log("Raw Backend Response:", text);
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);
//       const data = JSON.parse(text);
//       if (data.error) {
//         setErrorMessage(data.error);
//         resetResults();
//       } else {
//         setRednessRight(data.average_redness ?? 0);
//         setDrynessRight(data.average_dryness ?? 0);
//       }
//     } catch (err) {
//       console.error(err);
//       setErrorMessage("Could not analyze the image. Please try again.");
//       resetResults();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetResults = () => {
//     setRednessRight(null);
//     setDrynessRight(null);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🛡️ Safety Check</Text>
//       <TouchableOpacity style={styles.button} onPress={openCamera}>
//         <Text style={styles.buttonText}>📷 Capture Eye Image</Text>
//       </TouchableOpacity>
//       {image && <Image source={{ uri: image }} style={styles.image} />}
//       {loading ? (
//         <ActivityIndicator size="large" style={styles.loader} />
//       ) : (
//         <View style={styles.resultContainer}>
//           {errorMessage ? (
//             <Text style={styles.errorText}>{errorMessage}</Text>
//           ) : (
//             <>```js
//               {rednessRight !== null && (
//                 <Text style={styles.result}>Eye Redness: {rednessRight}%</Text>
//               )}
//               {drynessRight !== null && (
//                 <Text style={styles.result}>Eye Dryness: {drynessRight}%</Text>
//               )}
//             </>
//           )}
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#E6F0FF",
//     padding: 20,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#003366",
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     marginTop: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   image: {
//     width: 220,
//     height: 220,
//     borderRadius: 12,
//     marginTop: 20,
//     borderWidth: 2,
//     borderColor: "#007AFF",
//   },
//   loader: { marginTop: 20 },
//   resultContainer: { marginTop: 15, alignItems: "center" },
//   result: {
//     fontSize: 20,
//     color: "#003366",
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: 5,
//   },
//   errorText: {
//     fontSize: 18,
//     color: "red",
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: 10,
//   },
// });

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import * as ImageManipulator from 'expo-image-manipulator';

// type AnalysisResult = {
//   redness?: number;
//   dryness?: number;
//   warnings?: string[];
// };

// type ErrorDetails = {
//   message: string;
//   details?: string;
//   advice?: string;
// };

// export default function SafetyScreen() {
//   const [image, setImage] = useState<string | null>(null);
//   const [results, setResults] = useState<AnalysisResult | null>(null);
//   const [error, setError] = useState<ErrorDetails | null>(null);
//   const [loading, setLoading] = useState(false);

//   const openCamera = async () => {
//     try {
//       const [camPerm, libPerm] = await Promise.all([
//         ImagePicker.requestCameraPermissionsAsync(),
//         ImagePicker.requestMediaLibraryPermissionsAsync(),
//       ]);

//       if (!camPerm.granted || !libPerm.granted) {
//         Alert.alert("Permission Required", "Camera and media access are needed.");
//         return;
//       }

//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         quality: 0.4,
//         base64: true,
//       });

//       if (!result.canceled && result.assets.length > 0) {
//         const asset = result.assets[0];
//         setImage(asset.uri);
//         setError(null);
//         setResults(null);

//         const manipulatedImage = await ImageManipulator.manipulateAsync(
//           asset.uri,
//           [{
//             resize: { width: 800, height: 800 }
//           }],
//           {
//             compress: 0.4,
//             format: ImageManipulator.SaveFormat.JPEG,
//             base64: true,
//           }
//         );

//         if (manipulatedImage.base64) {
//           await analyzeEyeHealth(manipulatedImage.base64);
//         } else {
//           setError({
//             message: "Image processing failed",
//             details: "Could not prepare image for analysis"
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Camera error:", err);
//       setError({
//         message: "Camera Error",
//         details: "Failed to capture image",
//         advice: "Please try again in good lighting"
//       });
//     }
//   };

//   const analyzeEyeHealth = async (base64Image: string) => {
//     setLoading(true);
//     try {
//       const response = await fetch("https://blinksafebackend.onrender.com/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ image: base64Image }),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         handleBackendError(data.error || { message: "Unknown server error" });
//         return;
//       }

//       setResults({
//         redness: data.analysis?.redness?.value,
//         dryness: data.analysis?.dryness?.value,
//         warnings: data.warnings
//       });

//     } catch (err) {
//       console.error("Analysis error:", err);
//       setError({
//         message: "Connection Error",
//         details: "Could not reach the server",
//         advice: "Check your internet connection"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackendError = (error: any) => {
//     const details = {
//       message: error.message || "Unknown error occurred",
//       details: error.details,
//       advice: error.details?.detection_advice
//     };
    
//     switch (error.code) {
//       case 'FACE_NOT_FOUND':
//         details.advice = "Ensure your face is clearly visible in the frame";
//         break;
//       case 'EYES_NOT_FOUND':
//         details.advice = "Keep both eyes open and visible";
//         break;
//     }
    
//     setError(details);
//     setResults(null);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🛡️ Eye Safety Check</Text>
      
//       <TouchableOpacity style={styles.button} onPress={openCamera}>
//         <Text style={styles.buttonText}>📷 Capture Eye Image</Text>
//       </TouchableOpacity>

//       {image && <Image source={{ uri: image }} style={styles.image} />}

//       {loading ? (
//         <View style={styles.statusContainer}>
//           <ActivityIndicator size="large" />
//           <Text style={styles.statusText}>Analyzing...</Text>
//         </View>
//       ) : (
//         <View style={styles.resultsContainer}>
//           {error ? (
//             <View style={styles.errorContainer}>
//               <Text style={styles.errorHeading}>⚠️ Analysis Failed</Text>
//               <Text style={styles.errorText}>{error.message}</Text>
//               {error.details && (
//                 <Text style={styles.errorDetails}>{error.details}</Text>
//               )}
//               {error.advice && (
//                 <Text style={styles.adviceText}>Tip: {error.advice}</Text>
//               )}
//             </View>
//           ) : results && (
//             <View style={styles.resultsCard}>
//               <Text style={styles.resultsHeading}>Analysis Results</Text>
//               {results.redness !== undefined && (
//                 <View style={styles.resultItem}>
//                   <Text style={styles.resultLabel}>Redness:</Text>
//                   <Text style={styles.resultValue}>{results.redness}%</Text>
//                 </View>
//               )}
//               {results.dryness !== undefined && (
//                 <View style={styles.resultItem}>
//                   <Text style={styles.resultLabel}>Dryness:</Text>
//                   <Text style={styles.resultValue}>{results.dryness}%</Text>
//                 </View>
//               )}
//               {results.warnings?.map((warning, index) => (
//                 <Text key={index} style={styles.warningText}>⚠️ {warning}</Text>
//               ))}
//             </View>
//           )}
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#F8F9FE",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "700",
//     marginVertical: 20,
//     color: "#1A365D",
//   },
//   button: {
//     backgroundColor: "#4A90E2",
//     paddingVertical: 14,
//     paddingHorizontal: 28,
//     borderRadius: 10,
//     marginTop: 10,
//     shadowColor: "#1A365D",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   image: {
//     width: 240,
//     height: 240,
//     borderRadius: 12,
//     marginTop: 20,
//     borderWidth: 2,
//     borderColor: "#4A90E2",
//   },
//   statusContainer: {
//     marginTop: 30,
//     alignItems: "center",
//     gap: 12,
//   },
//   statusText: {
//     color: "#4A5568",
//     fontSize: 16,
//   },
//   resultsContainer: {
//     width: "100%",
//     marginTop: 20,
//   },
//   resultsCard: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: "#1A365D",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   resultsHeading: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#1A365D",
//     marginBottom: 16,
//   },
//   resultItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 8,
//   },
//   resultLabel: {
//     fontSize: 16,
//     color: "#4A5568",
//   },
//   resultValue: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#2D3748",
//   },
//   errorContainer: {
//     backgroundColor: "#FEE2E2",
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#FCA5A5",
//   },
//   errorHeading: {
//     color: "#DC2626",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   errorText: {
//     color: "#B91C1C",
//     fontSize: 16,
//   },
//   errorDetails: {
//     color: "#7F1D1D",
//     fontSize: 14,
//     marginTop: 8,
//   },
//   adviceText: {
//     color: "#3B82F6",
//     fontSize: 14,
//     marginTop: 8,
//     fontStyle: "italic",
//   },
//   warningText: {
//     color: "#D97706",
//     marginTop: 12,
//     fontSize: 14,
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import  EyeNotificationService from "../../hooks/useMail";

type AnalysisResult = {
  redness?: number;
  dryness?: number;
  warnings?: string[];
};

type ErrorDetails = {
  message: string;
  details?: string;
  advice?: string;
};

const handleEyeProblem = async () => {
  try {
    await EyeNotificationService.sendEyeWarning();
  } catch (error) {
    console.error('Failed to send alert:', error);
  }
};

export default function SafetyScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Eye health status descriptions
  const getEyeRednessDescription = (redness?: number) => {
    if (redness === undefined) return "";
    
    if (redness < 15) {
      return "Your eyes show minimal redness, which is a good sign! This suggests your eyes are currently experiencing little to no irritation.";
    } else if (redness < 30) {
      return "Your eyes show mild redness. This could be from normal daily activities or minor eye strain. Consider taking a short break.";
    } else if (redness < 50) {
      return "Your eyes show moderate redness. This may indicate eye strain or irritation from extended screen time. A longer break is recommended.";
    } else {
      return "Your eyes show significant redness. This indicates substantial eye strain or irritation that should be addressed promptly. Consider resting your eyes for at least 30 minutes.";
    }
  };

  const getEyeDrynessDescription = (dryness?: number) => {
    if (dryness === undefined) return "";
    
    if (dryness < 20) {
      return "Your eyes appear well-hydrated. Keep up the good habits of blinking regularly and maintaining proper screen distance.";
    } else if (dryness < 40) {
      return "Your eyes show mild dryness. Try to blink more frequently and consider using lubricating eye drops if needed.";
    } else if (dryness < 60) {
      return "Your eyes show moderate dryness. This is common with extended screen time. Consider using preservative-free artificial tears.";
    } else {
      return "Your eyes show significant dryness. This could lead to discomfort and eye fatigue. Take a break, use lubricating eye drops, and try the 20-20-20 rule.";
    }
  };

  const getOverallHealthAssessment = (redness?: number, dryness?: number) => {
    if (redness === undefined || dryness === undefined) return "";
    const avgScore = (redness + dryness) / 2;
    
    if (avgScore < 20) {
      return "Overall, your eyes appear healthy. Continue practicing good screen habits!";
    } else if (avgScore < 40) {
      return "Overall, your eyes show mild signs of digital eye strain. Taking regular breaks will help maintain eye health.";
    } else if (avgScore < 60) {
      handleEyeProblem();
      return "Overall, your eyes show moderate digital eye strain. Consider implementing the 20-20-20 rule more consistently.";
    } else {
      handleEyeProblem();
      return "Overall, your eyes show significant digital eye strain. We recommend limiting screen time for the next few hours.";
    }
  };

  const openCamera = async () => {
    try {
      const [camPerm, libPerm] = await Promise.all([
        ImagePicker.requestCameraPermissionsAsync(),
        ImagePicker.requestMediaLibraryPermissionsAsync(),
      ]);

      if (!camPerm.granted || !libPerm.granted) {
        Alert.alert("Permission Required", "Camera and media access are needed.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.4,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setImage(asset.uri);
        setError(null);
        setResults(null);

        const manipulatedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{
            resize: { width: 800, height: 800 }
          }],
          {
            compress: 0.4,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        if (manipulatedImage.base64) {
          await analyzeEyeHealth(manipulatedImage.base64);
        } else {
          setError({
            message: "Image processing failed",
            details: "Could not prepare image for analysis"
          });
        }
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError({
        message: "Camera Error",
        details: "Failed to capture image",
        advice: "Please try again in good lighting"
      });
    }
  };

  const analyzeEyeHealth = async (base64Image: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://blinksafebackend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        handleBackendError(data.error || { message: "Unknown server error" });
        return;
      }

      setResults({
        redness: data.analysis?.redness?.value,
        dryness: data.analysis?.dryness?.value,
        warnings: data.warnings
      });

      // Animate the results appearing
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

    } catch (err) {
      console.error("Analysis error:", err);
      setError({
        message: "Connection Error",
        details: "Could not reach the server",
        advice: "Check your internet connection"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackendError = (error: any) => {
    const details = {
      message: error.message || "Unknown error occurred",
      details: error.details,
      advice: error.details?.detection_advice
    };
    
    switch (error.code) {
      case 'FACE_NOT_FOUND':
        details.advice = "Ensure your face is clearly visible in the frame";
        break;
      case 'EYES_NOT_FOUND':
        details.advice = "Keep both eyes open and visible";
        break;
    }
    
    setError(details);
    setResults(null);
  };

  const getHealthStatusColor = (value?: number) => {
    if (value === undefined) return "#4158D0";
    
    if (value < 20) return "#4CAF50"; // Good - green
    if (value < 40) return "#8BC34A"; // Acceptable - light green
    if (value < 60) return "#FFC107"; // Warning - yellow
    return "#FF5722"; // Danger - orange/red
  };

  const getHealthMeter = (value?: number) => {
    if (value === undefined) return null;
    
    return (
      <View style={styles.healthMeterContainer}>
        <View style={styles.healthMeter}>
          <View 
            style={[
              styles.healthMeterFill, 
              { width: `${value}%`, backgroundColor: getHealthStatusColor(value) }
            ]} 
          />
        </View>
        <View style={styles.healthMeterLabels}>
          <Text style={styles.healthMeterLabel}>Good</Text>
          <Text style={styles.healthMeterLabel}>Severe</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <LinearGradient 
        colors={["#4158D0", "#C850C0"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Eye Health Check</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Camera Section */}
        <View style={styles.cameraSection}>
          <Text style={styles.sectionDescription}>
            Take a clear photo of your face to analyze your eye health
          </Text>
          <TouchableOpacity 
            style={styles.cameraButton} 
            onPress={openCamera}
            activeOpacity={0.8}
          >
            <LinearGradient 
              colors={["#4158D0", "#C850C0"]} 
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cameraButtonGradient}
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.cameraButtonText}>Capture Eye Image</Text>
            </LinearGradient>
          </TouchableOpacity>

          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          )}
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <LinearGradient 
              colors={["rgba(65, 88, 208, 0.1)", "rgba(200, 80, 192, 0.1)"]} 
              style={styles.loadingGradient}
            >
              <ActivityIndicator size="large" color="#4158D0" />
              <Text style={styles.loadingText}>Analyzing your eye health...</Text>
              <Text style={styles.loadingSubtext}>
                Our AI is evaluating redness, dryness, and other factors
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Results */}
        {!loading && results && (
          <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
            <LinearGradient 
              colors={["rgba(65, 88, 208, 0.05)", "rgba(200, 80, 192, 0.05)"]} 
              style={styles.resultsGradient}
            >
              <Text style={styles.resultsHeading}>Your Eye Health Results</Text>
              
              {/* Overall Assessment */}
              <View style={styles.assessmentContainer}>
                <Text style={styles.assessmentHeading}>Overall Assessment</Text>
                <Text style={styles.assessmentText}>
                  {getOverallHealthAssessment(results.redness, results.dryness)}
                </Text>
              </View>
              
              {/* Eye Redness */}
              <View style={styles.metricContainer}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricTitle}>Eye Redness</Text>
                  <Text style={[
                    styles.metricValue, 
                    { color: getHealthStatusColor(results.redness) }
                  ]}>
                    {results.redness}%
                  </Text>
                </View>
                {getHealthMeter(results.redness)}
                <Text style={styles.metricDescription}>
                  {getEyeRednessDescription(results.redness)}
                </Text>
              </View>
              
              {/* Eye Dryness */}
              <View style={styles.metricContainer}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricTitle}>Eye Dryness</Text>
                  <Text style={[
                    styles.metricValue, 
                    { color: getHealthStatusColor(results.dryness) }
                  ]}>
                    {results.dryness}%
                  </Text>
                </View>
                {getHealthMeter(results.dryness)}
                <Text style={styles.metricDescription}>
                  {getEyeDrynessDescription(results.dryness)}
                </Text>
              </View>
              
              {/* Warnings */}
              {results.warnings && results.warnings.length > 0 && (
                <View style={styles.warningsContainer}>
                  <Text style={styles.warningsHeading}>Important Notes</Text>
                  {results.warnings.map((warning, index) => (
                    <View key={index} style={styles.warningItem}>
                      <Ionicons name="warning" size={18} color="#FF9800" />
                      <Text style={styles.warningText}>{warning}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              {/* Recommendations */}
              <View style={styles.recommendationsContainer}>
                <Text style={styles.recommendationsHeading}>Recommendations</Text>
                <View style={styles.recommendationItem}>
                  <Ionicons name="time-outline" size={18} color="#4158D0" />
                  <Text style={styles.recommendationText}>
                    Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Ionicons name="water-outline" size={18} color="#4158D0" />
                  <Text style={styles.recommendationText}>
                    Stay hydrated and consider using preservative-free lubricating eye drops
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Ionicons name="sunny-outline" size={18} color="#4158D0" />
                  <Text style={styles.recommendationText}>
                    Adjust screen brightness to match your surroundings and use night mode when possible
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Error State */}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorIconContainer}>
              <Ionicons name="alert-circle" size={40} color="#DC2626" />
            </View>
            <Text style={styles.errorHeading}>{error.message}</Text>
            {error.details && (
              <Text style={styles.errorDetails}>{error.details}</Text>
            )}
            {error.advice && (
              <View style={styles.adviceContainer}>
                <Ionicons name="bulb-outline" size={18} color="#3B82F6" />
                <Text style={styles.adviceText}>{error.advice}</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.tryAgainButton} 
              onPress={openCamera}
            >
              <Text style={styles.tryAgainText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  cameraSection: {
    alignItems: "center",
    padding: 20,
  },
  sectionDescription: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  cameraButton: {
    width: "80%",
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#4158D0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cameraButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cameraButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  imageContainer: {
    marginTop: 20,
    borderRadius: 20,
    padding: 3,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 18,
  },
  loadingContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  loadingGradient: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4158D0",
    marginTop: 15,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  resultsContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  resultsGradient: {
    padding: 20,
  },
  resultsHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  assessmentContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  assessmentHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4158D0",
    marginBottom: 8,
  },
  assessmentText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  metricContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  metricTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  metricDescription: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginTop: 10,
  },
  healthMeterContainer: {
    marginVertical: 5,
  },
  healthMeter: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  healthMeterFill: {
    height: "100%",
    borderRadius: 5,
  },
  healthMeterLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  healthMeterLabel: {
    fontSize: 12,
    color: "#666",
  },
  warningsContainer: {
    backgroundColor: "rgba(255, 248, 225, 1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.3)",
  },
  warningsHeading: {
    fontSize: 17,
    fontWeight: "600",
    color: "#F57C00",
    marginBottom: 10,
  },
  warningItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 15,
    color: "#5D4037",
    marginLeft: 8,
    flex: 1,
  },
  recommendationsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  recommendationsHeading: {
    fontSize: 17,
    fontWeight: "600",
    color: "#4158D0",
    marginBottom: 10,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 15,
    color: "#444",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  errorContainer: {
    margin: 20,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.2)",
  },
  errorIconContainer: {
    marginBottom: 10,
  },
  errorHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#991B1B",
    marginBottom: 8,
    textAlign: "center",
  },
  errorDetails: {
    fontSize: 15,
    color: "#7F1D1D",
    textAlign: "center",
    marginBottom: 15,
  },
  adviceContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 10,
    padding: 12,
    width: "100%",
    marginBottom: 15,
  },
  adviceText: {
    fontSize: 15,
    color: "#1E40AF",
    marginLeft: 8,
    flex: 1,
  },
  tryAgainButton: {
    backgroundColor: "#4158D0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  tryAgainText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
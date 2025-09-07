import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MedicineForm } from "../../components/MedicineForm/MedicineForm";
import { SaveButton } from "../../components/SaveButton/SaveButton";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { NotesForm } from "../../components/NotesForm/NotesForm";
import { PeriodForm } from "../../components/PeriodForm/PeriodForm";
import { RootStackParamList } from "../../types";
import { styles } from "./styles";
import { useForm } from "./useForm";

type MedicineFormRouteProp = RouteProp<RootStackParamList, "Form">;
type MedicineFormNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Form"
>;

export const FormScreen: React.FC = () => {
  const navigation = useNavigation<MedicineFormNavigationProp>();
  const route = useRoute<MedicineFormRouteProp>();
  const insets = useSafeAreaInsets();
  const { medicineId } = route.params || {};

  const {
    medicine,
    setMedicine,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    useFixedSchedules,
    setUseFixedSchedules,
    isLoading,
    isSaving,
    isEditing,
    handleSave,
  } = useForm({ medicineId });

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSaveWithNavigation = async () => {
    const success = await handleSave();
    if (success) {
      navigation.goBack();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={{ height: insets.top, backgroundColor: "#F5F8FE" }} />
        <AppHeader
          title={isEditing ? "Editar Medicamento" : "Novo Medicamento"}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <MedicineForm
            medicine={medicine}
            setMedicine={setMedicine}
            useFixedSchedules={useFixedSchedules}
            setUseFixedSchedules={setUseFixedSchedules}
          />

          <PeriodForm
            medicine={medicine}
            setMedicine={setMedicine}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />

          <NotesForm medicine={medicine} setMedicine={setMedicine} />
        </ScrollView>
      </KeyboardAvoidingView>

      <SaveButton
        isEditing={isEditing}
        isSaving={isSaving}
        onCancel={handleCancel}
        onSave={handleSaveWithNavigation}
      />
    </SafeAreaView>
  );
};

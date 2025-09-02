import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MedicineActions } from "../../components/MedicineActions/MedicineActions";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { MedicineDetails } from "../../components/MedicineDetails/MedicineDetails";
import { DosesList } from "../../components/DosesList/DosesList";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { styles } from "./styles";
import { useMedicine } from "./useMedicine";

type MedicineDetailsRouteProp = RouteProp<RootStackParamList, "Medicine">;
type MedicineDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Medicine"
>;

export const MedicineScreen: React.FC = () => {
  const navigation = useNavigation<MedicineDetailsNavigationProp>();
  const route = useRoute<MedicineDetailsRouteProp>();
  const insets = useSafeAreaInsets();
  const { medicineId } = route.params;

  const {
    medicine,
    loading,
    registeringDose,
    adherence,
    nextDoses,
    canTakeNextDose,
    handleRegisterDose,
    handleForgotDose,
    handleToggleActive,
    handleDelete,
  } = useMedicine({ medicineId });

  const handleEdit = () => {
    if (medicine) {
      navigation.navigate("Form", { medicineId: medicine.id });
    }
  };

  const handleDeleteWithNavigation = async () => {
    const success = await handleDelete();
    if (success) {
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (!medicine) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Medicamento não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={{ height: insets.top, backgroundColor: "#F5F8FE" }} />
        <AppHeader
          title="Detalhes do Medicamento"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MedicineDetails medicine={medicine} adherence={adherence} />
        <DosesList nextDoses={nextDoses} />
      </ScrollView>

      <MedicineActions
        medicine={medicine}
        registeringDose={registeringDose}
        canTakeDose={canTakeNextDose}
        onRegisterDose={handleRegisterDose}
        onForgotDose={handleForgotDose}
        onToggleActive={handleToggleActive}
        onEdit={handleEdit}
        onDelete={handleDeleteWithNavigation}
      />
    </SafeAreaView>
  );
};

import React, { useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { styles } from "./styles";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { MedicineItem } from "../../components/MedicineItem/MedicineItem";
import { useDashboard } from "./useDashboard";

type DashboardNavigationProp = StackNavigationProp<RootStackParamList, "Main">;

export const DashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DashboardNavigationProp>();
  const {
    filteredMedicines,
    filteredMedicinesFinished,
    totalActive,
    nextDoseByMedicine,
    search,
    setSearch,
    showFinished,
    setShowFinished,
    fetchMedicines,
  } = useDashboard();

  const toggleShowFinished = () => setShowFinished(!showFinished);

  useFocusEffect(
    useCallback(() => {
      fetchMedicines();
    }, [fetchMedicines])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={{ height: insets.top, backgroundColor: "#F5F8FE" }} />
        <AppHeader
          title="MedControl"
          showSearch={true}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar medicamento..."
          showStats={true}
          statsValue={totalActive}
          statsLabel="medicamentos ativos"
          showFilter={true}
          filterLabel={
            showFinished ? "Ocultar finalizados" : "Mostrar finalizados"
          }
          onFilterPress={toggleShowFinished}
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Medicamentos Ativos</Text>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredMedicines.map((m) => (
            <MedicineItem
              key={m.id}
              name={m.name}
              dosage={m.dosage}
              frequencyHours={m.frequencyHours}
              nextDoseTime={nextDoseByMedicine.get(m.id) || null}
              statusColor="#22C55E"
              variant="active"
              onPress={() =>
                navigation.navigate("Medicine", { medicineId: m.id })
              }
            />
          ))}

          {showFinished && filteredMedicinesFinished.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Medicamentos Finalizados
              </Text>
              {filteredMedicinesFinished.map((m) => (
                <MedicineItem
                  key={m.id}
                  name={m.name}
                  dosage={m.dosage}
                  frequencyHours={m.frequencyHours}
                  nextDoseTime={nextDoseByMedicine.get(m.id) || null}
                  statusColor="#6B7280"
                  variant="inactive"
                  onPress={() =>
                    navigation.navigate("Medicine", { medicineId: m.id })
                  }
                />
              ))}
            </>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Form", {})}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

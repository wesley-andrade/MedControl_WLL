import React from "react";
import { Text, View } from "react-native";
import { Medicine } from "../../types";
import { formatDate } from "../../utils/dateUtils";
import { styles } from "./styles";

interface MedicineDetailsProps {
  medicine: Medicine;
  adherence: {
    percentage: number;
    taken: number;
    missed: number;
    total: number;
  };
}

export const MedicineDetails: React.FC<MedicineDetailsProps> = ({
  medicine,
  adherence,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.medicineHeader}>
        <View>
          <Text style={styles.medicineName}>{medicine.name}</Text>
          <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: medicine.active ? "#2563EB" : "#6B7280" },
          ]}
        >
          <Text style={styles.statusText}>
            {medicine.active ? "Ativo" : "Inativo"}
          </Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Frequência:</Text>
          <Text style={styles.detailValue}>
            {medicine.frequencyHours} em {medicine.frequencyHours} horas
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Adesão:</Text>
          <Text
            style={[
              styles.detailValue,
              { color: adherence.percentage >= 80 ? "#22C55E" : "#F59E0B" },
            ]}
          >
            {adherence.percentage}% ({adherence.taken}/{adherence.total})
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Início:</Text>
          <Text style={styles.detailValue}>
            {formatDate(medicine.dateStart)}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Término:</Text>
          <Text style={styles.detailValue}>
            {medicine.dateEnd ? formatDate(medicine.dateEnd) : "Indefinido"}
          </Text>
        </View>
      </View>

      {medicine.observations && (
        <View style={styles.observationsContainer}>
          <Text style={styles.detailLabel}>Observações:</Text>
          <View style={styles.observationsBox}>
            <Text style={styles.observationsText}>{medicine.observations}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

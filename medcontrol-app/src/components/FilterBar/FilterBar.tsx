import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FilterType } from "../../screens/History/useHistory";
import { styles } from "./styles";

interface FilterBarProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

interface FilterOption {
  key: FilterType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const filterOptions: FilterOption[] = [
  { key: "all", label: "Todas", icon: "filter" },
  { key: "onTime", label: "No Horário", icon: "checkmark" },
  { key: "delayed", label: "Com Atraso", icon: "warning" },
  { key: "missed", label: "Esquecidas", icon: "close-circle" },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filterOptions.map((option) => {
          const isSelected = selectedFilter === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[styles.filterButton, isSelected && styles.selectedButton]}
              onPress={() => onFilterChange(option.key)}
            >
              <Ionicons
                name={option.icon}
                size={16}
                color={isSelected ? "#FFFFFF" : "#FFFFFF"}
                style={styles.icon}
              />
              <Text
                style={[styles.filterText, isSelected && styles.selectedText]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

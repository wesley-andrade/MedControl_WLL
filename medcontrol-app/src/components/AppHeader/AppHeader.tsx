import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";
import { FilterBar } from "../FilterBar/FilterBar";

interface AppHeaderProps {
  title?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  searchPlaceholder?: string;
  showFilter?: boolean;
  filterLabel?: string;
  onFilterPress?: () => void;
  showStats?: boolean;
  statsValue?: number;
  statsLabel?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showRightButton?: boolean;
  rightButtonIcon?: keyof typeof Ionicons.glyphMap;
  onRightButtonPress?: () => void;
  showFilterBar?: boolean;
  selectedFilter?: any;
  onFilterChange?: (filter: any) => void;
  gradientColors?: [string, string, ...string[]];
  backgroundColor?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = "MedControl",
  showSearch = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Buscar...",
  showFilter = false,
  filterLabel = "Filtrar",
  onFilterPress,
  showStats = false,
  statsValue = 0,
  statsLabel = "itens",
  showBackButton = false,
  onBackPress,
  showRightButton = false,
  rightButtonIcon = "add",
  onRightButtonPress,
  showFilterBar = false,
  selectedFilter,
  onFilterChange,
  gradientColors = ["#2291FF", "#7DBEFF"] as [string, string],
  backgroundColor,
}) => {
  const renderHeader = () => {
    if (backgroundColor) {
      return (
        <View style={[styles.hero, { backgroundColor }]}>
          {renderHeaderContent()}
        </View>
      );
    }

    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        {renderHeaderContent()}
      </LinearGradient>
    );
  };

  const renderHeaderContent = () => (
    <>
      <View style={styles.headerTop}>
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <Text style={styles.brand}>{title}</Text>

        {showRightButton && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightButtonPress}
          >
            <Ionicons name={rightButtonIcon} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {showSearch && (
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#EAF2FF" />
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor="#EAF2FF"
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
      )}

      {(showStats || showFilter) && (
        <View style={styles.heroRow}>
          {showStats && (
            <View>
              <Text style={styles.heroSmall}>
                {statsValue} {statsLabel}
              </Text>
            </View>
          )}

          {showFilter && (
            <TouchableOpacity style={styles.filterRow} onPress={onFilterPress}>
              <Ionicons name="filter-outline" size={20} color="#FFFFFF" />
              <Text style={styles.filterText}>{filterLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {showFilterBar && selectedFilter && onFilterChange && (
        <FilterBar
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
        />
      )}
    </>
  );

  return renderHeader();
};

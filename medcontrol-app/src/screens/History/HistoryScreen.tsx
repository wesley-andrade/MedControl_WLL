import React from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHistory } from "../../screens/History/useHistory";
import { HistoryItem } from "../../components/HistoryItem/HistoryItem";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { styles } from "./styles";

export const HistoryScreen: React.FC = () => {
  const {
    dosages,
    selectedFilter,
    isLoading,
    handleFilterChange,
    refreshData,
  } = useHistory();

  const renderHistoryItem = ({ item }: { item: any }) => (
    <HistoryItem dosage={item} />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <AppHeader title="Histórico" backgroundColor="#10B981" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader
        title="Histórico"
        backgroundColor="#10B981"
        showFilterBar={true}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />

      <View style={styles.body}>
        <FlatList
          data={dosages}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refreshData}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>Nenhuma dose encontrada</Text>
              <Text style={styles.emptySubtext}>
                Seus registros de doses aparecerão aqui
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

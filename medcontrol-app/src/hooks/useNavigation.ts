import { useNavigation as useNavigationBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

export const useNavigation = () => {
  return useNavigationBase<StackNavigationProp<RootStackParamList>>();
};

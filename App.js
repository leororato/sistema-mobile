import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/pages/Login/Login";
import Inicio from "./src/pages/Inicio/Inicio";
import Importadas from "./src/pages/Importadas/Importadas";
import initializeDatabase from "./src/database/initializeDatabase";
import Coleta from "./src/pages/Coleta/Coleta";
import { Image, StatusBar } from "react-native";
import ColetaSemPl from "./src/pages/Coleta/ColetaSemPl";
import TelaDeCarregamento from "./src/pages/TelaDeCarregamento/TelaDeCarregamento";
import * as SecureStore from "expo-secure-store";
import { CommonActions } from "@react-navigation/native";
import { fetchPackingListsQuantidade } from "./src/database/services/packingListService";
import Icon from "react-native-vector-icons/AntDesign";
import api from "./axiosConfig";
import UserOptionsModal from "./src/components/UserOptionsModal";
import ModalColetaManual from "./src/components/ModalColetaManual";

const Stack = createNativeStackNavigator();

export const navigationRef = React.createRef();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const VerificarSeExisteImportada = async () => {
    let rota;
    const quantidade = await fetchPackingListsQuantidade();
    rota = quantidade > 0 ? "Importadas" : "Inicio";
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: rota }],
      })
    );
  };

  useEffect(() => {
    const verificarExpiracaoDoToken = async () => {
      const token = await SecureStore.getItemAsync("token");

      if (token) {
        try {
          const response = await api.post("/usuario/validate-token", { token });
          if (response.data) {
            VerificarSeExisteImportada();
          } else {
            navigationRef.current?.replace("Login");
          }
        } catch (error) {
          console.error("Erro ao verificar token", error);
          navigationRef.current?.replace("Login");
        }
      } else {
        navigationRef.current?.replace("Login");
      }
    };

    verificarExpiracaoDoToken();
  }, []);

  useEffect(() => {
    initializeDatabase();

    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (isAuthenticated === null) {
    return <TelaDeCarregamento />;
  }

  return (
    <>
      <StatusBar backgroundColor={"#1780e2"} barStyle={"light-content"} />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? "Inicio" : "Login"}
        >
          <Stack.Screen
            name="Carregamento"
            component={TelaDeCarregamento}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Importadas"
            options={{
              headerTitle: () => (
                <Image
                  source={require("./assets/logo.png")}
                  style={{
                    width: 150,
                    height: 40,
                    resizeMode: "contain",
                    display: "flex",
                  }}
                />
              ),
              headerStyle: {
                backgroundColor: "#1780e2",
              },
              headerTitleAlign: "center",
              headerLeft: () => null,
              headerRight: () => (
                <Icon
                  name="user"
                  size={24}
                  color="#fff"
                  onPress={handleOpenModal}
                  style={{ marginRight: 15 }}
                />
              ),
            }}
          >
            {(props) => (
              <Importadas {...props} handleOpenModal={handleOpenModal} />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="Coleta"
            component={Coleta}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ColetaSemPl"
            component={ColetaSemPl}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ColetaManual"
            component={ModalColetaManual}
            options={{
              headerShown: true,
              headerTitle: "Coleta Manual",
            }}
          />
          <Stack.Screen
            name="Inicio"
            options={{
              headerTitle: () => (
                <Image
                  source={require("./assets/logo.png")}
                  style={{
                    width: 150,
                    height: 40,
                    resizeMode: "contain",
                    display: "flex",
                  }}
                />
              ),
              headerStyle: {
                backgroundColor: "#1780e2",
              },
              headerTitleAlign: "center",
              headerLeft: () => null,
              headerRight: () => (
                <Icon
                  name="user"
                  size={24}
                  color="#fff"
                  onPress={handleOpenModal}
                  style={{ marginRight: 15 }}
                />
              ),
            }}
          >
            {(props) => <Inicio {...props} handleOpenModal={handleOpenModal} />}
          </Stack.Screen>
        </Stack.Navigator>

        <UserOptionsModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          navigationRef={navigationRef} // Passa o navigationRef como prop
        />
      </NavigationContainer>
    </>
  );
}

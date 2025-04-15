import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconQrCode } from "./IconsSvg";

export default function ModalColetaManual() {
  const route = useRoute();
  const { idPackinglist, idProduto, seq, idUsuario } = route.params;
  const [valueInput, setValueInput] = useState("");

  const handleChangeInput = (text) => {
    setValueInput(text);
  };

  useEffect(() => {
    console.log("idPackinglist: ", idPackinglist);
    console.log("idProduto: ", idProduto);
    console.log("seq: ", seq);
    console.log("idUsuario: ", idUsuario);
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={{ flex: 1, backgroundColor: "red", zIndex: 9999 }}
    >
      <View style={styles.container}>
        <View style={styles.view1}>
          <Text>Inserir código manualmente</Text>
          <Text style={{ color: "rgba(197, 33, 33, 0.67)" }}>
            * O código está logo abaixo do QrCode
          </Text>
        </View>

        {/* QR Code e texto "123" */}
        <View style={styles.qrContainer}>
          <View style={styles.qrSubContainer}>
            <Text>Exemplo</Text>
            <IconQrCode width={200} height={200} />
            <Text style={styles.qrText}>123</Text>
          </View>
        </View>

        <View style={styles.view2}>
          <TextInput
            onChangeText={(text) => handleChangeInput(text)}
            enablesReturnKeyAutomatically={true}
            keyboardType="numeric"
            style={styles.input1}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
  },
  view1: {
    marginTop: 50,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  qrSubContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(189, 184, 184, 0.4)",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "rgb(156, 156, 156)",
    width: "80%",
  },
  qrText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  view2: {
    marginTop: 20,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input1: {
    backgroundColor: "rgba(154, 182, 189, 0.56)",
    width: "60%",
    textAlign: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
});

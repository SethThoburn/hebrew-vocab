import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

const options = ["Genesis", "Exodus", "Leviticus"] as const;

type Option = (typeof options)[number];

export default function Index() {
  const [selectedBook, setSelectedBook] = useState<Option>(options[0]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Picker
        selectedValue={selectedBook}
        onValueChange={(itemValue, itemIndex) => {
          if (itemValue !== selectedBook) {
            setSelectedBook(itemValue);
            router.push({
              pathname: "/[book]/select-chapter",
              params: { book: itemValue },
            });
          }
        }}
      >
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
}

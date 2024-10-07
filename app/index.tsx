import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";

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
          setSelectedBook(itemValue);
        }}
      >
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
      <Button
        disabled={!selectedBook}
        title="Go to Book"
        onPress={() => {
          router.push({
            pathname: "/[book]/select-chapter",
            params: { book: selectedBook },
          });
        }}
      />
    </View>
  );
}

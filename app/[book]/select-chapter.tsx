import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, View } from "react-native";
import { Book, useBook } from "../../hooks/useBook";

export const options = {
  title: "Select Chapter",
};

export default function SelectChapter() {
  const { book } = useLocalSearchParams<{ book: Book }>();
  const xmlContent = useBook({ book });

  const [_selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const selectedChapter =
    _selectedChapter ??
    xmlContent.data?.osis.osisText.div.chapter[0]["@_osisID"];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Picker
        selectedValue={selectedChapter}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedChapter(itemValue);
        }}
      >
        {xmlContent.data?.osis.osisText.div.chapter.map((chapter) => (
          <Picker.Item
            key={chapter["@_osisID"]}
            label={chapter["@_osisID"]}
            value={chapter["@_osisID"]}
          />
        ))}
      </Picker>
      <Button
        title="Go to Chapter"
        disabled={!selectedChapter || !xmlContent}
        onPress={() => {
          router.push({
            pathname: "/[book]/[chapter]",
            params: { book: book as string, chapter: selectedChapter! },
          });
        }}
      />
    </View>
  );
}

import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { Book, useBook } from "../../../hooks/useBook";

export const options = {
  title: "Select Chapter",
};

export default function SelectChapter() {
  const { book, chapter } = useLocalSearchParams<{
    book: Book;
    chapter: string;
  }>();

  const xmlContent = useBook({ book });

  const words = xmlContent.data?.osis.osisText.div.chapter
    .find((c) => c["@_osisID"] === chapter)
    ?.verse.flatMap((v) => v.w);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <ScrollView>
        {words?.map((word) => (
          <Text key={word["@_id"]}>
            {word["#text"]}: {word["@_lemma"]}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Book, useBook } from "../../../hooks/useBook";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { getLemma } from "../../../constants/Strongs";

type Word = {
  "@_id": string;
  "#text": string;
  "@_lemma": string;
};

interface WordCardProps {
  word: Word;
}

const WordCard: React.FC<WordCardProps> = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePress = () => {
    setIsFlipped((prev) => !prev);
  };

  const lemmas = word["@_lemma"]
    .split(/[\s/]/)
    .map((l: string) => getLemma(l))
    .filter(Boolean);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View
        style={[
          styles.card,
          isFlipped && {
            padding: 0,
          },
        ]}
      >
        {isFlipped ? (
          <View
            style={{
              flexDirection: "column",
              gap: 4,
              alignItems: "center",
            }}
          >
            {lemmas.map((lemma) => (
              <View
                key={lemma?.lemma}
                style={{
                  flexDirection: "row",
                  minHeight: 100,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8,
                  }}
                >
                  <Text style={styles.text}>{lemma?.strongs_def}</Text>
                </View>
                <View
                  style={{
                    width: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                    padding: 8,
                  }}
                >
                  <Text style={styles.text}>{lemma?.lemma}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.text}>{word["#text"]}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

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
    <ScrollView contentContainerStyle={styles.container}>
      {words?.map((word) => (
        <WordCard key={word["@_id"]} word={word} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 8,
    backgroundColor: "#f0f0f0", // Optional: Add a background color
  },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#bebdbd",
    borderWidth: 1,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    minHeight: 100,
    overflow: "hidden",
  },
  text: {
    fontSize: 24,
    textAlign: "center",
  },
});

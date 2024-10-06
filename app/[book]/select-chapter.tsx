import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import { Asset } from "expo-asset";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Text, View } from "react-native";
import * as FileSystem from "expo-file-system";

const files = {
  Genesis: require("../../assets/hebrew-data/wlc/Gen.xml"),
  Exodus: require("../../assets/hebrew-data/wlc/Exod.xml"),
  Leviticus: require("../../assets/hebrew-data/wlc/Lev.xml"),
};

export const options = {
  title: "Select Chapter",
};

export default function SelectChapter() {
  const { book } = useLocalSearchParams();

  const xmlContent = useQuery({
    queryKey: ["book-uri"],
    queryFn: async () => {
      const [{ localUri }] = await Asset.loadAsync(
        files[book as keyof typeof files]
      );
      return await FileSystem.readAsStringAsync(localUri!);
    },
    enabled: Boolean(book),
  });

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text>{book}</Text>
      {/* show first 10 chars of xml file */}
      <Text>{xmlContent.data?.slice(0, 10)}</Text>
    </View>
  );
}

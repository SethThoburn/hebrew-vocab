import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import { Asset } from "expo-asset";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { XMLParser } from "fast-xml-parser";

const files = {
  Genesis: require("../../../assets/hebrew-data/wlc/Gen.xml"),
  Exodus: require("../../../assets/hebrew-data/wlc/Exod.xml"),
  Leviticus: require("../../../assets/hebrew-data/wlc/Lev.xml"),
};

export const options = {
  title: "Select Chapter",
};

export interface BookXML {
  "?xml": XML;
  osis: Osis;
}

export interface XML {
  "@_version": string;
  "@_encoding": string;
}

export interface Osis {
  osisText: OsisText;
  "@_schemaLocation": string;
}

export interface OsisText {
  header: Header;
  div: Div;
  "@_lang": string;
  "@_osisIDWork": string;
  "@_osisRefWork": string;
}

export interface Div {
  chapter: Chapter[];
  "@_type": string;
  "@_osisID": string;
}

export interface Chapter {
  verse: Verse[];
  "@_osisID": string;
}

export interface Verse {
  w: WElement[];
  seg: IdentifierElement[] | IdentifierElement;
  "@_osisID": string;
  note?: Array<PurpleNote | string> | FluffyNote | string;
}

export interface PurpleNote {
  "#text"?: string;
  "@_n"?: string;
  catchWord?: string;
  rdg?: NoteRdgClass;
  "@_type"?: string;
}

export interface NoteRdgClass {
  w?: WElement;
  "@_type": string;
  "#text"?: string;
}

export interface WElement {
  "#text": string;
  "@_lemma": string;
  "@_n"?: string;
  "@_morph": string;
  "@_id": string;
  "@_type"?: WType;
}

export enum WType {
  XKetiv = "x-ketiv",
}

export interface FluffyNote {
  "#text"?: string;
  "@_n"?: string;
  catchWord?: string;
  rdg?: RdgRdg | string;
  "@_type"?: NoteType;
}

export enum NoteType {
  Exegesis = "exegesis",
  Variant = "variant",
}

export interface RdgRdg {
  w: WElement[] | WElement;
  "@_type": RdgType;
}

export enum RdgType {
  XQere = "x-qere",
}

export interface IdentifierElement {
  "#text": string;
  "@_type": IdentifierType;
}

export enum IdentifierType {
  Sub = "sub",
  URL = "URL",
  XBY = "x-BY",
  XMaqqef = "x-maqqef",
  XPE = "x-pe",
  XPaseq = "x-paseq",
  XSamekh = "x-samekh",
  XSofPasuq = "x-sof-pasuq",
}

export interface Header {
  revisionDesc: RevisionDesc[];
  work: Work[];
  workPrefix: WorkPrefix[];
}

export interface RevisionDesc {
  date: string;
  p: string;
  "@_resp": string;
}

export interface Work {
  title: Array<IdentifierElement | string> | string;
  contributor: Tor[] | Tor;
  date?: number | string;
  identifier: IdentifierElement[] | IdentifierElement;
  rights: IdentifierElement | string;
  refSystem?: string;
  "@_osisWork": string;
  "@_lang": string;
  description?: DescriptionClass | string;
  creator?: Tor;
  publisher?: string;
  source?: string;
}

export interface Tor {
  "#text": string;
  "@_role": Role;
}

export enum Role {
  Ctb = "ctb",
  Edt = "edt",
}

export interface DescriptionClass {
  "#text": string;
  "@_resp": string;
}

export interface WorkPrefix {
  "@_path": string;
  "@_osisWork": string;
}

export default function SelectChapter() {
  const { book, chapter } = useLocalSearchParams();

  const xmlContent = useQuery({
    queryKey: ["book-uri"],
    queryFn: async () => {
      const parser = new XMLParser({
        ignoreAttributes: false,
      });

      const [{ localUri }] = await Asset.loadAsync(
        files[book as keyof typeof files]
      );
      const content = await FileSystem.readAsStringAsync(localUri!);

      // Log first 20 chars
      console.log(content.slice(0, 20));

      return parser.parse(content) as BookXML;
    },
    enabled: Boolean(book),
  });

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

import { useQuery } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import { XMLParser } from "fast-xml-parser";
import { Asset } from "expo-asset";

const files = {
  Genesis: require("../assets/hebrew-data/wlc/Gen.xml"),
  Exodus: require("../assets/hebrew-data/wlc/Exod.xml"),
  Leviticus: require("../assets/hebrew-data/wlc/Lev.xml"),
  Numbers: require("../assets/hebrew-data/wlc/Num.xml"),
  Deuteronomy: require("../assets/hebrew-data/wlc/Deut.xml"),
  Joshua: require("../assets/hebrew-data/wlc/Josh.xml"),
  Judges: require("../assets/hebrew-data/wlc/Judg.xml"),
  Ruth: require("../assets/hebrew-data/wlc/Ruth.xml"),
  "1 Samuel": require("../assets/hebrew-data/wlc/1Sam.xml"),
  "2 Samuel": require("../assets/hebrew-data/wlc/2Sam.xml"),
  "1 Kings": require("../assets/hebrew-data/wlc/1Kgs.xml"),
  "2 Kings": require("../assets/hebrew-data/wlc/2Kgs.xml"),
  "1 Chronicles": require("../assets/hebrew-data/wlc/1Chr.xml"),
  "2 Chronicles": require("../assets/hebrew-data/wlc/2Chr.xml"),
  Ezra: require("../assets/hebrew-data/wlc/Ezra.xml"),
  Nehemiah: require("../assets/hebrew-data/wlc/Neh.xml"),
  Esther: require("../assets/hebrew-data/wlc/Esth.xml"),
  Job: require("../assets/hebrew-data/wlc/Job.xml"),
  Psalms: require("../assets/hebrew-data/wlc/Ps.xml"),
  Proverbs: require("../assets/hebrew-data/wlc/Prov.xml"),
  Ecclesiastes: require("../assets/hebrew-data/wlc/Eccl.xml"),
  SongOfSolomon: require("../assets/hebrew-data/wlc/Song.xml"),
  Isaiah: require("../assets/hebrew-data/wlc/Isa.xml"),
  Jeremiah: require("../assets/hebrew-data/wlc/Jer.xml"),
  Lamentations: require("../assets/hebrew-data/wlc/Lam.xml"),
  Ezekiel: require("../assets/hebrew-data/wlc/Ezek.xml"),
  Daniel: require("../assets/hebrew-data/wlc/Dan.xml"),
  Hosea: require("../assets/hebrew-data/wlc/Hos.xml"),
  Joel: require("../assets/hebrew-data/wlc/Joel.xml"),
  Amos: require("../assets/hebrew-data/wlc/Amos.xml"),
  Obadiah: require("../assets/hebrew-data/wlc/Obad.xml"),
  Jonah: require("../assets/hebrew-data/wlc/Jonah.xml"),
  Micah: require("../assets/hebrew-data/wlc/Mic.xml"),
  Nahum: require("../assets/hebrew-data/wlc/Nah.xml"),
  Habakkuk: require("../assets/hebrew-data/wlc/Hab.xml"),
  Zephaniah: require("../assets/hebrew-data/wlc/Zeph.xml"),
  Haggai: require("../assets/hebrew-data/wlc/Hag.xml"),
  Zechariah: require("../assets/hebrew-data/wlc/Zech.xml"),
  Malachi: require("../assets/hebrew-data/wlc/Mal.xml"),
} as const;
export const books = Object.keys(files) as Array<keyof typeof files>;

export type Book = (typeof books)[number];

export const useBook = ({ book }: { book: Book }) => {
  return useQuery({
    queryKey: ["book-uri", book],
    queryFn: async () => {
      const parser = new XMLParser({
        ignoreAttributes: false,
      });

      const [{ localUri }] = await Asset.loadAsync(
        files[book as keyof typeof files]
      );
      const content = await FileSystem.readAsStringAsync(localUri!);

      return parser.parse(content) as BookXML;
    },
    enabled: Boolean(book),
  });
};

interface BookXML {
  "?xml": XML;
  osis: Osis;
}

interface XML {
  "@_version": string;
  "@_encoding": string;
}

interface Osis {
  osisText: OsisText;
  "@_schemaLocation": string;
}

interface OsisText {
  header: Header;
  div: Div;
  "@_lang": string;
  "@_osisIDWork": string;
  "@_osisRefWork": string;
}

interface Div {
  chapter: Chapter[];
  "@_type": string;
  "@_osisID": string;
}

interface Chapter {
  verse: Verse[];
  "@_osisID": string;
}

interface Verse {
  w: WElement[];
  seg: IdentifierElement[] | IdentifierElement;
  "@_osisID": string;
  note?: Array<PurpleNote | string> | FluffyNote | string;
}

interface PurpleNote {
  "#text"?: string;
  "@_n"?: string;
  catchWord?: string;
  rdg?: NoteRdgClass;
  "@_type"?: string;
}

interface NoteRdgClass {
  w?: WElement;
  "@_type": string;
  "#text"?: string;
}

interface WElement {
  "#text": string;
  "@_lemma": string;
  "@_n"?: string;
  "@_morph": string;
  "@_id": string;
  "@_type"?: WType;
}

enum WType {
  XKetiv = "x-ketiv",
}

interface FluffyNote {
  "#text"?: string;
  "@_n"?: string;
  catchWord?: string;
  rdg?: RdgRdg | string;
  "@_type"?: NoteType;
}

enum NoteType {
  Exegesis = "exegesis",
  Variant = "variant",
}

interface RdgRdg {
  w: WElement[] | WElement;
  "@_type": RdgType;
}

enum RdgType {
  XQere = "x-qere",
}

interface IdentifierElement {
  "#text": string;
  "@_type": IdentifierType;
}

enum IdentifierType {
  Sub = "sub",
  URL = "URL",
  XBY = "x-BY",
  XMaqqef = "x-maqqef",
  XPE = "x-pe",
  XPaseq = "x-paseq",
  XSamekh = "x-samekh",
  XSofPasuq = "x-sof-pasuq",
}

interface Header {
  revisionDesc: RevisionDesc[];
  work: Work[];
  workPrefix: WorkPrefix[];
}

interface RevisionDesc {
  date: string;
  p: string;
  "@_resp": string;
}

interface Work {
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

interface Tor {
  "#text": string;
  "@_role": Role;
}

enum Role {
  Ctb = "ctb",
  Edt = "edt",
}

interface DescriptionClass {
  "#text": string;
  "@_resp": string;
}

interface WorkPrefix {
  "@_path": string;
  "@_osisWork": string;
}

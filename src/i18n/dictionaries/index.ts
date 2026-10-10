import "server-only";
import type { Locale } from "../config";
import en from "./en";
import ko, { type Dictionary } from "./ko";

const dictionaries: Record<Locale, Dictionary> = { ko, en };

export const getDictionary = (locale: Locale): Dictionary =>
  dictionaries[locale];
export type { Dictionary };

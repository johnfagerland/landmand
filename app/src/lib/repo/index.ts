import type { Repositories } from "./types";
import {
  LocalStorageFirmSettingsRepository,
  LocalStoragePriceBookRepository,
  LocalStorageQuoteRepository,
} from "./localStorage";

let instance: Repositories | null = null;

/**
 * Phase A: localStorage-backed repositories (memoised). Phase B swaps in Supabase here.
 * Components must only ever call getRepositories(); never import a concrete repository.
 */
export function getRepositories(): Repositories {
  if (!instance) {
    instance = {
      quotes: new LocalStorageQuoteRepository(),
      priceBooks: new LocalStoragePriceBookRepository(),
      firm: new LocalStorageFirmSettingsRepository(),
    };
  }
  return instance;
}

export type { Repositories } from "./types";

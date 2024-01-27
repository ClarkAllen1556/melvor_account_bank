import PocketBase from 'pocketbase';
import { effect, signal } from "@preact/signals";
import { DB_ITEMS_TBL, STORAGE_KEY } from "../constants";

type OAuthMethods = 'discord';

export const dbHost = signal<string>(null);

let _pb: PocketBase = null
export const PB: PocketBase = _pb;

effect(() => {
  console.log('>> DB host has been changed', dbHost.value);

  if (dbHost.value) {
    init(dbHost.value);
  }
})

export function init(host: string) {
  console.log('>> Setting up remote')

  _pb = new PocketBase(host);
}

export async function login(provider: OAuthMethods) {
  if (!_pb) return;

  console.log('>> Logging into service', provider, _pb?.authStore.isValid)

  if (_pb.authStore.isValid) {
    _pb.authStore.clear()
  }

  _pb?.collection('users')
    .authWithOAuth2({ provider })
}

export async function readFromDatabase() {
  if (!_pb) return null;

  try {
    console.log(">> Reading from server", _pb.baseUrl)

    const savedItems = await _pb.collection(DB_ITEMS_TBL)
      .getFullList<StoredItems>()

    console.log('savedItems')

    return savedItems;
  } catch (err) {
    console.error('Error fetching items', err)
  }
}

export async function writeToDatabase(item: StoredItem) {
  console.log('>> Writing to server', item);

  try {
    const savedItem = await _pb.collection(DB_ITEMS_TBL)
      .getFirstListItem(`game_id="${item.id}"`);

      await _pb.collection(DB_ITEMS_TBL).update(
      savedItem.id,
      {
        quantity: savedItem.quantity + item.qty,
        source: item.source,
      }
    );
  } catch (err) {
    await _pb.collection(DB_ITEMS_TBL).create({
      game_id: item.id,
      quantity: item.qty,
      source: item.source,
      account_id: _pb.authStore.model.id
    });
  }
}

export function writeToStorage(items: StoredItems) {
  console.log('>> Writing to localStorage', items)

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items),
  );
}

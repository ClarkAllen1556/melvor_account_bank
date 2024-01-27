import { effect, signal } from "@preact/signals";
import {
  MAX_SHARE_AMOUNT,
} from "../MoveToShareBankFormElement";
import { readFromDatabase, writeToStorage } from "../../api";
import { STORAGE_KEY } from "../../constants";

export const sharedStorage = signal<StoredItems | null>(null);
export const currentStorageQty = signal<number>(0);

effect(() => {
  if (!sharedStorage.value) {
    currentStorageQty.value = 0;
  } else {
    currentStorageQty.value = Object.keys(sharedStorage.value).length - 1;
  }
});

function readFromStorage(): StoredItems {
  const localStore: StoredItems = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (!localStore) return null;

  return { ...localStore };
}

interface SharedItemProps {
  item: AnyItem;
  qty: number;
  onClick: (i: AnyItem, qty: number) => void;
}

function SharedItem(
  { item, qty, onClick }: SharedItemProps,
) {
  if (!item) return null;

  return (
    <>
      <div
        class="bank-item pointer-enabled m-2"
        role="button"
        data-item-id={item.id}
        onClick={() => onClick(item, qty)}
      >
        <a role="button">
          <img class="bank-img p-3" src={item.media} />
          <div class="font-size-sm text-white text-center in-bank">
            <small class="badge-pill bg-secondary">{qty}</small>
          </div>
        </a>
      </div>
    </>
  );
}

export function ShareBank({ ctx }: { ctx: Modding.ModContext }) {
  readFromDatabase();

  sharedStorage.value = readFromStorage();
  const hasSharedItems = sharedStorage.value
    ? Object.values(sharedStorage.value).length > 0
    : false;

  function handleItemClick(item: AnyItem, qty: number) {
    game.bank.addItemByID(
      item.id,
      qty,
      false,
      false,
      true,
      true,
      sharedStorage.value[item.id].source,
    );

    const updatedStoredItems: StoredItems = sharedStorage.value;
    updatedStoredItems.createdAt = new Date();
    delete updatedStoredItems[item.id];

    writeToStorage(updatedStoredItems);

    sharedStorage.value = { ...updatedStoredItems };
  }

  if (!hasSharedItems) return null;

  return (
    <>
      <details style={{ marginBottom: "6px" }}>
        <summary>
          Notice about shared bank.
        </summary>
        <p>
          <em>
            Items in the shared bank are inaccessible on the player's other
            devices. They return to normal when placed back in a character's
            bank.
          </em>
        </p>
      </details>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        {Object.values(sharedStorage.value).map((item: StoredItem, i) => (
          <div
            key={i}
            id={`item-${item.id}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SharedItem
              item={game.items.getObjectByID(item.id)}
              qty={item.qty}
              onClick={(item, qty) => handleItemClick(item, qty)}
            />
          </div>
        ))}
      </div>
      <div>
        <p style={{ display: "inline" }}>
          <em style={{ marginRight: "6px" }}>Using:</em>
          <strong>{currentStorageQty.value} / {MAX_SHARE_AMOUNT}</strong>
        </p>
        <button
          class="btn btn-link"
          onClick={() => sharedStorage.value = readFromStorage()}
        >
          Refresh
        </button>
      </div>
    </>
  );
}

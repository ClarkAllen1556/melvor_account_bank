import { effect, signal } from "@preact/signals";
import {
  MAX_SHARE_AMOUNT,
  storageKey,
  writeToStorage,
} from "../MoveToShareBankFormElement";

export const sharedStorage = signal<StoredItems | null>(null);
export const currentStorageQty = signal<number>(0);

effect(() => {
  if (!sharedStorage.value) {
    currentStorageQty.value = 0;
  } else {
    currentStorageQty.value = Object.keys(sharedStorage.value).length;
  }
});

function readFromStorage(ctx: Modding.ModContext): StoredItems {
  const accStore: StoredItems = ctx.accountStorage.getItem(storageKey);
  const localStore: StoredItems = JSON.parse(localStorage.getItem(storageKey));

  if (!accStore) {
    if (!localStore) return null;

    return { ...localStore };
  }

  const accStoreLastUpdated = new Date(accStore.createdAt);
  const localStoreLastUpdated = new Date(localStore.createdAt);

  if (accStoreLastUpdated < localStoreLastUpdated) {
    ctx.accountStorage.setItem(storageKey, localStore);

    return { ...localStore };
  }

  return { ...accStore };
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
  sharedStorage.value = readFromStorage(ctx);
  const hasSharedItems = !!Object.values(sharedStorage.value);

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

    writeToStorage(updatedStoredItems, ctx);

    sharedStorage.value = { ...updatedStoredItems };
  }

  if (!hasSharedItems) return null;

  return (
    <>
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
        <p>
          Current storage:{" "}
          <strong>{currentStorageQty.value} / {MAX_SHARE_AMOUNT}</strong>
        </p>
        <button
          class="btn btn-danger"
          onClick={() => sharedStorage.value = readFromStorage(ctx)}
        >
          Refresh
        </button>
      </div>
    </>
  );
}

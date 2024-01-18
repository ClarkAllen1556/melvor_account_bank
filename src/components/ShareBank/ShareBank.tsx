import { effect, signal } from "@preact/signals";
import { html } from "htm/preact";
import { h, render } from "preact";

function readSharedItems() {
  const storageKey = `mlv-item-shared-items` as const;
  const storedItems = JSON.parse(localStorage.getItem(storageKey)) as {
    [K: StoredItem["id"]]: StoredItem;
  };

  if (!storedItems) return {};

  return storedItems;
}

function SharedItem(
  { item, qty, onClick }: {
    item: AnyItem;
    qty: number;
    onClick: (i: AnyItem, qty: number) => void;
  },
) {
  return (
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
  );
}

export function ShareBank({ ctx }: { ctx: Modding.ModContext }) {
  const storedItems = signal<{ [K: StoredItem["id"]]: StoredItem }>({});

  storedItems.value = readSharedItems();

  function handleItemClick(item: AnyItem, qty: number) {
    console.log(item);

    game.bank.addItemByID(item.id, qty, false, false, true, true, storedItems.value[item.id].source);

    const updatedStoredItems = storedItems.value;
    delete updatedStoredItems[item.id];

    localStorage.setItem(
      `mlv-item-shared-items`,
      JSON.stringify(updatedStoredItems)
    )

    storedItems.value = updatedStoredItems;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginBottom: "6px"
        }}
      >
        {Object.values(storedItems.value).map((item: StoredItem, i) => (
          <div key={i} id={`item-${item.id}`}>
            <SharedItem
              item={game.items.getObjectByID(item.id)}
              qty={item.qty}
              onClick={(item, qty) =>
                handleItemClick(item, qty)
              }
            />
          </div>
        ))}
      </div>
      <button class="btn btn-danger" onClick={() => storedItems.value = readSharedItems()}>
        Refresh shared items
      </button>
    </>
  );
}

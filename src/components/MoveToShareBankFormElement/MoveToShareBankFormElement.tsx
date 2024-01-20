import { effect, signal } from "@preact/signals";

export const selectedBankItemSig = signal<BankItem | null>(null);

export function MoveToShareBankForm({ ctx }: { ctx: Modding.ModContext }) {
  const transferQuantity = signal<number>(0);

  function transferItems() {
    if (!selectedBankItemSig.value?.item) return;
    if (transferQuantity.value <= 0) return;
    if (transferQuantity.value > selectedBankItemSig.value.quantity) return;

    const item: StoredItem = {
      id: selectedBankItemSig.value.item.id,
      qty: transferQuantity.value,
      source: game.characterName,
    };
    const storageKey = `mlv-item-shared-items` as const;
    let storedItems = JSON.parse(localStorage.getItem(storageKey)) as {
      [K: StoredItem["id"]]: StoredItem;
    };

    if (storedItems) {
      if (storedItems[item.id]) {
        item.qty += storedItems[item.id].qty;
      } else {
        storedItems[item.id] = item;
      }
    } else {
      storedItems = {
        [item.id]: item,
      };
    }

    localStorage.setItem(
      `mlv-item-shared-items`,
      JSON.stringify(storedItems),
    );

    game.bank.removeItemQuantity(
      selectedBankItemSig.value.item,
      transferQuantity.value,
      false,
    );
  }

  if (!selectedBankItemSig.value) return null;

  return (
    <div class="col-12">
      <div class="block block-rounded-double bg-combat-inner-dark">
        <div class="block-header block-header-default bg-dark-bank-block-header px-3 py-1">
          <h5 class="font-size-sm font-w600 mb-0">Send item(s) to shared bank</h5>
        </div>
        <div class="col-12 pt-2">
          <div>
            {selectedBankItemSig.value?.item?.name}
          </div>
          <input
            class="form-control m-1"
            type="number"
            placeholder="quantity"
            onChange={(e) =>
              transferQuantity.value = Number(
                (e.target as HTMLInputElement).value,
              )}
          />
          <div>
            <button class="btn btn-danger" onClick={ () => transferItems() }>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

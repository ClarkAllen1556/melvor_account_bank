import { signal } from "@preact/signals";
import { currentStorageQty, sharedStorage } from "../ShareBank";

export const selectedBankItem = signal<BankItem | null>(null);
export const storageKey = `mlv-item-shared-items` as const;
export const MAX_SHARE_AMOUNT = 10;

export function writeToStorage(items: StoredItems, ctx: Modding.ModContext) {
  ctx.accountStorage.setItem(storageKey, items);

  localStorage.setItem(
    storageKey,
    JSON.stringify(items),
  );
}

const transferQuantity = signal<number>(0);
const isShareFull = signal<boolean>(
  currentStorageQty.value >= MAX_SHARE_AMOUNT,
);

export function MoveToShareBankForm({ ctx }: { ctx: Modding.ModContext }) {
  function transferItems() {
    if (!selectedBankItem.value?.item) return;
    if (transferQuantity.value <= 0) return;
    if (transferQuantity.value > selectedBankItem.value.quantity) return;

    const item: StoredItem = {
      id: selectedBankItem.value.item.id,
      qty: transferQuantity.value,
      source: game.characterName,
    };
    let storedItems = sharedStorage?.value ?? {} as StoredItems;
    storedItems.createdAt = new Date();

    if (storedItems[item.id]) {
      storedItems[item.id].qty += item.qty;
    } else {
      storedItems[item.id] = item;
    }

    try {
      writeToStorage(storedItems, ctx);

      game.bank.removeItemQuantity(
        selectedBankItem.value.item,
        transferQuantity.value,
        false,
      );

      sharedStorage.value = { ...storedItems };
    } catch (e) {
      console.error("Error occurred while writing to storage", e);

      SwalLocale.fire(
        "Shared Bank",
        "An error occured while writing to shared storage. No items have been removed from your inventory.",
      );
    }
  }

  function setTransferAmountByPercentage(p: number) {
    const franctionalAmount = Math.floor(selectedBankItem.value.quantity * p);

    transferQuantity.value = franctionalAmount;

    console.log("frac >>", franctionalAmount);
    console.log("trans qty >>", transferQuantity.value);
  }

  if (!selectedBankItem.value) return null;

  return (
    <div class="col-12">
      <div class="block block-rounded-double bg-combat-inner-dark">
        <div class="block-header block-header-default bg-dark-bank-block-header px-3 py-1">
          <h5 class="font-size-sm font-w600 mb-0">
            Send item(s) to shared bank
          </h5>
        </div>
        <div class="col-12 pt-2">
          <div>
            {selectedBankItem.value?.item?.name}
          </div>
          <input
            class="form-control m-1"
            type="number"
            placeholder="quantity"
            value={transferQuantity.value}
            onChange={(e) =>
              transferQuantity.value = Number(
                (e.currentTarget as HTMLInputElement).value,
              )}
          />
          <div>
            <div>
              {isShareFull.value && (
                <div>
                  <strong>Shared storage is full.</strong>
                </div>
              )}
              <div>
                <strong>{currentStorageQty.value} / {MAX_SHARE_AMOUNT}</strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <button
                disabled={isShareFull.value}
                class="btn btn-info"
                style={{
                  marginBlock: "6px",
                }}
                onClick={() => setTransferAmountByPercentage(.25)}
              >
                25%
              </button>
              <button
                disabled={isShareFull.value}
                class="btn btn-info"
                style={{
                  marginBlock: "6px",
                }}
                onClick={() => setTransferAmountByPercentage(.5)}
              >
                50%
              </button>
              <button
                disabled={isShareFull.value}
                class="btn btn-info"
                style={{
                  marginBlock: "6px",
                }}
                onClick={() => setTransferAmountByPercentage(1)}
              >
                100%
              </button>
              <button
                disabled={isShareFull.value}
                class="btn btn-danger"
                style={{
                  marginBlock: "6px",
                  marginLeft: "auto",
                }}
                onClick={() => transferItems()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

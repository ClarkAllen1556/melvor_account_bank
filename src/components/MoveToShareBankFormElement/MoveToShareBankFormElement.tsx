import { signal } from "@preact/signals";
import { currentStorageQty, sharedStorage } from "../ShareBank";
import { writeToDatabase, writeToStorage } from "../../api";

export const MAX_SHARE_AMOUNT = 75 as const;
export const selectedBankItem = signal<BankItem | null>(null);

const transferQuantity = signal<number>(0);
const isShareFull = signal<boolean>(
  currentStorageQty.value >= MAX_SHARE_AMOUNT,
);
const showMovedNotice = signal<boolean>(false);

export function MoveToShareBankForm({ ctx }: { ctx: Modding.ModContext }) {
  async function transferItems() {
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

    await writeToDatabase(item);

    if (storedItems[item.id]) {
      storedItems[item.id].qty += item.qty;
    } else {
      storedItems[item.id] = item;
    }

    try {
      writeToStorage(storedItems);

      game.bank.removeItemQuantity(
        selectedBankItem.value.item,
        transferQuantity.value,
        false,
      );
      game.notifications.addNotification(
        new RemoveItemNotification(selectedBankItem.value.item),
        {
          text: `${selectedBankItem.value.item.name} moved to shared bank`,
          quantity: -item.qty,
          media: selectedBankItem.value.item.media,
          isImportant: false,
          isError: false,
        },
      );

      toggleMoveNotice();

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
  }

  function toggleMoveNotice() {
    showMovedNotice.value = true;

    setTimeout(() => {
      showMovedNotice.value = false;
    }, 1500);
  }

  if (!selectedBankItem.value) return null;

  return (
    <>
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

              {showMovedNotice.value && (
                <strong>
                  Item(s) have been moved!
                </strong>
              )}

              <button
                disabled={isShareFull.value || showMovedNotice.value}
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
    </>
  );
}

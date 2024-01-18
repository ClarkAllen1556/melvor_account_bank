import { effect, signal } from '@preact/signals';

export const selectedBankItemSig = signal<BankItem | null>(null);

export class MoveToShareBankFormElement {
  readonly #shadow: HTMLElement = null;
  #transferQuantity: number = 0;
  #key = crypto.randomUUID();
  #context: Modding.ModContext = null;

  constructor(ctx: Modding.ModContext) {
    this.#shadow = document.createElement('div');
    this.#shadow.classList.add('col-12')

    this.#context = ctx;

    effect(() => {
      this.#render();
    })
  }

  get instance() {
    return this.#shadow
  }

  #transferItems() {
    if (!selectedBankItemSig.value?.item) return;
    if (this.#transferQuantity <= 0) return;
    if (this.#transferQuantity > selectedBankItemSig.value.quantity) return;

    const item: StoredItem = {
      id: selectedBankItemSig.value.item.id,
      qty: this.#transferQuantity,
      source: game.characterName
    };
    const storageKey = `mlv-item-shared-items` as const;
    let storedItems = JSON.parse(localStorage.getItem(storageKey)) as { [K: StoredItem['id'] ]: StoredItem };

    console.log('>>> stored items', storedItems);

    if (storedItems) {
      if (storedItems[item.id]) {
        item.qty += storedItems[item.id].qty;
      } else {
        storedItems[item.id] = item
      }
    } else {
      storedItems = {
        [item.id]: item
      }
    }

    this.#context.accountStorage.setItem(storageKey, storedItems);

    localStorage.setItem(
      `mlv-item-shared-items`,
      JSON.stringify(storedItems)
    )

    game.bank.removeItemQuantity(
      selectedBankItemSig.value.item,
      this.#transferQuantity,
      false
      );
  }

  #render() {
    this.#shadow.innerHTML = `
      <div class="col-12">
        <div class="block block-rounded-double bg-combat-inner-dark">

          <div class="block-header block-header-default bg-dark-bank-block-header px-3 py-1">
            <h5 class="font-size-sm font-w600 mb-0">Send item(s) to clan bank</h5>
          </div>
          <div class="col-12 pt-2">
            <div>
              ${selectedBankItemSig.value?.item?.name}
            </div>
            <input id="qty-input-${ this.#key }" class="form-control m-1" type="number" placeholder="quantity">
            <div>
              <button id="trns-btn-${ this.#key }" class="btn btn-danger">Send</button>
            </div>
          </div>
        </div>
      </div>
      `

      this.#shadow.querySelector(`#qty-input-${ this.#key }`)
        .addEventListener('input', (e: InputEvent) => {
          const val = Number((e.target as HTMLInputElement).value);
          this.#transferQuantity = val;
        })

        this.#shadow.querySelector(`#trns-btn-${ this.#key }`)
        .addEventListener('click', () => {
          this.#transferItems()
        })
  }
}
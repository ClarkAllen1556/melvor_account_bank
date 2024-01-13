import { effect, signal } from '@preact/signals';

export const selectedBankItemSig = signal<BankItem | null>(null);

export class SendToClanFormElement {
  readonly #shadow: HTMLElement = null;
  #transferQuantity: number = 0;
  #key = crypto.randomUUID();

  constructor() {
    this.#shadow = document.createElement('div');
    this.#shadow.classList.add('col-12')

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

    console.log('transfer >>>>', selectedBankItemSig.value, this.#transferQuantity)

    const item = {
      id: selectedBankItemSig.value.item.id,
      qty: this.#transferQuantity,
      data: selectedBankItemSig.value.item,
      source: game.characterName
    };
    const storageKey = `mlv-item-shared-${ item.id }` as const;
    const checkedItem = JSON.parse(localStorage.getItem(storageKey)) as typeof item;

    if (checkedItem) {
      item.qty += checkedItem.qty;
    }

    localStorage.setItem(
      `mlv-item-shared-${item.id}`,
      JSON.stringify(item)
    )

    game.bank.removeItemQuantity(
      selectedBankItemSig.value.item,
      this.#transferQuantity,
      false
      );
  }

  #render() {
    console.log('>>> render', selectedBankItemSig.value)

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
        .addEventListener('click', (e: InputEvent) => {
          this.#transferItems()
        })
  }
}
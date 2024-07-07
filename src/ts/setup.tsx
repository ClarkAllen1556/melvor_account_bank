import { render } from "preact";
import {
  MoveToShareBankForm,
  selectedBankItem,
} from "../components/MoveToShareBankFormElement";
import { ShareBank } from "../components/ShareBank";
import "../css/styles.css";

export async function setup(ctx: Modding.ModContext) {
  ctx.patch(BankTabMenuElement, "initialize").after(() => {
    const root = document.createElement("div");
    render(<ShareBank ctx={ctx} />, root);

    // Shared Bank button
    const openShareBankRoot = document.createElement("span");

    render(
      <button
        class="btn btn-info m-1"
        style={{ marginBlock: "auto " }}
        onClick={() => open(ctx, root)}
      >
        Shared Bank
      </button>,
      openShareBankRoot,
    );

    bankOptionsMenu
      .children[0]
      .querySelector('.row')
      .children[0]
      .children[0]
      .appendChild(openShareBankRoot);
  });

  ctx.patch(BankItemSettingsMenuElement, "setItem").after((_, item, game) => {
    selectedBankItem.value = item;
  });

  ctx.patch(BankItemSettingsMenuElement, "setUnselected").after(() => {
    selectedBankItem.value = null;
  });

  ctx.patch(BankItemSettingsMenuElement, "initialize").after((returnValue, game) => {
    const root = document.createElement("div");
    root.classList.add('col-13')

    render(<MoveToShareBankForm ctx={ctx} />, root);

    bankSideBarMenu.children[1].appendChild(root);
  });
}

function open(ctx: Modding.ModContext, html: HTMLElement) {
  SwalLocale.fire({
    title: "Shared Bank",
    html,
  });
}

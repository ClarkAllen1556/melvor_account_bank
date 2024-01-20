import { h, render } from "preact";
import {
  MoveToShareBankForm,
  selectedBankItem,
} from "../components/MoveToShareBankFormElement";
import { ShareBank } from "../components/ShareBank";
import ModData from "../data/data.json";
import "../css/styles.css";
import "../img/icon.png";

export async function setup(ctx: Modding.ModContext) {
  await ctx.gameData.addPackage(ModData);

  ctx.patch(BankTabMenu, "initialize").after(() => {
    const root = document.createElement("div");
    render(<ShareBank ctx={ctx} />, root);

    const openShareBankRoot = document.createElement("div");
    render(
      <button class="btn btn-info" onClick={() => open(ctx, root)}>
        Share Bank
      </button>,
      openShareBankRoot,
    );

    bankTabMenu.appendChild(openShareBankRoot)

    sidebar.category('Shared').item('Shared Bank', {
      onClick() {
        open(ctx, root);
      },
    });
  })

  ctx.patch(BankItemSettingsMenu, "setItem").after((_, item, game) => {
    selectedBankItem.value = item;
  });

  ctx.patch(BankItemSettingsMenu, "setUnselected").after(() => {
    selectedBankItem.value = null;
  });

  ctx.patch(BankItemSettingsMenu, "initialize").after((returnValue, game) => {
    const root = document.createElement("div");
    render(<MoveToShareBankForm ctx={ctx} />, root);
    bankSideBarMenu.appendChild(root);
  });
}

function open(ctx: Modding.ModContext, html: HTMLElement) {
  SwalLocale.fire({
    title: "Shared Bank",
    html,
  });
}

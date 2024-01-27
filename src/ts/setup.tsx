import { render } from 'preact';
import {
  MoveToShareBankForm,
  selectedBankItem,
} from "../components/MoveToShareBankFormElement";
import { ShareBank } from "../components/ShareBank";
import "../css/styles.css";
import { MOD_SETTINGS } from "../constants";
import { dbHost, init, login } from '../api';

export async function setup(ctx: Modding.ModContext) {
  const savedHostname = ctx.accountStorage.getItem(MOD_SETTINGS.DB_HOST);

  if (savedHostname?.trim()) {
    init(savedHostname);
  }

  ctx.settings.section('General').add([
    {
      type: 'text',
      name: 'account-bank-db-host',
      label: 'Account bank server URL',
      hint: 'Which server you would like your bank to be saved too.',
      default: 'http://localhost:8090',
      onChange: (cur: string) => {
        if (!cur.trim()) return;

        if (ctx.accountStorage.getItem(MOD_SETTINGS.DB_HOST)) {
          ctx.accountStorage.removeItem(MOD_SETTINGS.DB_HOST);
        }

        ctx.accountStorage.setItem(MOD_SETTINGS.DB_HOST, cur);

        dbHost.value = cur;
      }
    },
    {
      type: 'button',
      name: 'account-bank-login',
      display: 'Login with Discord',
      onClick: () => {
        login('discord')
      }
    } as Modding.Settings.ButtonConfig,
  ]);

  ctx.patch(BankTabMenu, "initialize").after(() => {
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
      .querySelector(".row")
      .children[0]
      .children[0]
      .appendChild(openShareBankRoot);
  });

  ctx.patch(BankItemSettingsMenu, "setItem").after((_, item, game) => {
    selectedBankItem.value = item;
  });

  ctx.patch(BankItemSettingsMenu, "setUnselected").after(() => {
    selectedBankItem.value = null;
  });

  ctx.patch(BankItemSettingsMenu, "initialize").after((returnValue, game) => {
    const root = document.createElement("div");
    root.classList.add("col-13");

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

import Greeter from '../components/Greeter/Greeter';
import ModData from '../data/data.json';
import '../css/styles.css';
import '../img/icon.png';
import LargeIcon from '../img/icon_large.png';
import { MoveToShareBankFormElement, selectedBankItemSig } from '../components/MoveToShareBankFormElement';
import { ShareBank } from '../components/ShareBank';

import { h, render } from 'preact'
import { html } from 'htm/preact'

function App(props: any) {
  return html`<h1>Hello ${props.name}!</h1>`;
}


export async function setup(ctx: Modding.ModContext) {
  await ctx.gameData.addPackage(ModData);

  ctx.onModsLoaded(() => {
    const root = document.createElement('div');
    render(<ShareBank ctx={ctx} />, root);

    sidebar.category('Clan').item('Clan Bank', {
      icon: ctx.getResourceUrl('img/icon.png'),
      onClick() {
        open(ctx, root);
      },
    });
  });

  ctx.patch(BankItemSettingsMenu, 'setItem').after((_, item, game) => {
    console.log('the bank item changed >>>', item);
    selectedBankItemSig.value = item;
  })

  ctx.patch(BankItemSettingsMenu, 'setUnselected').after(() => {
    console.log('the bank item was unselected >>>');
    selectedBankItemSig.value = null;
  })

  ctx.patch(BankItemSettingsMenu, 'initialize').after((returnValue, game) => {
    bankSideBarMenu.appendChild(new MoveToShareBankFormElement(ctx).instance)
  });
}

function open(ctx: Modding.ModContext, html: HTMLElement) {
  SwalLocale.fire({
    title: "Shared Bank",
    html,
  });
}
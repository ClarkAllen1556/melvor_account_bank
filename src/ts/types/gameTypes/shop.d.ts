interface ShopCategoryData extends IDData {
    name: string;
    media: string;
    isGolbinRaid?: boolean;
    allowedGamemodeIDs?: string[];
}
declare class ShopCategory extends NamespacedObject {
    get name(): string;
    get media(): string;
    _name: string;
    _media: string;
    isGolbinRaid: boolean;
    allowedGamemodes: Set<Gamemode>;
    constructor(namespace: DataNamespace, data: ShopCategoryData, game: Game);
}
declare type OldShopCategory = 'General' | 'SkillUpgrades' | 'Slayer' | 'Gloves' | 'Skillcapes' | 'SuperiorSkillcapes' | 'Materials' | 'GolbinRaid' | 'Township';
/** Cost is fixed */
declare type FixedCost = {
    type: 'Fixed';
    cost: number;
};
/** Cost depends on quantity bought. inital + numBought*scaling */
declare type LinearCost = {
    type: 'Linear';
    initial: number;
    scaling: number;
};
/** Cost depends on the bank slot cost formula */
declare type BankSlotCost = {
    type: 'BankSlot';
};
/** Cost is reduced if merchant's permit is read */
declare type GloveCost = {
    type: 'Glove';
    cost: number;
};
declare type AnyShopCost = FixedCost | LinearCost | BankSlotCost | GloveCost;
declare type ShopCurrencyCostData = AnyShopCost & {
    /** The ID of the currency */
    currency: string;
};
declare type ShopCurrencyCost = AnyShopCost & {
    currency: Currency;
};
/**
 * @deprecated TODO_D - remove this once old currency props removed
 * Returns true if the ShopCostAmount will always be nothing */
declare function isShopCostZero(cost: AnyShopCost): boolean;
declare type CurrentShopDescription = 'PercentIncrease' | 'PercentDecrease' | 'Increase' | 'Decrease' | 'SecondsIncrease' | 'SecondsDecrease';
interface ShopPurchaseContainsData extends IStatObjectData {
    items: IDQuantity[];
    itemCharges?: IDQuantity;
    petID?: string;
    lootBox?: boolean;
    bankTab?: boolean;
}
interface ShopPurchaseData extends IDData {
    /** Custom name for the purchase. Overrides name based on purchase contents. */
    customName?: string;
    /** Custom description for the purchase. Overides description based on purchase contents. */
    customDescription?: string;
    media: string;
    category: string;
    contains: ShopPurchaseContainsData;
    cost: ShopCostData;
    allowQuantityPurchase: boolean;
    /** Previous shop purchases required for item to show in shop */
    unlockRequirements: ShopPurchaseRequirementData[];
    /** Requirements for item to be purchased */
    purchaseRequirements: AnyRequirementData[];
    /** Default purchase limit */
    defaultBuyLimit: number;
    /** Buy limit overrides for specific gamemodes */
    buyLimitOverrides: {
        gamemodeID: string;
        maximum: number;
    }[];
    showBuyLimit: boolean;
    currentDescription?: CurrentShopDescription;
    allowedGamemodeIDs?: string[];
}
interface ShopCostData {
    /** @deprecated Use currencies prop instead */
    gp?: AnyShopCost;
    /** @deprecated Use currencies prop instead */
    slayerCoins?: AnyShopCost;
    /** @deprecated Use currencies prop instead */
    raidCoins?: AnyShopCost;
    currencies?: ShopCurrencyCostData[];
    items: IDQuantity[];
}
interface ShopCost {
    currencies: ShopCurrencyCost[];
    items: ItemQuantity<AnyItem>[];
}
interface ShopPurchaseModificationData {
    /** The ID of the purchase to modify */
    id: string;
    /** Additional buy limit overrides to apply to the purchase */
    buyLimitOverrides?: {
        gamemodeID: string;
        maximum: number;
    }[];
    /** Replacement purchase requirements to apply the purchase */
    purchaseRequirements?: {
        gamemodeID: string;
        newRequirements: AnyRequirementData[];
    }[];
    /** Replacement purchase costs to apply the purchase */
    cost?: {
        gamemodeID: string;
        newCosts: ShopCostData;
    }[];
}
declare class ShopPurchase extends NamespacedObject implements SoftDataDependant<ShopPurchaseData> {
    get media(): string;
    get name(): string;
    get englishName(): string;
    get englishDescription(): string;
    get hasCustomName(): boolean;
    get hasCustomDescription(): boolean;
    get description(): string;
    get hasDisabledModifier(): boolean;
    get costs(): ShopCost;
    get purchaseRequirements(): AnyRequirement[];
    _media: string;
    category: ShopCategory;
    contains: {
        items: AnyItemQuantity[];
        itemCharges?: EquipmentQuantity;
        pet?: Pet;
        lootBox?: boolean;
        bankTab?: boolean;
        stats?: StatObject;
    };
    _costs: Map<Gamemode, ShopCost>;
    _defaultCosts: ShopCost;
    unlockRequirements: ShopPurchaseRequirement[];
    _purchaseRequirements: Map<Gamemode, AnyRequirement[]>;
    _defaultPurchaseRequirements: AnyRequirement[];
    currentDescription?: CurrentShopDescription;
    /** Purchase limit by Gamemode. If unset, no limit exists. */
    _buyLimitOverrides: Map<Gamemode, number>;
    _defaultBuyLimit: number;
    allowQuantityPurchase: boolean;
    showBuyLimit: boolean;
    _customName?: string;
    _customDescription?: string;
    allowedGamemodes: Set<Gamemode>;
    constructor(namespace: DataNamespace, data: ShopPurchaseData, game: Game);
    registerSoftDependencies(data: ShopPurchaseData, game: Game): void;
    applyDataModification(modData: ShopPurchaseModificationData, game: Game): void;
    getBuyLimit(gamemode: Gamemode): number;
    /** Returns the description templated with buyQuantity */
    getTemplatedDescription(shop: Shop): string;
    /** Gets template data for the description */
    getDescriptionTemplateData(buyQuantity: number): StringDictionary<string>;
    getCostsFromData(data: ShopCostData, game: Game): ShopCost;
}
declare class DummyShopPurchase extends ShopPurchase {
    constructor(namespace: DataNamespace, id: string, game: Game);
}
interface ShopUpgradeChainData extends IDData {
    rootUpgradeID: string;
    /** Display name of the ugprade chain */
    chainName: string;
    /** Default name of the upgrade when none is owned */
    defaultName: string;
    /** Default description of the upgrade when none is owned */
    defaultDescription: string;
    /** Localization data for chainName */
    chainNameLang?: string;
    /** Localization data for defaultName */
    defaultNameLang?: string;
    /** Localization data for defaultDescription */
    descriptionLang?: string;
    /** The default media to show when none is owned */
    defaultMedia?: string;
}
interface ShopUpgradeChainModificationData extends IDData {
    rootUpgradeID?: string;
}
declare class ShopUpgradeChain extends NamespacedObject {
    rootUpgrade: ShopPurchase;
    get chainName(): string;
    get defaultName(): string;
    get defaultDescription(): string;
    get media(): string;
    get defaultMedia(): string;
    _chainName: string;
    chainNameLang?: string;
    nameLang?: string;
    descriptionLang?: string;
    _defaultName: string;
    _defaultDescription: string;
    _defaultMedia: string;
    constructor(namespace: DataNamespace, data: ShopUpgradeChainData, game: Game);
    applyDataModification(modData: ShopUpgradeChainModificationData, game: Game): void;
}
declare class ShopRenderQueue {
    requirements: boolean;
    costs: boolean;
    upgrades: boolean;
}
declare type ShopEvents = {
    purchaseMade: ShopPurchaseMadeEvent;
};
declare class Shop extends GameEventEmitter<ShopEvents> implements EncodableObject, IRaidStatProvider {
    game: Game;
    providedStats: StatProvider;
    raidStats: StatProvider;
    /** Stores the number of times an upgrade has been purchased */
    upgradesPurchased: Map<ShopPurchase, number>;
    buyQuantity: number;
    purchases: NamespaceRegistry<ShopPurchase>;
    purchaseDisplayOrder: NamespacedArray<ShopPurchase>;
    upgradeChains: NamespaceRegistry<ShopUpgradeChain>;
    categories: NamespaceRegistry<ShopCategory>;
    categoryDisplayOrder: NamespacedArray<ShopCategory>;
    purchasesByItem: Map<AnyItem, ShopPurchase>;
    renderQueue: ShopRenderQueue;
    constructor(game: Game);
    onLoad(): void;
    render(): void;
    renderCosts(): void;
    renderRequirements(): void;
    renderUpgrades(): void;
    postDataRegistration(): void;
    /** Gets the total number of upgrades purchased. If golbinRaid, returns for Raid, else for base game. */
    getTotalUpgradesPurchased(golbinRaid: boolean): number;
    isUpgradePurchased(upgrade: ShopPurchase): boolean;
    getPurchaseCount(purchase: ShopPurchase): number;
    isPurchaseAtBuyLimit(purchase: ShopPurchase): boolean;
    getQuickBuyPurchase(item: AnyItem): ShopPurchase | undefined;
    /** Starting with an upgrade, progresses down it's unlock requirements until a purchase that is owned is found. Returns undefined if no purchase found. */
    getLowestUpgradeInChain(purchase: ShopPurchase): ShopPurchase | undefined;
    getTotalStatsInChain(purchase: ShopPurchase): StatObjectSummary;
    capPurchaseQuantity(purchase: ShopPurchase, buyQuantity: number): number;
    getPurchaseCosts(purchase: ShopPurchase, quantity: number): Costs;
    /** On click callback function for quick buying */
    quickBuyItemOnClick(purchase: ShopPurchase): void;
    /** On click callback for buying a shop item */
    buyItemOnClick(purchase: ShopPurchase, confirmed?: boolean): void;
    /** Callback function for updating the buy quantity */
    updateBuyQuantity(quantity: number): void;
    encode(writer: SaveWriter): SaveWriter;
    decode(reader: SaveWriter, version: number): void;
    computeProvidedStats(updatePlayers?: boolean): void;
    /** Gets the currency cost for a given purchase quantity */
    getCurrencyCost(cost: AnyShopCost, buyQuantity: number, boughtQuantity: number): number;
    getCurrentDescription(purchase: ShopPurchase): string;
    convertFromOldFormat(save: NewSaveGame, idMap: NumericIDMap): void;
    /** Removes purchases that are above their buy limit */
    removePurchasesAboveLimit(): void;
    /** Maximum that the buy quantity can be set to. Uint32 Max */
    static readonly MAX_BUY_QUANTITY = 4294967295;
}
declare class BankUpgradeCost {
    equate(gp: number): number;
    level_to_gp(level: number): number;
    gp_to_level(gp: number): number;
}
declare class NewNewBankUpgradeCost {
    equate(level: number): number;
    level_to_gp(level: number): number;
}
declare class NewBankUpgradeCost {
    equate(gp: number): number;
    level_to_gp(level: number): number;
    gp_to_level(gp: number): number;
}
declare const bankUpgradeCost: BankUpgradeCost;
declare const newBankUpgradeCost: NewBankUpgradeCost;
declare const newNewBankUpgradeCost: NewNewBankUpgradeCost;

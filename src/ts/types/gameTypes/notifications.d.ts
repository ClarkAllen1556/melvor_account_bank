interface NotificationData {
    media: string;
    quantity: number;
    text: string;
    isImportant: boolean;
    isError: boolean;
}
declare type AnyNotification = GenericNotification | AddItemNotification | RemoveItemNotification | SummoningMarkNotification | ErrorNotification | SuccessNotification | InfoNotification | SkillXPNotification | AbyssalXPNotification;
declare type NotificationType = 'AddItem' | 'RemoveItem' | 'AddGP' | 'RemoveGP' | 'AddSlayerCoins' | 'RemoveSlayerCoins' | 'SummoningMark' | 'Error' | 'Success' | 'Info' | 'SkillXP' | 'AbyssalXP' | 'MasteryLevel' | 'AddCurrency' | 'RemoveCurrency';
declare const enum NotificationHorizontalPositions {
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2
}
declare class GenericNotification {
    _type: NotificationType;
    constructor(type: NotificationType);
    get type(): NotificationType;
}
declare class AddCurrencyNotification extends GenericNotification {
    get currency(): Currency;
    _currency: Currency;
    constructor(currency: Currency);
}
declare class RemoveCurrencyNotification extends GenericNotification {
    get currency(): Currency;
    _currency: Currency;
    constructor(currency: Currency);
}
declare class AddItemNotification extends GenericNotification {
    _item: AnyItem;
    constructor(item: AnyItem);
    get item(): AnyItem;
}
declare class RemoveItemNotification extends GenericNotification {
    _item: AnyItem;
    constructor(item: AnyItem);
    get item(): AnyItem;
}
declare class SummoningMarkNotification extends GenericNotification {
    _mark: SummoningRecipe;
    constructor(mark: SummoningRecipe);
    get mark(): SummoningRecipe;
}
declare class ErrorNotification extends GenericNotification {
    _customID: string;
    constructor(customID: string);
    get customID(): string;
}
declare class SuccessNotification extends GenericNotification {
    _customID: string;
    constructor(customID: string);
    get customID(): string;
}
declare class InfoNotification extends GenericNotification {
    _customID: string;
    constructor(customID: string);
    get customID(): string;
}
declare class SkillXPNotification extends GenericNotification {
    _skill: AnySkill;
    constructor(skill: AnySkill);
    get skill(): AnySkill;
}
declare class AbyssalXPNotification extends GenericNotification {
    _skill: AnySkill;
    constructor(skill: AnySkill);
    get skill(): AnySkill;
}
declare class MasteryLevelNotification extends GenericNotification {
    _action: MasteryAction;
    constructor(action: MasteryAction);
    get action(): MasteryAction;
}
declare class NotificationsManager {
    readonly OFFSET = 5;
    activeNotifications: Map<AnyNotification, NotificationData>;
    activeNotificationElements: Map<AnyNotification, GameNotificationElement>;
    timeoutIds: Map<AnyNotification, number>;
    addCurrencyNotifications: Map<Currency, AddCurrencyNotification>;
    removeCurrencyNotifications: Map<Currency, RemoveCurrencyNotification>;
    addItemNotificationClasses: Map<AnyItem, AddItemNotification>;
    removeItemNotificationClasses: Map<AnyItem, RemoveItemNotification>;
    summoningMarkNotificationClasses: Map<SummoningRecipe, SummoningMarkNotification>;
    errorNotificationClasses: Map<string, ErrorNotification>;
    successNotificationClasses: Map<string, SuccessNotification>;
    infoNotificationClasses: Map<string, InfoNotification>;
    genericNotificationClasses: Map<string, GenericNotification>;
    skillXPNotificationClasses: Map<AnySkill, SkillXPNotification>;
    masteryLevelNotificationClasses: Map<MasteryAction, MasteryLevelNotification>;
    abyssalXPNotificationClasses: Map<AnySkill, AbyssalXPNotification>;
    constructor();
    get genericNotificationData(): NotificationData;
    get timeoutDelay(): number;
    createSkillXPNotification(skill: AnySkill, quantity: number): void;
    newSkillXPNotification(skill: AnySkill): SkillXPNotification | undefined;
    createAbyssalXPNotification(skill: AnySkill, quantity: number): void;
    newAbyssalXPNotification(skill: AnySkill): AbyssalXPNotification | undefined;
    createMasteryLevelNotification(action: MasteryAction, level: number): void;
    newMasteryLevelNotification(action: MasteryAction): MasteryLevelNotification | undefined;
    createItemNotification(item: AnyItem, quantity: number): void;
    newAddItemNotification(item: AnyItem): AddItemNotification | undefined;
    newRemoveItemNotification(item: AnyItem): RemoveItemNotification | undefined;
    createCurrencyNotification(currency: Currency, quantity: number): void;
    getAddCurrencyNotification(currency: Currency): AddCurrencyNotification;
    getRemoveCurrencyNotification(currency: Currency): RemoveCurrencyNotification;
    createGPNotification(quantity: number): void;
    createSlayerCoinsNotification(quantity: number): void;
    createSummoningMarkNotification(mark: SummoningRecipe): void;
    createErrorNotification(customID: string, msg: string): void;
    createSuccessNotification(customID: string, msg: string, media: string, quantity?: number): void;
    createInfoNotification(customID: string, msg: string, media: string, quantity?: number): void;
    newAddGenericNotification(type: NotificationType): GenericNotification | undefined;
    newRemoveGenericNotification(type: NotificationType): GenericNotification | undefined;
    newSummoningMarkNotification(mark: SummoningRecipe): SummoningMarkNotification | undefined;
    newAddErrorNotification(customID: string): ErrorNotification | undefined;
    newAddSuccessNotification(customID: string): SuccessNotification | undefined;
    newAddInfoNotification(customID: string): InfoNotification | undefined;
    addNotification(key: AnyNotification, notification: NotificationData): void;
    /** Sort notifications so important and errors always display first */
    sortNotifications(): Map<AnyNotification, NotificationData>;
    removeNotification(key: AnyNotification): void;
    editNotification(key: AnyNotification, notification: NotificationData): void;
    displayNotification(key: AnyNotification, notification: NotificationData): void;
    removeNotificationElement(key: AnyNotification): void;
    updateNotificationElement(key: AnyNotification, notification: NotificationData, qtyChange: number): void;
    createNotificationContainer(key: AnyNotification, notification: NotificationData): GameNotificationElement;
    getBorderColour(type: NotificationType, notification: NotificationData): "#1b9f12" | "#e56767" | "#5cace5" | "yellow" | "green" | "#30c78d" | "red";
    updateAllNotificationPositions(): void;
    updateAllNotificationText(): void;
    updateAllNotificationImportance(): void;
    toggleCompactNotifications(): void;
    setInBankText(key: AnyNotification): void;
    setNotificationText(key: AnyNotification, notification: NotificationData): void;
    pulseNotificationContainer(key: AnyNotification): void;
    adjustAllNotificationPositions(): void;
    clearTimeout(key: AnyNotification): void;
    resetTimeout(key: AnyNotification): void;
}
declare class GameNotificationElement extends HTMLElement implements CustomElement {
    _content: DocumentFragment;
    container: HTMLDivElement;
    media: HTMLImageElement;
    quantity: HTMLSpanElement;
    divQuantity: HTMLDivElement;
    text: HTMLSpanElement;
    inBank: HTMLSpanElement;
    splashContainer: HTMLDivElement;
    iconImportant: HTMLDivElement;
    splashManager?: SplashManager;
    tooltip?: TippyTooltip;
    constructor();
    get isCompact(): boolean;
    connectedCallback(): void;
    initSplashManager(): void;
    setNotification(key: AnyNotification, notification: NotificationData, game: Game): void;
    setImportance(key: AnyNotification, notification: NotificationData, game: Game): void;
    setTextMinWidth(width: string): void;
    setText(text: string): void;
    setInBankText(text: string): void;
    toggleCompact(): void;
    setQuantity(notification: NotificationData, type: NotificationType): void;
    setBorder(colour: string): void;
    setBottomPos(pos: number): void;
    setHorizontalPos(posType: NotificationHorizontalPositions): void;
    addPulse(): void;
    removePulse(): void;
}

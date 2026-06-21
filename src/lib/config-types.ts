export interface SiteConfig {
  locale: string;
  currency: string;
  price: string;
  checkoutUrl: string;
  firstButtonText: string;
  purchaseButtonText: string;
}

export const DEFAULT_CONFIG: SiteConfig = {
  locale: "es-ES",
  currency: "EUR",
  price: "€2,99",
  checkoutUrl: "https://folem.mycartpanda.com/checkout/211028517:1",
  firstButtonText: "CREAR MI CROMO",
  purchaseButtonText: "⚽ DESBLOQUEAR MI CROMO",
};

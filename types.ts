export interface Product {
  id: number;
  cins: string;
  gen: number;
  yuk: number;
  adet: number;
  m2: number;
  yamukFarki?: number;
  isBelowMinM2?: boolean;
  elips?: boolean;
  yuvarlakCap?: boolean;
  delikCapi?: string;
}

export interface SiparisInfo {
  siparisNo: string;
  tarih: string;
  adres: string;
  cariUnvan?: string;
  musteri?: string;
}

export interface BulkUpdatePayload {
    cins: string;
    elips: boolean;
    yuvarlakCap: boolean;
    delikCapi?: string;
}
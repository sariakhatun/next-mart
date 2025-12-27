// types/sslcommerz-lts.d.ts
declare module 'sslcommerz-lts' {
  export interface SSLCommerzInitData {
    total_amount: number;
    currency: string;
    tran_id: string;

    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url?: string;

    shipping_method: string;
    product_name: string;
    product_category: string;
    product_profile: string;

    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_city: string;
    cus_postcode: string;
    cus_country: string;
    cus_phone: string;

    num_of_item: number;
    multi_card_name?: string;

    value_a?: string;
    value_b?: string;
    value_c?: string;
  }

  export interface SSLCommerzResponse {
    status: 'SUCCESS' | 'FAILED';
    GatewayPageURL?: string;
    failedreason?: string;
    [key: string]: unknown;
  }

  export interface SSLCommerzValidationPayload {
    val_id: string;
  }

  export interface SSLCommerzValidationResponse {
    status: 'VALID' | 'VALIDATED' | 'FAILED';
    tran_id: string;
    amount: string;
    val_id: string;
    card_type?: string;
    [key: string]: unknown;
  }

  export default class SSLCommerzPayment {
    constructor(
      storeId: string,
      storePassword: string,
      isLive: boolean
    );

    init(data: SSLCommerzInitData): Promise<SSLCommerzResponse>;

    validate(
      payload: SSLCommerzValidationPayload
    ): Promise<SSLCommerzValidationResponse>;
  }
}

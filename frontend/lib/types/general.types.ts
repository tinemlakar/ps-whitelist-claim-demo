export interface ConfigInterface {
  APP_URL: string;
  API_BASE: string;
  CHAIN_ID: string;
}

export type AuthResponseProfile = {
  id: number;
  authUser: {
    id: number;
    status: number;
    username: string;
    email?: string;
    roles: any[];
    permissions: any[];
  };
};

export type AuthResponse = {
  profile: AuthResponseProfile;
  authToken: {
    status: boolean;
    data: string;
  };
};

declare global {
  type CsvItem = {
    signature?: string | null;
    status?: number | null;
    wallet: string;
  };

  /** Papa parser */
  type CsvFileData = {
    data: Array<CsvItem>;
    errors: Array<any>;
    meta: {
      aborted: boolean;
      cursor: number;
      delimeter: string;
      fields: Array<string>;
      linebreak: string;
      truncated: boolean;
    };
  };

  /** Response */
  type GeneralResponse<T> = {
    data: T;
    id: string;
    status: number;
  };
  type GeneralItemsResponse<T> = {
    data: {
      items: Array<T>;
      total: number;
    };
    id: string;
    status: number;
  };
  type SuccessResponse = GeneralResponse<{ success: boolean }>;

  interface UserInterface {
    createTime?: string;
    id?: number | null;
    signature: string | null;
    status?: number;
    updateTime?: string;
    wallet: string | null;
  }

  type UsersResponse = GeneralItemsResponse<UserInterface>;

  interface StatisticsInterface {
    generatedSignature: number;
    total: number;
  }

  type StatisticsResponse = GeneralResponse<StatisticsInterface>;

  interface ClaimInterface {
    createTime: string;
    id: number;
    signature: string;
    status: number;
    updateTime: string;
    wallet: string;
  }
  type ClaimResponse = GeneralResponse<ClaimInterface>;
}

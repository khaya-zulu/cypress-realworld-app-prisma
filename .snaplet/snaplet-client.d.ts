type ScalarField = {
  name: string;
  type: string;
};
type ObjectField = ScalarField & {
  relationFromFields: string[];
  relationToFields: string[];
};
type Inflection = {
  modelName?: (name: string) => string;
  scalarField?: (field: ScalarField) => string;
  parentField?: (field: ObjectField, oppositeBaseNameMap: Record<string, string>) => string;
  childField?: (field: ObjectField, oppositeField: ObjectField, oppositeBaseNameMap: Record<string, string>) => string;
  oppositeBaseNameMap?: Record<string, string>;
};
type Override = {
  BankAccount?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      userId?: string;
      bankName?: string;
      accountNumber?: string;
      routingNumber?: string;
      isDeleted?: string;
      createdAt?: string;
      modifiedAt?: string;
      User?: string;
    };
  }
  BankTransfer?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      userId?: string;
      source?: string;
      amount?: string;
      type?: string;
      transactionId?: string;
      createdAt?: string;
      modifiedAt?: string;
      Transaction?: string;
      User?: string;
    };
  }
  Comment?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      content?: string;
      userId?: string;
      transactionId?: string;
      createdAt?: string;
      modifiedAt?: string;
      Transaction?: string;
      User?: string;
    };
  }
  Contact?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      userId?: string;
      contactUserId?: string;
      createdAt?: string;
      modifiedAt?: string;
      User_Contact_contactUserIdToUser?: string;
      User_Contact_userIdToUser?: string;
    };
  }
  Like?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      userId?: string;
      transactionId?: string;
      createdAt?: string;
      modifiedAt?: string;
      Transaction?: string;
      User?: string;
      Notification?: string;
    };
  }
  Notification?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      userId?: string;
      likeId?: string;
      transactionId?: string;
      isRead?: string;
      createdAt?: string;
      modifiedAt?: string;
      Like?: string;
      Transaction?: string;
      User?: string;
    };
  }
  Transaction?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      source?: string;
      amount?: string;
      description?: string;
      privacyLevel?: string;
      receiverId?: string;
      senderId?: string;
      balanceAtCompletion?: string;
      status?: string;
      requestStatus?: string;
      requestResolvedAt?: string;
      createdAt?: string;
      modifiedAt?: string;
      User_Transaction_receiverIdToUser?: string;
      User_Transaction_senderIdToUser?: string;
      BankTransfer?: string;
      Comment?: string;
      Like?: string;
      Notification?: string;
    };
  }
  User?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      password?: string;
      email?: string;
      phoneNumber?: string;
      avatar?: string;
      balance?: string;
      defaultPrivacyLevel?: string;
      createdAt?: string;
      modifiedAt?: string;
      BankAccount?: string;
      BankTransfer?: string;
      Comment?: string;
      Contact_Contact_contactUserIdToUser?: string;
      Contact_Contact_userIdToUser?: string;
      Like?: string;
      Notification?: string;
      Transaction_Transaction_receiverIdToUser?: string;
      Transaction_Transaction_senderIdToUser?: string;
    };
  }
  _prisma_migrations?: {
    name?: string;
    fields?: {
      id?: string;
      checksum?: string;
      finished_at?: string;
      migration_name?: string;
      logs?: string;
      rolled_back_at?: string;
      started_at?: string;
      applied_steps_count?: string;
    };
  }}
export type Alias = {
  inflection?: Inflection | boolean;
  override?: Override;
};
interface FingerprintRelationField {
  count?: number | MinMaxOption;
}
interface FingerprintJsonField {
  schema?: any;
}
interface FingerprintDateField {
  options?: {
    minYear?: number;
    maxYear?: number;
  }
}
interface FingerprintNumberField {
  options?: {
    min?: number;
    max?: number;
  }
}
export interface Fingerprint {
  bankAccounts?: {
    createdAt?: FingerprintDateField;
    modifiedAt?: FingerprintDateField;
    user?: FingerprintRelationField;
  }
  bankTransfers?: {
    amount?: FingerprintNumberField;
    createdAt?: FingerprintDateField;
    modifiedAt?: FingerprintDateField;
    transaction?: FingerprintRelationField;
    user?: FingerprintRelationField;
  }
  comments?: {
    createdAt?: FingerprintDateField;
    modifiedAt?: FingerprintDateField;
    transaction?: FingerprintRelationField;
    user?: FingerprintRelationField;
  }
  contacts?: {
    createdAt?: FingerprintDateField;
    modifiedAt?: FingerprintDateField;
    contactUser?: FingerprintRelationField;
    user?: FingerprintRelationField;
  }
  likes?: {
    createdAt?: FingerprintDateField;
    modifiedAt?: FingerprintDateField;
    transaction?: FingerprintRelationField;
    user?: FingerprintRelationField;
    notifications?: FingerprintRelationField;
  }
  notifications?: {
    createdAt?: FingerprintDateField;
    modifiedAt?: FingerprintDateField;
    like?: FingerprintRelationField;
    transaction?: FingerprintRelationField;
    user?: FingerprintRelationField;
  }
  transactions?: {
    amount?: FingerprintNumberField;
    balanceAtCompletion?: FingerprintNumberField;
    requestResolvedAt?: FingerprintDateField;
    createdAt?: FingerprintDateField;
    modifiedAt?: FingerprintDateField;
    receiver?: FingerprintRelationField;
    sender?: FingerprintRelationField;
    bankTransfers?: FingerprintRelationField;
    comments?: FingerprintRelationField;
    likes?: FingerprintRelationField;
    notifications?: FingerprintRelationField;
  }
  users?: {
    balance?: FingerprintNumberField;
    createdAt?: FingerprintDateField;
    modifiedAt?: FingerprintDateField;
    bankAccounts?: FingerprintRelationField;
    bankTransfers?: FingerprintRelationField;
    comments?: FingerprintRelationField;
    contactsByContactUserId?: FingerprintRelationField;
    contacts?: FingerprintRelationField;
    likes?: FingerprintRelationField;
    notifications?: FingerprintRelationField;
    transactionsByReceiverId?: FingerprintRelationField;
    transactionsBySenderId?: FingerprintRelationField;
  }
  PrismaMigrations?: {
    finishedAt?: FingerprintDateField;
    rolledBackAt?: FingerprintDateField;
    startedAt?: FingerprintDateField;
    appliedStepsCount?: FingerprintNumberField;
  }}
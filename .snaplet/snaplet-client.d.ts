type JsonPrimitive = null | number | string | boolean;
type Nested<V> = V | { [s: string]: V | Nested<V> } | Array<V | Nested<V>>;
type Json = Nested<JsonPrimitive>;

type ColumnValueCallbackContext = {
  /**
   * The seed of the field's model.
   *
   * \@example
   * ```ts
   * "<hash>/0/users/0"
   * ```
   */
  modelSeed: string;
  /**
   * The seed of the field.
   *
   * \@example
   * ```ts
   * "<hash>/0/users/0/email"
   * ```
   */
  seed: string;
};

/**
 * helper type to get the possible values of a scalar field
 */
type ColumnValue<T> = T | ((ctx: ColumnValueCallbackContext) => T);

/**
 * helper type to map a record of scalars to a record of ColumnValue
 */
type MapToColumnValue<T> = { [K in keyof T]: ColumnValue<T[K]> };

/**
 * Create an array of `n` models.
 *
 * Can be read as "Generate `model` times `n`".
 *
 * @param `n` The number of models to generate.
 * @param `callbackFn` The `x` function calls the `callbackFn` function one time for each element in the array.
 *
 * @example Generate 10 users:
 * ```ts
 * snaplet.users((x) => x(10));
 * ```
 *
 * @example Generate 3 projects with a specific name:
 * ```ts
 * snaplet.projects((x) => x(3, (index) => ({ name: `Project ${index}` })));
 * ```
 */
declare function xCallbackFn<T>(
  n: number | MinMaxOption,
  callbackFn?: (index: number) => T
): Array<T>;

type ChildCallbackInputs<T> = (
  x: typeof xCallbackFn<T>,
) => Array<T>;

/**
 * all the possible types for a child field
 */
type ChildInputs<T> = Array<T> | ChildCallbackInputs<T>;

/**
 * omit some keys TKeys from a child field
 * @example we remove ExecTask from the Snapshot child field values as we're coming from ExecTask
 * type ExecTaskChildrenInputs<TPath extends string[]> = {
 *   Snapshot: OmitChildInputs<SnapshotChildInputs<[...TPath, "Snapshot"]>, "ExecTask">;
 * };
 */
type OmitChildInputs<T, TKeys extends string> = T extends ChildCallbackInputs<
  infer U
>
  ? ChildCallbackInputs<Omit<U, TKeys>>
  : T extends Array<infer U>
  ? Array<Omit<U, TKeys>>
  : never;

type ConnectCallbackContext<TGraph, TPath extends string[]> = {
  /**
   * The branch of the current iteration for the relationship field.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#branch | documentation}.
   */
  branch: GetBranch<TGraph, TPath>;
  /**
   * The plan's graph.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#graph | documentation}.
   */
  graph: TGraph;
  /**
   * The index of the current iteration.
   */
  index: number;
  /**
   * The seed of the relationship field.
   */
  seed: string;
  /**
   * The plan's store.
   */
  store: Store;
};

/**
 * the callback function we can pass to a parent field to connect it to another model
 * @example
 * snaplet.Post({ User: (ctx) => ({ id: ctx.store.User[0] }) })
 */
type ConnectCallback<T, TGraph, TPath extends string[]> = (
  ctx: ConnectCallbackContext<TGraph, TPath>
) => T;

/**
 * compute the Graph type and the tracked path to pass to the connect callback
 */
type ParentCallbackInputs<T, TPath extends string[]> = TPath extends [
  infer TRoot,
  ...infer TRest extends string[],
]
  ? TRoot extends keyof Graph
    ? MergeGraphParts<Graph[TRoot]> extends infer TGraph
      ? ConnectCallback<T, TGraph, TRest>
      : never
    : never
  : never;

type ParentInputs<T, TPath extends string[]> =
  | T
  | ParentCallbackInputs<T, TPath>;

/**
 * omit some keys TKeys from a parent field
 * @example we remove Member from the Organization and User parent fields values as we're coming from Member
 * type MemberParentsInputs<TPath extends string[]> = {
 *   Organization: OmitParentInputs<OrganizationParentInputs<[...TPath, "Organization"]>, "Member", [...TPath, "Organization"]>;
 *   User: OmitParentInputs<UserParentInputs<[...TPath, "User"]>, "Member", [...TPath, "User"]>;
 * };
 */
type OmitParentInputs<
  T,
  TKeys extends string,
  TPath extends string[],
> = T extends ConnectCallback<infer U, any, any>
  ? ParentCallbackInputs<Omit<U, TKeys>, TPath>
  : Omit<T, TKeys>;

/**
 * compute the inputs type for a given model
 */
type Inputs<TScalars, TParents, TChildren> = Partial<
  MapToColumnValue<TScalars> & TParents & TChildren
>;

type OmitChildGraph<
  T extends Array<unknown>,
  TKeys extends string,
> = T extends Array<
  infer TGraph extends { Scalars: any; Parents: any; Children: any }
>
  ? Array<{
      Scalars: TGraph["Scalars"];
      Parents: TGraph["Parents"];
      Children: Omit<TGraph["Children"], TKeys>;
    }>
  : never;

type OmitParentGraph<
  T extends Array<unknown>,
  TKeys extends string,
> = T extends Array<
  infer TGraph extends { Scalars: any; Parents: any; Children: any }
>
  ? Array<{
      Scalars: TGraph["Scalars"];
      Parents: Omit<TGraph["Parents"], TKeys>;
      Children: TGraph["Children"];
    }>
  : never;

type UnwrapArray<T> = T extends Array<infer U> ? U : T;

type DeepUnwrapKeys<TGraph, TKeys extends any[]> = TKeys extends [
  infer THead,
  ...infer TTail,
]
  ? TTail extends any[]
    ? {
        [P in keyof TGraph]: P extends THead
          ? DeepUnwrapKeys<UnwrapArray<TGraph[P]>, TTail>
          : TGraph[P];
      }
    : TGraph
  : TGraph;

type GetBranch<T, K extends any[]> = T extends Array<infer U>
  ? DeepUnwrapKeys<U, K>
  : T;

type MergeGraphParts<T> = T extends Array<
  infer U extends { Scalars: unknown; Parents: unknown; Children: unknown }
>
  ? Array<
      U["Scalars"] & {
        [K in keyof U["Children"]]: MergeGraphParts<U["Children"][K]>;
      } & {
        [K in keyof U["Parents"]]: MergeGraphParts<
          U["Parents"][K]
        > extends Array<infer TParent>
          ? TParent
          : never;
      }
    >
  : never;

/**
 * the configurable map of models' generate and connect functions
 */
export type UserModels = {
  [KStore in keyof Store]?: Store[KStore] extends Array<
    infer TFields extends Record<string, any>
  >
    ? {
        connect?: (ctx: { store: Store }) => TFields;
        data?: Partial<MapToColumnValue<TFields>>;
      }
    : never;
};

type PlanOptions = {
  /**
   * Connect the missing relationships to one of the corresponding models in the store.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-autoconnect-option | documentation}.
   */
  autoConnect?: boolean;
  /**
   * Provide custom data generation and connect functions for this plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-autoconnect-option | documentation}.
   */
  models?: UserModels;
  /**
   * Pass a custom store instance to use for this plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#augmenting-external-data-with-createstore | documentation}.
   */
  store?: StoreInstance;
  /**
   * Use a custom seed for this plan.
   */
  seed?: string;
};

/**
 * the plan is extending PromiseLike so it can be awaited
 * @example
 * await snaplet.User({ name: "John" });
 */
export interface Plan extends PromiseLike<any> {
  generate: (initialStore?: Store) => Promise<Store>;
  /**
   * Compose multiple plans together, injecting the store of the previous plan into the next plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-pipe | documentation}.
   */
  pipe: Pipe;
  /**
   * Compose multiple plans together, without injecting the store of the previous plan into the next plan.
   * All stores stay independent and are merged together once all the plans are generated.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-merge | documentation}.
   */
  merge: Merge;
}

type Pipe = (plans: Plan[], options?: { models?: UserModels, seed?: string }) => Plan;

type Merge = (plans: Plan[], options?: { models?: UserModels, seed?: string }) => Plan;

type StoreInstance<T extends Partial<Store> = {}> = {
  _store: T;
  toSQL: () => string[];
};

type CreateStore = <T extends Partial<Store>>(
  initialData?: T,
  options?: { external: boolean },
) => StoreInstance<T>;
type Store = {
  _http_response: Array<_http_responseScalars>;
  audit_log_entries: Array<audit_log_entriesScalars>;
  buckets: Array<bucketsScalars>;
  extensions: Array<extensionsScalars>;
  hooks: Array<hooksScalars>;
  http_request_queue: Array<http_request_queueScalars>;
  identities: Array<identitiesScalars>;
  instances: Array<instancesScalars>;
  key: Array<keyScalars>;
  mfa_amr_claims: Array<mfa_amr_claimsScalars>;
  mfa_challenges: Array<mfa_challengesScalars>;
  mfa_factors: Array<mfa_factorsScalars>;
  storage_migrations: Array<storage_migrationsScalars>;
  supabase_functions_migrations: Array<supabase_functions_migrationsScalars>;
  objects: Array<objectsScalars>;
  posts: Array<postsScalars>;
  refresh_tokens: Array<refresh_tokensScalars>;
  saml_providers: Array<saml_providersScalars>;
  saml_relay_states: Array<saml_relay_statesScalars>;
  _realtime_schema_migrations: Array<_realtime_schema_migrationsScalars>;
  auth_schema_migrations: Array<auth_schema_migrationsScalars>;
  sessions: Array<sessionsScalars>;
  sso_domains: Array<sso_domainsScalars>;
  sso_providers: Array<sso_providersScalars>;
  tenants: Array<tenantsScalars>;
  auth_users: Array<auth_usersScalars>;
  public_users: Array<public_usersScalars>;
};
type aal_levelEnum = "aal1" | "aal2" | "aal3";
type factor_statusEnum = "unverified" | "verified";
type factor_typeEnum = "totp" | "webauthn";
type request_statusEnum = "ERROR" | "PENDING" | "SUCCESS";
type key_statusEnum = "default" | "expired" | "invalid" | "valid";
type key_typeEnum = "aead-det" | "aead-ietf" | "auth" | "generichash" | "hmacsha256" | "hmacsha512" | "kdf" | "secretbox" | "secretstream" | "shorthash" | "stream_xchacha20";
type _http_responseScalars = {
  /**
   * Column `_http_response.id`.
   */
  id: number | null;
  /**
   * Column `_http_response.status_code`.
   */
  status_code: number | null;
  /**
   * Column `_http_response.content_type`.
   */
  content_type: string | null;
  /**
   * Column `_http_response.headers`.
   */
  headers: Json | null;
  /**
   * Column `_http_response.content`.
   */
  content: string | null;
  /**
   * Column `_http_response.timed_out`.
   */
  timed_out: boolean | null;
  /**
   * Column `_http_response.error_msg`.
   */
  error_msg: string | null;
  /**
   * Column `_http_response.created`.
   */
  created?: string;
}
type _http_responseParentsInputs<TPath extends string[]> = {

};
type _http_responseChildrenInputs<TPath extends string[]> = {

};
type _http_responseInputs<TPath extends string[]> = Inputs<
  _http_responseScalars,
  _http_responseParentsInputs<TPath>,
  _http_responseChildrenInputs<TPath>
>;
type _http_responseChildInputs<TPath extends string[]> = ChildInputs<_http_responseInputs<TPath>>;
type _http_responseParentInputs<TPath extends string[]> = ParentInputs<
_http_responseInputs<TPath>,
  TPath
>;
type audit_log_entriesScalars = {
  /**
   * Column `audit_log_entries.instance_id`.
   */
  instance_id: string | null;
  /**
   * Column `audit_log_entries.id`.
   */
  id: string;
  /**
   * Column `audit_log_entries.payload`.
   */
  payload: Json | null;
  /**
   * Column `audit_log_entries.created_at`.
   */
  created_at: string | null;
  /**
   * Column `audit_log_entries.ip_address`.
   */
  ip_address?: string;
}
type audit_log_entriesParentsInputs<TPath extends string[]> = {

};
type audit_log_entriesChildrenInputs<TPath extends string[]> = {

};
type audit_log_entriesInputs<TPath extends string[]> = Inputs<
  audit_log_entriesScalars,
  audit_log_entriesParentsInputs<TPath>,
  audit_log_entriesChildrenInputs<TPath>
>;
type audit_log_entriesChildInputs<TPath extends string[]> = ChildInputs<audit_log_entriesInputs<TPath>>;
type audit_log_entriesParentInputs<TPath extends string[]> = ParentInputs<
audit_log_entriesInputs<TPath>,
  TPath
>;
type bucketsScalars = {
  /**
   * Column `buckets.id`.
   */
  id: string;
  /**
   * Column `buckets.name`.
   */
  name: string;
  /**
   * Column `buckets.owner`.
   */
  owner: string | null;
  /**
   * Column `buckets.created_at`.
   */
  created_at: string | null;
  /**
   * Column `buckets.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `buckets.public`.
   */
  public: boolean | null;
  /**
   * Column `buckets.avif_autodetection`.
   */
  avif_autodetection: boolean | null;
  /**
   * Column `buckets.file_size_limit`.
   */
  file_size_limit: number | null;
  /**
   * Column `buckets.allowed_mime_types`.
   */
  allowed_mime_types: string[] | null;
}
type bucketsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `buckets` to table `users` through the column `buckets.owner`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "buckets", [...TPath, "auth_users"]>;
};
type bucketsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `buckets` to table `objects` through the column `objects.bucket_id`.
  */
  objects: OmitChildInputs<objectsChildInputs<[...TPath, "objects"]>, "buckets" | "bucket_id">;
};
type bucketsInputs<TPath extends string[]> = Inputs<
  bucketsScalars,
  bucketsParentsInputs<TPath>,
  bucketsChildrenInputs<TPath>
>;
type bucketsChildInputs<TPath extends string[]> = ChildInputs<bucketsInputs<TPath>>;
type bucketsParentInputs<TPath extends string[]> = ParentInputs<
bucketsInputs<TPath>,
  TPath
>;
type extensionsScalars = {
  /**
   * Column `extensions.id`.
   */
  id: string;
  /**
   * Column `extensions.type`.
   */
  type: string | null;
  /**
   * Column `extensions.settings`.
   */
  settings: Json | null;
  /**
   * Column `extensions.tenant_external_id`.
   */
  tenant_external_id: string | null;
  /**
   * Column `extensions.inserted_at`.
   */
  inserted_at: string;
  /**
   * Column `extensions.updated_at`.
   */
  updated_at: string;
}
type extensionsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `extensions` to table `tenants` through the column `extensions.tenant_external_id`.
   */
  tenants: OmitParentInputs<tenantsParentInputs<[...TPath, "tenants"]>, "extensions", [...TPath, "tenants"]>;
};
type extensionsChildrenInputs<TPath extends string[]> = {

};
type extensionsInputs<TPath extends string[]> = Inputs<
  extensionsScalars,
  extensionsParentsInputs<TPath>,
  extensionsChildrenInputs<TPath>
>;
type extensionsChildInputs<TPath extends string[]> = ChildInputs<extensionsInputs<TPath>>;
type extensionsParentInputs<TPath extends string[]> = ParentInputs<
extensionsInputs<TPath>,
  TPath
>;
type hooksScalars = {
  /**
   * Column `hooks.id`.
   */
  id?: number;
  /**
   * Column `hooks.hook_table_id`.
   */
  hook_table_id: number;
  /**
   * Column `hooks.hook_name`.
   */
  hook_name: string;
  /**
   * Column `hooks.created_at`.
   */
  created_at?: string;
  /**
   * Column `hooks.request_id`.
   */
  request_id: number | null;
}
type hooksParentsInputs<TPath extends string[]> = {

};
type hooksChildrenInputs<TPath extends string[]> = {

};
type hooksInputs<TPath extends string[]> = Inputs<
  hooksScalars,
  hooksParentsInputs<TPath>,
  hooksChildrenInputs<TPath>
>;
type hooksChildInputs<TPath extends string[]> = ChildInputs<hooksInputs<TPath>>;
type hooksParentInputs<TPath extends string[]> = ParentInputs<
hooksInputs<TPath>,
  TPath
>;
type http_request_queueScalars = {
  /**
   * Column `http_request_queue.id`.
   */
  id?: number;
  /**
   * Column `http_request_queue.method`.
   */
  method: string;
  /**
   * Column `http_request_queue.url`.
   */
  url: string;
  /**
   * Column `http_request_queue.headers`.
   */
  headers: Json;
  /**
   * Column `http_request_queue.body`.
   */
  body: string | null;
  /**
   * Column `http_request_queue.timeout_milliseconds`.
   */
  timeout_milliseconds: number;
}
type http_request_queueParentsInputs<TPath extends string[]> = {

};
type http_request_queueChildrenInputs<TPath extends string[]> = {

};
type http_request_queueInputs<TPath extends string[]> = Inputs<
  http_request_queueScalars,
  http_request_queueParentsInputs<TPath>,
  http_request_queueChildrenInputs<TPath>
>;
type http_request_queueChildInputs<TPath extends string[]> = ChildInputs<http_request_queueInputs<TPath>>;
type http_request_queueParentInputs<TPath extends string[]> = ParentInputs<
http_request_queueInputs<TPath>,
  TPath
>;
type identitiesScalars = {
  /**
   * Column `identities.id`.
   */
  id: string;
  /**
   * Column `identities.user_id`.
   */
  user_id: string;
  /**
   * Column `identities.identity_data`.
   */
  identity_data: Json;
  /**
   * Column `identities.provider`.
   */
  provider: string;
  /**
   * Column `identities.last_sign_in_at`.
   */
  last_sign_in_at: string | null;
  /**
   * Column `identities.created_at`.
   */
  created_at: string | null;
  /**
   * Column `identities.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `identities.email`.
   */
  email?: string | null;
}
type identitiesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `identities` to table `users` through the column `identities.user_id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "identities", [...TPath, "auth_users"]>;
};
type identitiesChildrenInputs<TPath extends string[]> = {

};
type identitiesInputs<TPath extends string[]> = Inputs<
  Omit<identitiesScalars, "email">,
  identitiesParentsInputs<TPath>,
  identitiesChildrenInputs<TPath>
>;
type identitiesChildInputs<TPath extends string[]> = ChildInputs<identitiesInputs<TPath>>;
type identitiesParentInputs<TPath extends string[]> = ParentInputs<
identitiesInputs<TPath>,
  TPath
>;
type instancesScalars = {
  /**
   * Column `instances.id`.
   */
  id: string;
  /**
   * Column `instances.uuid`.
   */
  uuid: string | null;
  /**
   * Column `instances.raw_base_config`.
   */
  raw_base_config: string | null;
  /**
   * Column `instances.created_at`.
   */
  created_at: string | null;
  /**
   * Column `instances.updated_at`.
   */
  updated_at: string | null;
}
type instancesParentsInputs<TPath extends string[]> = {

};
type instancesChildrenInputs<TPath extends string[]> = {

};
type instancesInputs<TPath extends string[]> = Inputs<
  instancesScalars,
  instancesParentsInputs<TPath>,
  instancesChildrenInputs<TPath>
>;
type instancesChildInputs<TPath extends string[]> = ChildInputs<instancesInputs<TPath>>;
type instancesParentInputs<TPath extends string[]> = ParentInputs<
instancesInputs<TPath>,
  TPath
>;
type keyScalars = {
  /**
   * Column `key.id`.
   */
  id?: string;
  /**
   * Column `key.status`.
   */
  status: key_statusEnum | null;
  /**
   * Column `key.created`.
   */
  created?: string;
  /**
   * Column `key.expires`.
   */
  expires: string | null;
  /**
   * Column `key.key_type`.
   */
  key_type: key_typeEnum | null;
  /**
   * Column `key.key_id`.
   */
  key_id: number | null;
  /**
   * Column `key.key_context`.
   */
  key_context: string | null;
  /**
   * Column `key.name`.
   */
  name: string | null;
  /**
   * Column `key.associated_data`.
   */
  associated_data: string | null;
  /**
   * Column `key.raw_key`.
   */
  raw_key: string | null;
  /**
   * Column `key.raw_key_nonce`.
   */
  raw_key_nonce: string | null;
  /**
   * Column `key.parent_key`.
   */
  parent_key: string | null;
  /**
   * Column `key.comment`.
   */
  comment: string | null;
  /**
   * Column `key.user_data`.
   */
  user_data: string | null;
}
type keyParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `key` to table `key` through the column `key.parent_key`.
   */
  key: OmitParentInputs<keyParentInputs<[...TPath, "key"]>, "key", [...TPath, "key"]>;
};
type keyChildrenInputs<TPath extends string[]> = {

};
type keyInputs<TPath extends string[]> = Inputs<
  keyScalars,
  keyParentsInputs<TPath>,
  keyChildrenInputs<TPath>
>;
type keyChildInputs<TPath extends string[]> = ChildInputs<keyInputs<TPath>>;
type keyParentInputs<TPath extends string[]> = ParentInputs<
keyInputs<TPath>,
  TPath
>;
type mfa_amr_claimsScalars = {
  /**
   * Column `mfa_amr_claims.session_id`.
   */
  session_id: string;
  /**
   * Column `mfa_amr_claims.created_at`.
   */
  created_at: string;
  /**
   * Column `mfa_amr_claims.updated_at`.
   */
  updated_at: string;
  /**
   * Column `mfa_amr_claims.authentication_method`.
   */
  authentication_method: string;
  /**
   * Column `mfa_amr_claims.id`.
   */
  id: string;
}
type mfa_amr_claimsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `mfa_amr_claims` to table `sessions` through the column `mfa_amr_claims.session_id`.
   */
  sessions: OmitParentInputs<sessionsParentInputs<[...TPath, "sessions"]>, "mfa_amr_claims", [...TPath, "sessions"]>;
};
type mfa_amr_claimsChildrenInputs<TPath extends string[]> = {

};
type mfa_amr_claimsInputs<TPath extends string[]> = Inputs<
  mfa_amr_claimsScalars,
  mfa_amr_claimsParentsInputs<TPath>,
  mfa_amr_claimsChildrenInputs<TPath>
>;
type mfa_amr_claimsChildInputs<TPath extends string[]> = ChildInputs<mfa_amr_claimsInputs<TPath>>;
type mfa_amr_claimsParentInputs<TPath extends string[]> = ParentInputs<
mfa_amr_claimsInputs<TPath>,
  TPath
>;
type mfa_challengesScalars = {
  /**
   * Column `mfa_challenges.id`.
   */
  id: string;
  /**
   * Column `mfa_challenges.factor_id`.
   */
  factor_id: string;
  /**
   * Column `mfa_challenges.created_at`.
   */
  created_at: string;
  /**
   * Column `mfa_challenges.verified_at`.
   */
  verified_at: string | null;
  /**
   * Column `mfa_challenges.ip_address`.
   */
  ip_address: string;
}
type mfa_challengesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `mfa_challenges` to table `mfa_factors` through the column `mfa_challenges.factor_id`.
   */
  mfa_factors: OmitParentInputs<mfa_factorsParentInputs<[...TPath, "mfa_factors"]>, "mfa_challenges", [...TPath, "mfa_factors"]>;
};
type mfa_challengesChildrenInputs<TPath extends string[]> = {

};
type mfa_challengesInputs<TPath extends string[]> = Inputs<
  mfa_challengesScalars,
  mfa_challengesParentsInputs<TPath>,
  mfa_challengesChildrenInputs<TPath>
>;
type mfa_challengesChildInputs<TPath extends string[]> = ChildInputs<mfa_challengesInputs<TPath>>;
type mfa_challengesParentInputs<TPath extends string[]> = ParentInputs<
mfa_challengesInputs<TPath>,
  TPath
>;
type mfa_factorsScalars = {
  /**
   * Column `mfa_factors.id`.
   */
  id: string;
  /**
   * Column `mfa_factors.user_id`.
   */
  user_id: string;
  /**
   * Column `mfa_factors.friendly_name`.
   */
  friendly_name: string | null;
  /**
   * Column `mfa_factors.factor_type`.
   */
  factor_type: factor_typeEnum;
  /**
   * Column `mfa_factors.status`.
   */
  status: factor_statusEnum;
  /**
   * Column `mfa_factors.created_at`.
   */
  created_at: string;
  /**
   * Column `mfa_factors.updated_at`.
   */
  updated_at: string;
  /**
   * Column `mfa_factors.secret`.
   */
  secret: string | null;
}
type mfa_factorsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `mfa_factors` to table `users` through the column `mfa_factors.user_id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "mfa_factors", [...TPath, "auth_users"]>;
};
type mfa_factorsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `mfa_factors` to table `mfa_challenges` through the column `mfa_challenges.factor_id`.
  */
  mfa_challenges: OmitChildInputs<mfa_challengesChildInputs<[...TPath, "mfa_challenges"]>, "mfa_factors" | "factor_id">;
};
type mfa_factorsInputs<TPath extends string[]> = Inputs<
  mfa_factorsScalars,
  mfa_factorsParentsInputs<TPath>,
  mfa_factorsChildrenInputs<TPath>
>;
type mfa_factorsChildInputs<TPath extends string[]> = ChildInputs<mfa_factorsInputs<TPath>>;
type mfa_factorsParentInputs<TPath extends string[]> = ParentInputs<
mfa_factorsInputs<TPath>,
  TPath
>;
type storage_migrationsScalars = {
  /**
   * Column `migrations.id`.
   */
  id: number;
  /**
   * Column `migrations.name`.
   */
  name: string;
  /**
   * Column `migrations.hash`.
   */
  hash: string;
  /**
   * Column `migrations.executed_at`.
   */
  executed_at: string | null;
}
type storage_migrationsParentsInputs<TPath extends string[]> = {

};
type storage_migrationsChildrenInputs<TPath extends string[]> = {

};
type storage_migrationsInputs<TPath extends string[]> = Inputs<
  storage_migrationsScalars,
  storage_migrationsParentsInputs<TPath>,
  storage_migrationsChildrenInputs<TPath>
>;
type storage_migrationsChildInputs<TPath extends string[]> = ChildInputs<storage_migrationsInputs<TPath>>;
type storage_migrationsParentInputs<TPath extends string[]> = ParentInputs<
storage_migrationsInputs<TPath>,
  TPath
>;
type supabase_functions_migrationsScalars = {
  /**
   * Column `migrations.version`.
   */
  version: string;
  /**
   * Column `migrations.inserted_at`.
   */
  inserted_at?: string;
}
type supabase_functions_migrationsParentsInputs<TPath extends string[]> = {

};
type supabase_functions_migrationsChildrenInputs<TPath extends string[]> = {

};
type supabase_functions_migrationsInputs<TPath extends string[]> = Inputs<
  supabase_functions_migrationsScalars,
  supabase_functions_migrationsParentsInputs<TPath>,
  supabase_functions_migrationsChildrenInputs<TPath>
>;
type supabase_functions_migrationsChildInputs<TPath extends string[]> = ChildInputs<supabase_functions_migrationsInputs<TPath>>;
type supabase_functions_migrationsParentInputs<TPath extends string[]> = ParentInputs<
supabase_functions_migrationsInputs<TPath>,
  TPath
>;
type objectsScalars = {
  /**
   * Column `objects.id`.
   */
  id?: string;
  /**
   * Column `objects.bucket_id`.
   */
  bucket_id: string | null;
  /**
   * Column `objects.name`.
   */
  name: string | null;
  /**
   * Column `objects.owner`.
   */
  owner: string | null;
  /**
   * Column `objects.created_at`.
   */
  created_at: string | null;
  /**
   * Column `objects.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `objects.last_accessed_at`.
   */
  last_accessed_at: string | null;
  /**
   * Column `objects.metadata`.
   */
  metadata: Json | null;
  /**
   * Column `objects.path_tokens`.
   */
  path_tokens?: string[] | null;
}
type objectsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `objects` to table `users` through the column `objects.owner`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "objects", [...TPath, "auth_users"]>;
  /**
   * Relationship from table `objects` to table `buckets` through the column `objects.bucket_id`.
   */
  buckets: OmitParentInputs<bucketsParentInputs<[...TPath, "buckets"]>, "objects", [...TPath, "buckets"]>;
};
type objectsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `objects` to table `posts` through the column `posts.image`.
  */
  posts: OmitChildInputs<postsChildInputs<[...TPath, "posts"]>, "objects" | "image">;
};
type objectsInputs<TPath extends string[]> = Inputs<
  Omit<objectsScalars, "path_tokens">,
  objectsParentsInputs<TPath>,
  objectsChildrenInputs<TPath>
>;
type objectsChildInputs<TPath extends string[]> = ChildInputs<objectsInputs<TPath>>;
type objectsParentInputs<TPath extends string[]> = ParentInputs<
objectsInputs<TPath>,
  TPath
>;
type postsScalars = {
  /**
   * Column `posts.id`.
   */
  id: string;
  /**
   * Column `posts.title`.
   */
  title: string;
  /**
   * Column `posts.body`.
   */
  body: string;
  /**
   * Column `posts.user_id`.
   */
  user_id: string;
  /**
   * Column `posts.image`.
   */
  image: string | null;
  /**
   * Column `posts.created_at`.
   */
  created_at: string | null;
  /**
   * Column `posts.updated_at`.
   */
  updated_at: string | null;
}
type postsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `posts` to table `users` through the column `posts.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "posts", [...TPath, "public_users"]>;
  /**
   * Relationship from table `posts` to table `objects` through the column `posts.image`.
   */
  objects: OmitParentInputs<objectsParentInputs<[...TPath, "objects"]>, "posts", [...TPath, "objects"]>;
};
type postsChildrenInputs<TPath extends string[]> = {

};
type postsInputs<TPath extends string[]> = Inputs<
  postsScalars,
  postsParentsInputs<TPath>,
  postsChildrenInputs<TPath>
>;
type postsChildInputs<TPath extends string[]> = ChildInputs<postsInputs<TPath>>;
type postsParentInputs<TPath extends string[]> = ParentInputs<
postsInputs<TPath>,
  TPath
>;
type refresh_tokensScalars = {
  /**
   * Column `refresh_tokens.instance_id`.
   */
  instance_id: string | null;
  /**
   * Column `refresh_tokens.id`.
   */
  id?: number;
  /**
   * Column `refresh_tokens.token`.
   */
  token: string | null;
  /**
   * Column `refresh_tokens.user_id`.
   */
  user_id: string | null;
  /**
   * Column `refresh_tokens.revoked`.
   */
  revoked: boolean | null;
  /**
   * Column `refresh_tokens.created_at`.
   */
  created_at: string | null;
  /**
   * Column `refresh_tokens.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `refresh_tokens.parent`.
   */
  parent: string | null;
  /**
   * Column `refresh_tokens.session_id`.
   */
  session_id: string | null;
}
type refresh_tokensParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `refresh_tokens` to table `sessions` through the column `refresh_tokens.session_id`.
   */
  sessions: OmitParentInputs<sessionsParentInputs<[...TPath, "sessions"]>, "refresh_tokens", [...TPath, "sessions"]>;
};
type refresh_tokensChildrenInputs<TPath extends string[]> = {

};
type refresh_tokensInputs<TPath extends string[]> = Inputs<
  refresh_tokensScalars,
  refresh_tokensParentsInputs<TPath>,
  refresh_tokensChildrenInputs<TPath>
>;
type refresh_tokensChildInputs<TPath extends string[]> = ChildInputs<refresh_tokensInputs<TPath>>;
type refresh_tokensParentInputs<TPath extends string[]> = ParentInputs<
refresh_tokensInputs<TPath>,
  TPath
>;
type saml_providersScalars = {
  /**
   * Column `saml_providers.id`.
   */
  id: string;
  /**
   * Column `saml_providers.sso_provider_id`.
   */
  sso_provider_id: string;
  /**
   * Column `saml_providers.entity_id`.
   */
  entity_id: string;
  /**
   * Column `saml_providers.metadata_xml`.
   */
  metadata_xml: string;
  /**
   * Column `saml_providers.metadata_url`.
   */
  metadata_url: string | null;
  /**
   * Column `saml_providers.attribute_mapping`.
   */
  attribute_mapping: Json | null;
  /**
   * Column `saml_providers.created_at`.
   */
  created_at: string | null;
  /**
   * Column `saml_providers.updated_at`.
   */
  updated_at: string | null;
}
type saml_providersParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `saml_providers` to table `sso_providers` through the column `saml_providers.sso_provider_id`.
   */
  sso_providers: OmitParentInputs<sso_providersParentInputs<[...TPath, "sso_providers"]>, "saml_providers", [...TPath, "sso_providers"]>;
};
type saml_providersChildrenInputs<TPath extends string[]> = {

};
type saml_providersInputs<TPath extends string[]> = Inputs<
  saml_providersScalars,
  saml_providersParentsInputs<TPath>,
  saml_providersChildrenInputs<TPath>
>;
type saml_providersChildInputs<TPath extends string[]> = ChildInputs<saml_providersInputs<TPath>>;
type saml_providersParentInputs<TPath extends string[]> = ParentInputs<
saml_providersInputs<TPath>,
  TPath
>;
type saml_relay_statesScalars = {
  /**
   * Column `saml_relay_states.id`.
   */
  id: string;
  /**
   * Column `saml_relay_states.sso_provider_id`.
   */
  sso_provider_id: string;
  /**
   * Column `saml_relay_states.request_id`.
   */
  request_id: string;
  /**
   * Column `saml_relay_states.for_email`.
   */
  for_email: string | null;
  /**
   * Column `saml_relay_states.redirect_to`.
   */
  redirect_to: string | null;
  /**
   * Column `saml_relay_states.from_ip_address`.
   */
  from_ip_address: string | null;
  /**
   * Column `saml_relay_states.created_at`.
   */
  created_at: string | null;
  /**
   * Column `saml_relay_states.updated_at`.
   */
  updated_at: string | null;
}
type saml_relay_statesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `saml_relay_states` to table `sso_providers` through the column `saml_relay_states.sso_provider_id`.
   */
  sso_providers: OmitParentInputs<sso_providersParentInputs<[...TPath, "sso_providers"]>, "saml_relay_states", [...TPath, "sso_providers"]>;
};
type saml_relay_statesChildrenInputs<TPath extends string[]> = {

};
type saml_relay_statesInputs<TPath extends string[]> = Inputs<
  saml_relay_statesScalars,
  saml_relay_statesParentsInputs<TPath>,
  saml_relay_statesChildrenInputs<TPath>
>;
type saml_relay_statesChildInputs<TPath extends string[]> = ChildInputs<saml_relay_statesInputs<TPath>>;
type saml_relay_statesParentInputs<TPath extends string[]> = ParentInputs<
saml_relay_statesInputs<TPath>,
  TPath
>;
type _realtime_schema_migrationsScalars = {
  /**
   * Column `schema_migrations.version`.
   */
  version: number;
  /**
   * Column `schema_migrations.inserted_at`.
   */
  inserted_at: string | null;
}
type _realtime_schema_migrationsParentsInputs<TPath extends string[]> = {

};
type _realtime_schema_migrationsChildrenInputs<TPath extends string[]> = {

};
type _realtime_schema_migrationsInputs<TPath extends string[]> = Inputs<
  _realtime_schema_migrationsScalars,
  _realtime_schema_migrationsParentsInputs<TPath>,
  _realtime_schema_migrationsChildrenInputs<TPath>
>;
type _realtime_schema_migrationsChildInputs<TPath extends string[]> = ChildInputs<_realtime_schema_migrationsInputs<TPath>>;
type _realtime_schema_migrationsParentInputs<TPath extends string[]> = ParentInputs<
_realtime_schema_migrationsInputs<TPath>,
  TPath
>;
type auth_schema_migrationsScalars = {
  /**
   * Column `schema_migrations.version`.
   */
  version: string;
}
type auth_schema_migrationsParentsInputs<TPath extends string[]> = {

};
type auth_schema_migrationsChildrenInputs<TPath extends string[]> = {

};
type auth_schema_migrationsInputs<TPath extends string[]> = Inputs<
  auth_schema_migrationsScalars,
  auth_schema_migrationsParentsInputs<TPath>,
  auth_schema_migrationsChildrenInputs<TPath>
>;
type auth_schema_migrationsChildInputs<TPath extends string[]> = ChildInputs<auth_schema_migrationsInputs<TPath>>;
type auth_schema_migrationsParentInputs<TPath extends string[]> = ParentInputs<
auth_schema_migrationsInputs<TPath>,
  TPath
>;
type sessionsScalars = {
  /**
   * Column `sessions.id`.
   */
  id: string;
  /**
   * Column `sessions.user_id`.
   */
  user_id: string;
  /**
   * Column `sessions.created_at`.
   */
  created_at: string | null;
  /**
   * Column `sessions.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `sessions.factor_id`.
   */
  factor_id: string | null;
  /**
   * Column `sessions.aal`.
   */
  aal: aal_levelEnum | null;
  /**
   * Column `sessions.not_after`.
   */
  not_after: string | null;
}
type sessionsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `sessions` to table `users` through the column `sessions.user_id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "sessions", [...TPath, "auth_users"]>;
};
type sessionsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `sessions` to table `mfa_amr_claims` through the column `mfa_amr_claims.session_id`.
  */
  mfa_amr_claims: OmitChildInputs<mfa_amr_claimsChildInputs<[...TPath, "mfa_amr_claims"]>, "sessions" | "session_id">;
  /**
  * Relationship from table `sessions` to table `refresh_tokens` through the column `refresh_tokens.session_id`.
  */
  refresh_tokens: OmitChildInputs<refresh_tokensChildInputs<[...TPath, "refresh_tokens"]>, "sessions" | "session_id">;
};
type sessionsInputs<TPath extends string[]> = Inputs<
  sessionsScalars,
  sessionsParentsInputs<TPath>,
  sessionsChildrenInputs<TPath>
>;
type sessionsChildInputs<TPath extends string[]> = ChildInputs<sessionsInputs<TPath>>;
type sessionsParentInputs<TPath extends string[]> = ParentInputs<
sessionsInputs<TPath>,
  TPath
>;
type sso_domainsScalars = {
  /**
   * Column `sso_domains.id`.
   */
  id: string;
  /**
   * Column `sso_domains.sso_provider_id`.
   */
  sso_provider_id: string;
  /**
   * Column `sso_domains.domain`.
   */
  domain: string;
  /**
   * Column `sso_domains.created_at`.
   */
  created_at: string | null;
  /**
   * Column `sso_domains.updated_at`.
   */
  updated_at: string | null;
}
type sso_domainsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `sso_domains` to table `sso_providers` through the column `sso_domains.sso_provider_id`.
   */
  sso_providers: OmitParentInputs<sso_providersParentInputs<[...TPath, "sso_providers"]>, "sso_domains", [...TPath, "sso_providers"]>;
};
type sso_domainsChildrenInputs<TPath extends string[]> = {

};
type sso_domainsInputs<TPath extends string[]> = Inputs<
  sso_domainsScalars,
  sso_domainsParentsInputs<TPath>,
  sso_domainsChildrenInputs<TPath>
>;
type sso_domainsChildInputs<TPath extends string[]> = ChildInputs<sso_domainsInputs<TPath>>;
type sso_domainsParentInputs<TPath extends string[]> = ParentInputs<
sso_domainsInputs<TPath>,
  TPath
>;
type sso_providersScalars = {
  /**
   * Column `sso_providers.id`.
   */
  id: string;
  /**
   * Column `sso_providers.resource_id`.
   */
  resource_id: string | null;
  /**
   * Column `sso_providers.created_at`.
   */
  created_at: string | null;
  /**
   * Column `sso_providers.updated_at`.
   */
  updated_at: string | null;
}
type sso_providersParentsInputs<TPath extends string[]> = {

};
type sso_providersChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `sso_providers` to table `saml_providers` through the column `saml_providers.sso_provider_id`.
  */
  saml_providers: OmitChildInputs<saml_providersChildInputs<[...TPath, "saml_providers"]>, "sso_providers" | "sso_provider_id">;
  /**
  * Relationship from table `sso_providers` to table `saml_relay_states` through the column `saml_relay_states.sso_provider_id`.
  */
  saml_relay_states: OmitChildInputs<saml_relay_statesChildInputs<[...TPath, "saml_relay_states"]>, "sso_providers" | "sso_provider_id">;
  /**
  * Relationship from table `sso_providers` to table `sso_domains` through the column `sso_domains.sso_provider_id`.
  */
  sso_domains: OmitChildInputs<sso_domainsChildInputs<[...TPath, "sso_domains"]>, "sso_providers" | "sso_provider_id">;
};
type sso_providersInputs<TPath extends string[]> = Inputs<
  sso_providersScalars,
  sso_providersParentsInputs<TPath>,
  sso_providersChildrenInputs<TPath>
>;
type sso_providersChildInputs<TPath extends string[]> = ChildInputs<sso_providersInputs<TPath>>;
type sso_providersParentInputs<TPath extends string[]> = ParentInputs<
sso_providersInputs<TPath>,
  TPath
>;
type tenantsScalars = {
  /**
   * Column `tenants.id`.
   */
  id: string;
  /**
   * Column `tenants.name`.
   */
  name: string | null;
  /**
   * Column `tenants.external_id`.
   */
  external_id: string | null;
  /**
   * Column `tenants.jwt_secret`.
   */
  jwt_secret: string | null;
  /**
   * Column `tenants.max_concurrent_users`.
   */
  max_concurrent_users?: number;
  /**
   * Column `tenants.inserted_at`.
   */
  inserted_at: string;
  /**
   * Column `tenants.updated_at`.
   */
  updated_at: string;
  /**
   * Column `tenants.max_events_per_second`.
   */
  max_events_per_second?: number;
  /**
   * Column `tenants.postgres_cdc_default`.
   */
  postgres_cdc_default: string | null;
  /**
   * Column `tenants.max_bytes_per_second`.
   */
  max_bytes_per_second?: number;
  /**
   * Column `tenants.max_channels_per_client`.
   */
  max_channels_per_client?: number;
  /**
   * Column `tenants.max_joins_per_second`.
   */
  max_joins_per_second?: number;
}
type tenantsParentsInputs<TPath extends string[]> = {

};
type tenantsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `tenants` to table `extensions` through the column `extensions.tenant_external_id`.
  */
  extensions: OmitChildInputs<extensionsChildInputs<[...TPath, "extensions"]>, "tenants" | "tenant_external_id">;
};
type tenantsInputs<TPath extends string[]> = Inputs<
  tenantsScalars,
  tenantsParentsInputs<TPath>,
  tenantsChildrenInputs<TPath>
>;
type tenantsChildInputs<TPath extends string[]> = ChildInputs<tenantsInputs<TPath>>;
type tenantsParentInputs<TPath extends string[]> = ParentInputs<
tenantsInputs<TPath>,
  TPath
>;
type auth_usersScalars = {
  /**
   * Column `users.instance_id`.
   */
  instance_id: string | null;
  /**
   * Column `users.id`.
   */
  id: string;
  /**
   * Column `users.aud`.
   */
  aud: string | null;
  /**
   * Column `users.role`.
   */
  role: string | null;
  /**
   * Column `users.email`.
   */
  email: string | null;
  /**
   * Column `users.encrypted_password`.
   */
  encrypted_password: string | null;
  /**
   * Column `users.email_confirmed_at`.
   */
  email_confirmed_at: string | null;
  /**
   * Column `users.invited_at`.
   */
  invited_at: string | null;
  /**
   * Column `users.confirmation_token`.
   */
  confirmation_token: string | null;
  /**
   * Column `users.confirmation_sent_at`.
   */
  confirmation_sent_at: string | null;
  /**
   * Column `users.recovery_token`.
   */
  recovery_token: string | null;
  /**
   * Column `users.recovery_sent_at`.
   */
  recovery_sent_at: string | null;
  /**
   * Column `users.email_change_token_new`.
   */
  email_change_token_new: string | null;
  /**
   * Column `users.email_change`.
   */
  email_change: string | null;
  /**
   * Column `users.email_change_sent_at`.
   */
  email_change_sent_at: string | null;
  /**
   * Column `users.last_sign_in_at`.
   */
  last_sign_in_at: string | null;
  /**
   * Column `users.raw_app_meta_data`.
   */
  raw_app_meta_data: Json | null;
  /**
   * Column `users.raw_user_meta_data`.
   */
  raw_user_meta_data: Json | null;
  /**
   * Column `users.is_super_admin`.
   */
  is_super_admin: boolean | null;
  /**
   * Column `users.created_at`.
   */
  created_at: string | null;
  /**
   * Column `users.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `users.phone`.
   */
  phone: string | null;
  /**
   * Column `users.phone_confirmed_at`.
   */
  phone_confirmed_at: string | null;
  /**
   * Column `users.phone_change`.
   */
  phone_change: string | null;
  /**
   * Column `users.phone_change_token`.
   */
  phone_change_token: string | null;
  /**
   * Column `users.phone_change_sent_at`.
   */
  phone_change_sent_at: string | null;
  /**
   * Column `users.confirmed_at`.
   */
  confirmed_at?: string | null;
  /**
   * Column `users.email_change_token_current`.
   */
  email_change_token_current: string | null;
  /**
   * Column `users.email_change_confirm_status`.
   */
  email_change_confirm_status: number | null;
  /**
   * Column `users.banned_until`.
   */
  banned_until: string | null;
  /**
   * Column `users.reauthentication_token`.
   */
  reauthentication_token: string | null;
  /**
   * Column `users.reauthentication_sent_at`.
   */
  reauthentication_sent_at: string | null;
  /**
   * Column `users.is_sso_user`.
   */
  is_sso_user?: boolean;
  /**
   * Column `users.deleted_at`.
   */
  deleted_at: string | null;
}
type auth_usersParentsInputs<TPath extends string[]> = {

};
type auth_usersChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `users` to table `identities` through the column `identities.user_id`.
  */
  identities: OmitChildInputs<identitiesChildInputs<[...TPath, "identities"]>, "auth_users" | "user_id">;
  /**
  * Relationship from table `users` to table `mfa_factors` through the column `mfa_factors.user_id`.
  */
  mfa_factors: OmitChildInputs<mfa_factorsChildInputs<[...TPath, "mfa_factors"]>, "auth_users" | "user_id">;
  /**
  * Relationship from table `users` to table `sessions` through the column `sessions.user_id`.
  */
  sessions: OmitChildInputs<sessionsChildInputs<[...TPath, "sessions"]>, "auth_users" | "user_id">;
  /**
  * Relationship from table `users` to table `users` through the column `users.id`.
  */
  public_users: OmitChildInputs<public_usersChildInputs<[...TPath, "public_users"]>, "auth_users" | "id">;
  /**
  * Relationship from table `users` to table `buckets` through the column `buckets.owner`.
  */
  buckets: OmitChildInputs<bucketsChildInputs<[...TPath, "buckets"]>, "auth_users" | "owner">;
  /**
  * Relationship from table `users` to table `objects` through the column `objects.owner`.
  */
  objects: OmitChildInputs<objectsChildInputs<[...TPath, "objects"]>, "auth_users" | "owner">;
};
type auth_usersInputs<TPath extends string[]> = Inputs<
  Omit<auth_usersScalars, "confirmed_at">,
  auth_usersParentsInputs<TPath>,
  auth_usersChildrenInputs<TPath>
>;
type auth_usersChildInputs<TPath extends string[]> = ChildInputs<auth_usersInputs<TPath>>;
type auth_usersParentInputs<TPath extends string[]> = ParentInputs<
auth_usersInputs<TPath>,
  TPath
>;
type public_usersScalars = {
  /**
   * Column `users.id`.
   */
  id: string;
  /**
   * Column `users.email`.
   */
  email: string;
  /**
   * Column `users.name`.
   */
  name: string;
  /**
   * Column `users.created_at`.
   */
  created_at: string | null;
  /**
   * Column `users.updated_at`.
   */
  updated_at: string | null;
}
type public_usersParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `users` to table `users` through the column `users.id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "public_users", [...TPath, "auth_users"]>;
};
type public_usersChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `users` to table `posts` through the column `posts.user_id`.
  */
  posts: OmitChildInputs<postsChildInputs<[...TPath, "posts"]>, "public_users" | "user_id">;
};
type public_usersInputs<TPath extends string[]> = Inputs<
  public_usersScalars,
  public_usersParentsInputs<TPath>,
  public_usersChildrenInputs<TPath>
>;
type public_usersChildInputs<TPath extends string[]> = ChildInputs<public_usersInputs<TPath>>;
type public_usersParentInputs<TPath extends string[]> = ParentInputs<
public_usersInputs<TPath>,
  TPath
>;
type _http_responseParentsGraph = {

};
type _http_responseChildrenGraph = {

};
type _http_responseGraph = Array<{
  Scalars: _http_responseScalars;
  Parents: _http_responseParentsGraph;
  Children: _http_responseChildrenGraph;
}>;
type audit_log_entriesParentsGraph = {

};
type audit_log_entriesChildrenGraph = {

};
type audit_log_entriesGraph = Array<{
  Scalars: audit_log_entriesScalars;
  Parents: audit_log_entriesParentsGraph;
  Children: audit_log_entriesChildrenGraph;
}>;
type bucketsParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "buckets">;
};
type bucketsChildrenGraph = {
 objects: OmitParentGraph<objectsGraph, "buckets">;
};
type bucketsGraph = Array<{
  Scalars: bucketsScalars;
  Parents: bucketsParentsGraph;
  Children: bucketsChildrenGraph;
}>;
type extensionsParentsGraph = {
 tenants: OmitChildGraph<tenantsGraph, "extensions">;
};
type extensionsChildrenGraph = {

};
type extensionsGraph = Array<{
  Scalars: extensionsScalars;
  Parents: extensionsParentsGraph;
  Children: extensionsChildrenGraph;
}>;
type hooksParentsGraph = {

};
type hooksChildrenGraph = {

};
type hooksGraph = Array<{
  Scalars: hooksScalars;
  Parents: hooksParentsGraph;
  Children: hooksChildrenGraph;
}>;
type http_request_queueParentsGraph = {

};
type http_request_queueChildrenGraph = {

};
type http_request_queueGraph = Array<{
  Scalars: http_request_queueScalars;
  Parents: http_request_queueParentsGraph;
  Children: http_request_queueChildrenGraph;
}>;
type identitiesParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "identities">;
};
type identitiesChildrenGraph = {

};
type identitiesGraph = Array<{
  Scalars: identitiesScalars;
  Parents: identitiesParentsGraph;
  Children: identitiesChildrenGraph;
}>;
type instancesParentsGraph = {

};
type instancesChildrenGraph = {

};
type instancesGraph = Array<{
  Scalars: instancesScalars;
  Parents: instancesParentsGraph;
  Children: instancesChildrenGraph;
}>;
type keyParentsGraph = {
 key: OmitChildGraph<keyGraph, "key">;
};
type keyChildrenGraph = {

};
type keyGraph = Array<{
  Scalars: keyScalars;
  Parents: keyParentsGraph;
  Children: keyChildrenGraph;
}>;
type mfa_amr_claimsParentsGraph = {
 sessions: OmitChildGraph<sessionsGraph, "mfa_amr_claims">;
};
type mfa_amr_claimsChildrenGraph = {

};
type mfa_amr_claimsGraph = Array<{
  Scalars: mfa_amr_claimsScalars;
  Parents: mfa_amr_claimsParentsGraph;
  Children: mfa_amr_claimsChildrenGraph;
}>;
type mfa_challengesParentsGraph = {
 mfa_factors: OmitChildGraph<mfa_factorsGraph, "mfa_challenges">;
};
type mfa_challengesChildrenGraph = {

};
type mfa_challengesGraph = Array<{
  Scalars: mfa_challengesScalars;
  Parents: mfa_challengesParentsGraph;
  Children: mfa_challengesChildrenGraph;
}>;
type mfa_factorsParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "mfa_factors">;
};
type mfa_factorsChildrenGraph = {
 mfa_challenges: OmitParentGraph<mfa_challengesGraph, "mfa_factors">;
};
type mfa_factorsGraph = Array<{
  Scalars: mfa_factorsScalars;
  Parents: mfa_factorsParentsGraph;
  Children: mfa_factorsChildrenGraph;
}>;
type storage_migrationsParentsGraph = {

};
type storage_migrationsChildrenGraph = {

};
type storage_migrationsGraph = Array<{
  Scalars: storage_migrationsScalars;
  Parents: storage_migrationsParentsGraph;
  Children: storage_migrationsChildrenGraph;
}>;
type supabase_functions_migrationsParentsGraph = {

};
type supabase_functions_migrationsChildrenGraph = {

};
type supabase_functions_migrationsGraph = Array<{
  Scalars: supabase_functions_migrationsScalars;
  Parents: supabase_functions_migrationsParentsGraph;
  Children: supabase_functions_migrationsChildrenGraph;
}>;
type objectsParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "objects">;
 buckets: OmitChildGraph<bucketsGraph, "objects">;
};
type objectsChildrenGraph = {
 posts: OmitParentGraph<postsGraph, "objects">;
};
type objectsGraph = Array<{
  Scalars: objectsScalars;
  Parents: objectsParentsGraph;
  Children: objectsChildrenGraph;
}>;
type postsParentsGraph = {
 public_users: OmitChildGraph<public_usersGraph, "posts">;
 objects: OmitChildGraph<objectsGraph, "posts">;
};
type postsChildrenGraph = {

};
type postsGraph = Array<{
  Scalars: postsScalars;
  Parents: postsParentsGraph;
  Children: postsChildrenGraph;
}>;
type refresh_tokensParentsGraph = {
 sessions: OmitChildGraph<sessionsGraph, "refresh_tokens">;
};
type refresh_tokensChildrenGraph = {

};
type refresh_tokensGraph = Array<{
  Scalars: refresh_tokensScalars;
  Parents: refresh_tokensParentsGraph;
  Children: refresh_tokensChildrenGraph;
}>;
type saml_providersParentsGraph = {
 sso_providers: OmitChildGraph<sso_providersGraph, "saml_providers">;
};
type saml_providersChildrenGraph = {

};
type saml_providersGraph = Array<{
  Scalars: saml_providersScalars;
  Parents: saml_providersParentsGraph;
  Children: saml_providersChildrenGraph;
}>;
type saml_relay_statesParentsGraph = {
 sso_providers: OmitChildGraph<sso_providersGraph, "saml_relay_states">;
};
type saml_relay_statesChildrenGraph = {

};
type saml_relay_statesGraph = Array<{
  Scalars: saml_relay_statesScalars;
  Parents: saml_relay_statesParentsGraph;
  Children: saml_relay_statesChildrenGraph;
}>;
type _realtime_schema_migrationsParentsGraph = {

};
type _realtime_schema_migrationsChildrenGraph = {

};
type _realtime_schema_migrationsGraph = Array<{
  Scalars: _realtime_schema_migrationsScalars;
  Parents: _realtime_schema_migrationsParentsGraph;
  Children: _realtime_schema_migrationsChildrenGraph;
}>;
type auth_schema_migrationsParentsGraph = {

};
type auth_schema_migrationsChildrenGraph = {

};
type auth_schema_migrationsGraph = Array<{
  Scalars: auth_schema_migrationsScalars;
  Parents: auth_schema_migrationsParentsGraph;
  Children: auth_schema_migrationsChildrenGraph;
}>;
type sessionsParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "sessions">;
};
type sessionsChildrenGraph = {
 mfa_amr_claims: OmitParentGraph<mfa_amr_claimsGraph, "sessions">;
 refresh_tokens: OmitParentGraph<refresh_tokensGraph, "sessions">;
};
type sessionsGraph = Array<{
  Scalars: sessionsScalars;
  Parents: sessionsParentsGraph;
  Children: sessionsChildrenGraph;
}>;
type sso_domainsParentsGraph = {
 sso_providers: OmitChildGraph<sso_providersGraph, "sso_domains">;
};
type sso_domainsChildrenGraph = {

};
type sso_domainsGraph = Array<{
  Scalars: sso_domainsScalars;
  Parents: sso_domainsParentsGraph;
  Children: sso_domainsChildrenGraph;
}>;
type sso_providersParentsGraph = {

};
type sso_providersChildrenGraph = {
 saml_providers: OmitParentGraph<saml_providersGraph, "sso_providers">;
 saml_relay_states: OmitParentGraph<saml_relay_statesGraph, "sso_providers">;
 sso_domains: OmitParentGraph<sso_domainsGraph, "sso_providers">;
};
type sso_providersGraph = Array<{
  Scalars: sso_providersScalars;
  Parents: sso_providersParentsGraph;
  Children: sso_providersChildrenGraph;
}>;
type tenantsParentsGraph = {

};
type tenantsChildrenGraph = {
 extensions: OmitParentGraph<extensionsGraph, "tenants">;
};
type tenantsGraph = Array<{
  Scalars: tenantsScalars;
  Parents: tenantsParentsGraph;
  Children: tenantsChildrenGraph;
}>;
type auth_usersParentsGraph = {

};
type auth_usersChildrenGraph = {
 identities: OmitParentGraph<identitiesGraph, "auth_users">;
 mfa_factors: OmitParentGraph<mfa_factorsGraph, "auth_users">;
 sessions: OmitParentGraph<sessionsGraph, "auth_users">;
 public_users: OmitParentGraph<public_usersGraph, "auth_users">;
 buckets: OmitParentGraph<bucketsGraph, "auth_users">;
 objects: OmitParentGraph<objectsGraph, "auth_users">;
};
type auth_usersGraph = Array<{
  Scalars: auth_usersScalars;
  Parents: auth_usersParentsGraph;
  Children: auth_usersChildrenGraph;
}>;
type public_usersParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "public_users">;
};
type public_usersChildrenGraph = {
 posts: OmitParentGraph<postsGraph, "public_users">;
};
type public_usersGraph = Array<{
  Scalars: public_usersScalars;
  Parents: public_usersParentsGraph;
  Children: public_usersChildrenGraph;
}>;
type Graph = {
  _http_response: _http_responseGraph;
  audit_log_entries: audit_log_entriesGraph;
  buckets: bucketsGraph;
  extensions: extensionsGraph;
  hooks: hooksGraph;
  http_request_queue: http_request_queueGraph;
  identities: identitiesGraph;
  instances: instancesGraph;
  key: keyGraph;
  mfa_amr_claims: mfa_amr_claimsGraph;
  mfa_challenges: mfa_challengesGraph;
  mfa_factors: mfa_factorsGraph;
  storage_migrations: storage_migrationsGraph;
  supabase_functions_migrations: supabase_functions_migrationsGraph;
  objects: objectsGraph;
  posts: postsGraph;
  refresh_tokens: refresh_tokensGraph;
  saml_providers: saml_providersGraph;
  saml_relay_states: saml_relay_statesGraph;
  _realtime_schema_migrations: _realtime_schema_migrationsGraph;
  auth_schema_migrations: auth_schema_migrationsGraph;
  sessions: sessionsGraph;
  sso_domains: sso_domainsGraph;
  sso_providers: sso_providersGraph;
  tenants: tenantsGraph;
  auth_users: auth_usersGraph;
  public_users: public_usersGraph;
};
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
  _http_response?: {
    name?: string;
    fields?: {
      id?: string;
      status_code?: string;
      content_type?: string;
      headers?: string;
      content?: string;
      timed_out?: string;
      error_msg?: string;
      created?: string;
    };
  }
  audit_log_entries?: {
    name?: string;
    fields?: {
      instance_id?: string;
      id?: string;
      payload?: string;
      created_at?: string;
      ip_address?: string;
    };
  }
  buckets?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      owner?: string;
      created_at?: string;
      updated_at?: string;
      public?: string;
      avif_autodetection?: string;
      file_size_limit?: string;
      allowed_mime_types?: string;
      auth_users?: string;
      objects?: string;
    };
  }
  extensions?: {
    name?: string;
    fields?: {
      id?: string;
      type?: string;
      settings?: string;
      tenant_external_id?: string;
      inserted_at?: string;
      updated_at?: string;
      tenants?: string;
    };
  }
  hooks?: {
    name?: string;
    fields?: {
      id?: string;
      hook_table_id?: string;
      hook_name?: string;
      created_at?: string;
      request_id?: string;
    };
  }
  http_request_queue?: {
    name?: string;
    fields?: {
      id?: string;
      method?: string;
      url?: string;
      headers?: string;
      body?: string;
      timeout_milliseconds?: string;
    };
  }
  identities?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      identity_data?: string;
      provider?: string;
      last_sign_in_at?: string;
      created_at?: string;
      updated_at?: string;
      email?: string;
      auth_users?: string;
    };
  }
  instances?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      raw_base_config?: string;
      created_at?: string;
      updated_at?: string;
    };
  }
  key?: {
    name?: string;
    fields?: {
      id?: string;
      status?: string;
      created?: string;
      expires?: string;
      key_type?: string;
      key_id?: string;
      key_context?: string;
      name?: string;
      associated_data?: string;
      raw_key?: string;
      raw_key_nonce?: string;
      parent_key?: string;
      comment?: string;
      user_data?: string;
      key?: string;
      key?: string;
    };
  }
  mfa_amr_claims?: {
    name?: string;
    fields?: {
      session_id?: string;
      created_at?: string;
      updated_at?: string;
      authentication_method?: string;
      id?: string;
      sessions?: string;
    };
  }
  mfa_challenges?: {
    name?: string;
    fields?: {
      id?: string;
      factor_id?: string;
      created_at?: string;
      verified_at?: string;
      ip_address?: string;
      mfa_factors?: string;
    };
  }
  mfa_factors?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      friendly_name?: string;
      factor_type?: string;
      status?: string;
      created_at?: string;
      updated_at?: string;
      secret?: string;
      auth_users?: string;
      mfa_challenges?: string;
    };
  }
  storage_migrations?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      hash?: string;
      executed_at?: string;
    };
  }
  supabase_functions_migrations?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  objects?: {
    name?: string;
    fields?: {
      id?: string;
      bucket_id?: string;
      name?: string;
      owner?: string;
      created_at?: string;
      updated_at?: string;
      last_accessed_at?: string;
      metadata?: string;
      path_tokens?: string;
      auth_users?: string;
      buckets?: string;
      posts?: string;
    };
  }
  posts?: {
    name?: string;
    fields?: {
      id?: string;
      title?: string;
      body?: string;
      user_id?: string;
      image?: string;
      created_at?: string;
      updated_at?: string;
      public_users?: string;
      objects?: string;
    };
  }
  refresh_tokens?: {
    name?: string;
    fields?: {
      instance_id?: string;
      id?: string;
      token?: string;
      user_id?: string;
      revoked?: string;
      created_at?: string;
      updated_at?: string;
      parent?: string;
      session_id?: string;
      sessions?: string;
    };
  }
  saml_providers?: {
    name?: string;
    fields?: {
      id?: string;
      sso_provider_id?: string;
      entity_id?: string;
      metadata_xml?: string;
      metadata_url?: string;
      attribute_mapping?: string;
      created_at?: string;
      updated_at?: string;
      sso_providers?: string;
    };
  }
  saml_relay_states?: {
    name?: string;
    fields?: {
      id?: string;
      sso_provider_id?: string;
      request_id?: string;
      for_email?: string;
      redirect_to?: string;
      from_ip_address?: string;
      created_at?: string;
      updated_at?: string;
      sso_providers?: string;
    };
  }
  _realtime_schema_migrations?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  auth_schema_migrations?: {
    name?: string;
    fields?: {
      version?: string;
    };
  }
  sessions?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      created_at?: string;
      updated_at?: string;
      factor_id?: string;
      aal?: string;
      not_after?: string;
      auth_users?: string;
      mfa_amr_claims?: string;
      refresh_tokens?: string;
    };
  }
  sso_domains?: {
    name?: string;
    fields?: {
      id?: string;
      sso_provider_id?: string;
      domain?: string;
      created_at?: string;
      updated_at?: string;
      sso_providers?: string;
    };
  }
  sso_providers?: {
    name?: string;
    fields?: {
      id?: string;
      resource_id?: string;
      created_at?: string;
      updated_at?: string;
      saml_providers?: string;
      saml_relay_states?: string;
      sso_domains?: string;
    };
  }
  tenants?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      external_id?: string;
      jwt_secret?: string;
      max_concurrent_users?: string;
      inserted_at?: string;
      updated_at?: string;
      max_events_per_second?: string;
      postgres_cdc_default?: string;
      max_bytes_per_second?: string;
      max_channels_per_client?: string;
      max_joins_per_second?: string;
      extensions?: string;
    };
  }
  auth_users?: {
    name?: string;
    fields?: {
      instance_id?: string;
      id?: string;
      aud?: string;
      role?: string;
      email?: string;
      encrypted_password?: string;
      email_confirmed_at?: string;
      invited_at?: string;
      confirmation_token?: string;
      confirmation_sent_at?: string;
      recovery_token?: string;
      recovery_sent_at?: string;
      email_change_token_new?: string;
      email_change?: string;
      email_change_sent_at?: string;
      last_sign_in_at?: string;
      raw_app_meta_data?: string;
      raw_user_meta_data?: string;
      is_super_admin?: string;
      created_at?: string;
      updated_at?: string;
      phone?: string;
      phone_confirmed_at?: string;
      phone_change?: string;
      phone_change_token?: string;
      phone_change_sent_at?: string;
      confirmed_at?: string;
      email_change_token_current?: string;
      email_change_confirm_status?: string;
      banned_until?: string;
      reauthentication_token?: string;
      reauthentication_sent_at?: string;
      is_sso_user?: string;
      deleted_at?: string;
      identities?: string;
      mfa_factors?: string;
      sessions?: string;
      public_users?: string;
      buckets?: string;
      objects?: string;
    };
  }
  public_users?: {
    name?: string;
    fields?: {
      id?: string;
      email?: string;
      name?: string;
      created_at?: string;
      updated_at?: string;
      auth_users?: string;
      posts?: string;
    };
  }}
export type Alias = {
  inflection?: Inflection | boolean;
  override?: Override;
};
export declare class SnapletClientBase {
  /**
   * Generate one or more `_http_response`.
   * @example With static inputs:
   * ```ts
   * snaplet._http_response([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet._http_response((x) => x(3));
   * snaplet._http_response((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet._http_response((x) => [{}, ...x(3), {}]);
   * ```
   */
  _http_response: (
    inputs: _http_responseChildInputs<["_http_response"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `audit_log_entries`.
   * @example With static inputs:
   * ```ts
   * snaplet.audit_log_entries([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.audit_log_entries((x) => x(3));
   * snaplet.audit_log_entries((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.audit_log_entries((x) => [{}, ...x(3), {}]);
   * ```
   */
  audit_log_entries: (
    inputs: audit_log_entriesChildInputs<["audit_log_entries"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `buckets`.
   * @example With static inputs:
   * ```ts
   * snaplet.buckets([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.buckets((x) => x(3));
   * snaplet.buckets((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.buckets((x) => [{}, ...x(3), {}]);
   * ```
   */
  buckets: (
    inputs: bucketsChildInputs<["buckets"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `extensions`.
   * @example With static inputs:
   * ```ts
   * snaplet.extensions([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.extensions((x) => x(3));
   * snaplet.extensions((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.extensions((x) => [{}, ...x(3), {}]);
   * ```
   */
  extensions: (
    inputs: extensionsChildInputs<["extensions"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `hooks`.
   * @example With static inputs:
   * ```ts
   * snaplet.hooks([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.hooks((x) => x(3));
   * snaplet.hooks((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.hooks((x) => [{}, ...x(3), {}]);
   * ```
   */
  hooks: (
    inputs: hooksChildInputs<["hooks"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `http_request_queue`.
   * @example With static inputs:
   * ```ts
   * snaplet.http_request_queue([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.http_request_queue((x) => x(3));
   * snaplet.http_request_queue((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.http_request_queue((x) => [{}, ...x(3), {}]);
   * ```
   */
  http_request_queue: (
    inputs: http_request_queueChildInputs<["http_request_queue"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `identities`.
   * @example With static inputs:
   * ```ts
   * snaplet.identities([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.identities((x) => x(3));
   * snaplet.identities((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.identities((x) => [{}, ...x(3), {}]);
   * ```
   */
  identities: (
    inputs: identitiesChildInputs<["identities"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `instances`.
   * @example With static inputs:
   * ```ts
   * snaplet.instances([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.instances((x) => x(3));
   * snaplet.instances((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.instances((x) => [{}, ...x(3), {}]);
   * ```
   */
  instances: (
    inputs: instancesChildInputs<["instances"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `key`.
   * @example With static inputs:
   * ```ts
   * snaplet.key([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.key((x) => x(3));
   * snaplet.key((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.key((x) => [{}, ...x(3), {}]);
   * ```
   */
  key: (
    inputs: keyChildInputs<["key"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `mfa_amr_claims`.
   * @example With static inputs:
   * ```ts
   * snaplet.mfa_amr_claims([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.mfa_amr_claims((x) => x(3));
   * snaplet.mfa_amr_claims((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.mfa_amr_claims((x) => [{}, ...x(3), {}]);
   * ```
   */
  mfa_amr_claims: (
    inputs: mfa_amr_claimsChildInputs<["mfa_amr_claims"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `mfa_challenges`.
   * @example With static inputs:
   * ```ts
   * snaplet.mfa_challenges([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.mfa_challenges((x) => x(3));
   * snaplet.mfa_challenges((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.mfa_challenges((x) => [{}, ...x(3), {}]);
   * ```
   */
  mfa_challenges: (
    inputs: mfa_challengesChildInputs<["mfa_challenges"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `mfa_factors`.
   * @example With static inputs:
   * ```ts
   * snaplet.mfa_factors([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.mfa_factors((x) => x(3));
   * snaplet.mfa_factors((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.mfa_factors((x) => [{}, ...x(3), {}]);
   * ```
   */
  mfa_factors: (
    inputs: mfa_factorsChildInputs<["mfa_factors"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `storage_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.storage_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.storage_migrations((x) => x(3));
   * snaplet.storage_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.storage_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  storage_migrations: (
    inputs: storage_migrationsChildInputs<["storage_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `supabase_functions_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.supabase_functions_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.supabase_functions_migrations((x) => x(3));
   * snaplet.supabase_functions_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.supabase_functions_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  supabase_functions_migrations: (
    inputs: supabase_functions_migrationsChildInputs<["supabase_functions_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `objects`.
   * @example With static inputs:
   * ```ts
   * snaplet.objects([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.objects((x) => x(3));
   * snaplet.objects((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.objects((x) => [{}, ...x(3), {}]);
   * ```
   */
  objects: (
    inputs: objectsChildInputs<["objects"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `posts`.
   * @example With static inputs:
   * ```ts
   * snaplet.posts([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.posts((x) => x(3));
   * snaplet.posts((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.posts((x) => [{}, ...x(3), {}]);
   * ```
   */
  posts: (
    inputs: postsChildInputs<["posts"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `refresh_tokens`.
   * @example With static inputs:
   * ```ts
   * snaplet.refresh_tokens([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.refresh_tokens((x) => x(3));
   * snaplet.refresh_tokens((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.refresh_tokens((x) => [{}, ...x(3), {}]);
   * ```
   */
  refresh_tokens: (
    inputs: refresh_tokensChildInputs<["refresh_tokens"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `saml_providers`.
   * @example With static inputs:
   * ```ts
   * snaplet.saml_providers([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.saml_providers((x) => x(3));
   * snaplet.saml_providers((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.saml_providers((x) => [{}, ...x(3), {}]);
   * ```
   */
  saml_providers: (
    inputs: saml_providersChildInputs<["saml_providers"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `saml_relay_states`.
   * @example With static inputs:
   * ```ts
   * snaplet.saml_relay_states([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.saml_relay_states((x) => x(3));
   * snaplet.saml_relay_states((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.saml_relay_states((x) => [{}, ...x(3), {}]);
   * ```
   */
  saml_relay_states: (
    inputs: saml_relay_statesChildInputs<["saml_relay_states"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `_realtime_schema_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet._realtime_schema_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet._realtime_schema_migrations((x) => x(3));
   * snaplet._realtime_schema_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet._realtime_schema_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  _realtime_schema_migrations: (
    inputs: _realtime_schema_migrationsChildInputs<["_realtime_schema_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `auth_schema_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.auth_schema_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.auth_schema_migrations((x) => x(3));
   * snaplet.auth_schema_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.auth_schema_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  auth_schema_migrations: (
    inputs: auth_schema_migrationsChildInputs<["auth_schema_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `sessions`.
   * @example With static inputs:
   * ```ts
   * snaplet.sessions([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.sessions((x) => x(3));
   * snaplet.sessions((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.sessions((x) => [{}, ...x(3), {}]);
   * ```
   */
  sessions: (
    inputs: sessionsChildInputs<["sessions"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `sso_domains`.
   * @example With static inputs:
   * ```ts
   * snaplet.sso_domains([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.sso_domains((x) => x(3));
   * snaplet.sso_domains((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.sso_domains((x) => [{}, ...x(3), {}]);
   * ```
   */
  sso_domains: (
    inputs: sso_domainsChildInputs<["sso_domains"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `sso_providers`.
   * @example With static inputs:
   * ```ts
   * snaplet.sso_providers([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.sso_providers((x) => x(3));
   * snaplet.sso_providers((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.sso_providers((x) => [{}, ...x(3), {}]);
   * ```
   */
  sso_providers: (
    inputs: sso_providersChildInputs<["sso_providers"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `tenants`.
   * @example With static inputs:
   * ```ts
   * snaplet.tenants([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.tenants((x) => x(3));
   * snaplet.tenants((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.tenants((x) => [{}, ...x(3), {}]);
   * ```
   */
  tenants: (
    inputs: tenantsChildInputs<["tenants"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `auth_users`.
   * @example With static inputs:
   * ```ts
   * snaplet.auth_users([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.auth_users((x) => x(3));
   * snaplet.auth_users((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.auth_users((x) => [{}, ...x(3), {}]);
   * ```
   */
  auth_users: (
    inputs: auth_usersChildInputs<["auth_users"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `public_users`.
   * @example With static inputs:
   * ```ts
   * snaplet.public_users([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.public_users((x) => x(3));
   * snaplet.public_users((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.public_users((x) => [{}, ...x(3), {}]);
   * ```
   */
  public_users: (
    inputs: public_usersChildInputs<["public_users"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Compose multiple plans together, injecting the store of the previous plan into the next plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-pipe | documentation}.
   */
  $pipe: Pipe;
  /**
   * Compose multiple plans together, without injecting the store of the previous plan into the next plan.
   * All stores stay independent and are merged together once all the plans are generated.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-merge | documentation}.
   */
  $merge: Merge;
  /**
   * Create a store instance.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#augmenting-external-data-with-createstore | documentation}.
   */
  $createStore: CreateStore;
};

export type SnapletClientBaseOptions = {
  userModels?: UserModels
}


type PgClient = {
  query(string): Promise<unknown>
}

export declare class SnapletClient extends SnapletClientBase {
  constructor(pgClient: PgClient, options?: SnapletClientBaseOptions)
}
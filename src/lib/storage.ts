// The object storage boundary (system-overview.md §3, portability rule 2).
// Application code never imports an S3 SDK directly — it imports this
// interface, and one implementation of it. No implementation exists yet in
// this phase: nothing calls it. The R2 adapter is built in the phase that
// first uploads voice audio or a generated PDF, where it can be tested
// against a real bucket rather than written speculatively.

export type StorageAdapter = {
  put(key: string, body: Buffer | Uint8Array, contentType: string): Promise<void>
  get(key: string): Promise<Buffer>
  getSignedUploadUrl(key: string, contentType: string): Promise<string>
  delete(key: string): Promise<void>
}

function notConfigured(): never {
  throw new Error(
    "No storage adapter is configured. lib/storage.ts defines the interface " +
      "only in this phase — an R2-backed implementation is added by the " +
      "phase that first needs one.",
  )
}

export const storage: StorageAdapter = {
  put: async () => notConfigured(),
  get: async () => notConfigured(),
  getSignedUploadUrl: async () => notConfigured(),
  delete: async () => notConfigured(),
}

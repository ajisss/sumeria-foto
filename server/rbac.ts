export const ROLES = ["owner", "admin", "staff", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const COLLECTIONS = ["customers", "quotations", "invoices", "expenses", "packages"] as const;
export type Collection = (typeof COLLECTIONS)[number];

export type Permission = `read:${Collection}` | `write:${Collection}` | "users:manage";

const all: Permission[] = [
  ...COLLECTIONS.flatMap((c) => [`read:${c}`, `write:${c}`] as Permission[]),
  "users:manage",
];

const matrix: Record<Role, ReadonlySet<Permission>> = {
  // owner: segalanya, termasuk kelola semua user.
  owner: new Set(all),
  // admin: semua data, kelola user staff/viewer saja (lihat MANAGEABLE_ROLES).
  admin: new Set(all),
  // staff: operasional harian. Tidak bisa lihat pengeluaran.
  staff: new Set<Permission>([
    "read:customers", "write:customers",
    "read:quotations", "write:quotations",
    "read:invoices", "write:invoices",
    // katalog paket: staff boleh baca (untuk dropdown quotation/invoice), ubah hanya owner/admin.
    "read:packages",
  ]),
  // viewer: baca saja, tanpa pengeluaran.
  viewer: new Set<Permission>(["read:customers", "read:quotations", "read:invoices", "read:packages"]),
};

export function isRole(v: unknown): v is Role {
  return typeof v === "string" && (ROLES as readonly string[]).includes(v);
}

export function isCollection(v: unknown): v is Collection {
  return typeof v === "string" && (COLLECTIONS as readonly string[]).includes(v);
}

export function can(role: unknown, perm: Permission): boolean {
  return isRole(role) && matrix[role].has(perm);
}

export function permissionsOf(role: unknown): Permission[] {
  return isRole(role) ? [...matrix[role]] : [];
}

/** Role yang boleh diberikan/diubah/dinonaktifkan oleh seorang actor. */
export const MANAGEABLE_ROLES: Record<Role, readonly Role[]> = {
  owner: ["owner", "admin", "staff", "viewer"],
  admin: ["staff", "viewer"],
  staff: [],
  viewer: [],
};

export function canManageRole(actor: unknown, target: Role): boolean {
  return isRole(actor) && can(actor, "users:manage") && MANAGEABLE_ROLES[actor].includes(target);
}

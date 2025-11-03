import type { auth } from "@/features/auth";

export interface AppBindings {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}

export interface IBaseRepository<T, InsertDTO = T, UpdateDTO = T> {
  insert(data: InsertDTO): Promise<T[]>;
  readById(id: string): Promise<T | null>;
  readAll(orgId?: string): Promise<T[]>;
  patch(id: string, data: UpdateDTO): Promise<T[] | null>;
  delete(id: string): Promise<T[] | null>;
}

export interface IBaseService<T, InsertDTO = T, UpdateDTO = T> {
  create(data: InsertDTO, userId?: string): Promise<T>;
  findById(id: string): Promise<T>;
  findAll(orgId?: string): Promise<T[]>;
  update?(id: string, data: UpdateDTO, userId?: string): Promise<T>;
  delete(id: string, userId?: string): Promise<T>;
}

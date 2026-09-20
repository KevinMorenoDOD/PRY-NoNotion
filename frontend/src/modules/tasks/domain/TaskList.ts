import type { BaseEntity } from "@shared/domain/BaseEntity";

export interface TaskList extends BaseEntity {
  name: string;
  color: string | null;
  sortOrder: number;
}

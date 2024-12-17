export interface VolunteerInfo {
  id: string;
  name: string;
  team: string;
  kh_name: string;
  kh_team: string;
}

export interface BorrowedItem {
  transaction_id: string;
  item_name: string;
  item_code: string;
  qty_borrowed: number;
  borrow_time: string;
  return_time?: string | null;
  status: string;
}

export interface ItemInfo {
  code: string;
  name: string;
  qty: number;
  category_id: string;
  unit: string;
}
export enum UserRole {
  ADMIN = 'admin',
  RE_OFFICER = 're_officer',
  SALES_OFFICER = 'sales_officer',
  DEALER = 'dealer',
  VENDOR = 'vendor',
}

export const ROLE_NAMES = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.RE_OFFICER]: 'RE Officer',
  [UserRole.SALES_OFFICER]: 'Sales Officer',
  [UserRole.DEALER]: 'Dealer',
  [UserRole.VENDOR]: 'Vendor',
};

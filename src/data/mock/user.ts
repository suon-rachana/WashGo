export interface MockUser {
  id: string;
  firstName: string;
  fullName: string;
  location: string;
  phone: string;
  email: string;
}

export const mockUser: MockUser = {
  id: 'user-1',
  firstName: 'Dara',
  fullName: 'Dara Chan',
  location: 'Siem Reap, Cambodia',
  phone: '+855 12 345 678',
  email: 'dara.chan@example.com',
};

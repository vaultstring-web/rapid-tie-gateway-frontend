export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => void;
  isLoading?: boolean;
}

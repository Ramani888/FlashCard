/**
 * TypeScript type definitions for the FlashCard application
 */

// User types
export interface User {
  _id: string;
  email: string;
  name: string;
  token: string;
  profilePic?: string;
  isSubscribed?: boolean;
  subscriptionType?: 'free' | 'premium' | 'pro';
  subscriptionExpiry?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Folder types
export interface Folder {
  _id: string;
  name: string;
  color: string;
  userId: string;
  isHighlight: boolean;
  setsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Set types
export interface CardSet {
  _id: string;
  name: string;
  color: string;
  folderId?: string;
  userId: string;
  isHighlight: boolean;
  cardsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Card types
export interface Card {
  _id: string;
  front: string;
  back: string;
  setId: string;
  userId: string;
  type: 'text' | 'image';
  isBlurred: boolean;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

// Note types
export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  color?: string;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// PDF types
export interface PDFFolder {
  _id: string;
  name: string;
  color: string;
  userId: string;
  pdfsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PDF {
  _id: string;
  name: string;
  url: string;
  folderId?: string;
  userId: string;
  size?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Image types
export interface ImageFolder {
  _id: string;
  name: string;
  color: string;
  userId: string;
  imagesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImageItem {
  _id: string;
  name: string;
  url: string;
  folderId?: string;
  userId: string;
  size?: number;
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation param types
export type RootStackParamList = {
  SplashScreen: undefined;
  SignUp: undefined;
  SignIn: undefined;
  OtpVerify: {email: string; type: 'signUp' | 'forgotPassword'};
  ResetPassword: {email: string; otp: string};
  Home: undefined;
  SetAndFolder: undefined;
  CreateCard: {setId: string; editMode?: boolean; cardId?: string};
  AsignFolder: {setId: string};
  AssignSet: {folderId: string};
  SetDetail: {setId: string; setName: string};
  Profile: undefined;
  Contacts: undefined;
  Support: undefined;
  Notes: undefined;
  NotesDetail: {noteId?: string; editMode?: boolean};
  Pdf: undefined;
  AssignPdfFolder: {pdfId: string};
  ViewPdfScreen: {pdfUrl: string; pdfName: string};
  Image: undefined;
  AssignImageFolder: {imageId: string};
  ViewFullImage: {imageUrl: string};
  AiScreen: undefined;
  Privacy: undefined;
  AboutUs: undefined;
  Cloud: undefined;
  Subscription: undefined;
  Community: undefined;
  OtherUser: {userId: string};
  OtherUserCard: {setId: string; userId: string};
};

// Redux state types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ThemeState {
  theme: 'Light' | 'Dark';
  isDarkMode: boolean;
}

export interface FolderState {
  folders: Folder[];
  selectedFolder: Folder | null;
  isLoading: boolean;
  error: string | null;
}

export interface SetState {
  sets: CardSet[];
  selectedSet: CardSet | null;
  isLoading: boolean;
  error: string | null;
}

export interface CardState {
  cards: Card[];
  selectedCard: Card | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  isOnline: boolean;
  isAppReady: boolean;
  language: string;
}

// Root Redux state
export interface RootState {
  auth: AuthState;
  theme: ThemeState;
  folders: FolderState;
  sets: SetState;
  cards: CardState;
  app: AppState;
}

// Subscription types
export interface Subscription {
  productId: string;
  type: 'monthly' | 'yearly' | 'lifetime';
  price: string;
  currency: string;
  localizedPrice: string;
}

// Language types
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

// Contact types
export interface Contact {
  _id: string;
  userId: string;
  contactUserId: string;
  contactUser: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: string;
}

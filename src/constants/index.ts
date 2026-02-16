/**
 * Constants - Application-wide constant values
 */

// Screen spacing and sizing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Animation durations (ms)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// API related constants
export const API = {
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
};

// Storage keys (single source of truth)
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme',
  LANGUAGE: 'Language',
  ONBOARDING: 'onboarding_complete',
  SUBSCRIPTION: 'subscription',
  OFFLINE_DATA: 'offline_data',
};

// Screen names for navigation
export const SCREENS = {
  SPLASH: 'SplashScreen',
  SIGN_UP: 'SignUp',
  SIGN_IN: 'SignIn',
  OTP_VERIFY: 'OtpVerify',
  RESET_PASSWORD: 'ResetPassword',
  HOME: 'Home',
  SET_AND_FOLDER: 'SetAndFolder',
  CREATE_CARD: 'CreateCard',
  PROFILE: 'Profile',
  CONTACTS: 'Contacts',
  SUPPORT: 'Support',
  NOTES: 'Notes',
  NOTES_DETAIL: 'NotesDetail',
  ASSIGN_FOLDER: 'AsignFolder',
  ASSIGN_SET: 'AssignSet',
  COMMUNITY: 'Community',
  SET_DETAIL: 'SetDetail',
  PDF: 'Pdf',
  ASSIGN_PDF_FOLDER: 'AssignPdfFolder',
  VIEW_PDF: 'ViewPdfScreen',
  IMAGE: 'Image',
  ASSIGN_IMAGE_FOLDER: 'AssignImageFolder',
  VIEW_FULL_IMAGE: 'ViewFullImage',
  AI_SCREEN: 'AiScreen',
  PRIVACY: 'Privacy',
  ABOUT_US: 'AboutUs',
  CLOUD: 'Cloud',
  SUBSCRIPTION: 'Subscription',
  OTHER_USER: 'OtherUser',
  OTHER_USER_CARD: 'OtherUserCard',
};

// App info
export const APP_INFO = {
  NAME: 'FlashCard',
  VERSION: '1.0.0',
  STORE_URL: 'https://play.google.com/store/apps/details?id=com.flashcard.app',
  SUPPORT_EMAIL: 'support@flashcardapp.com',
  WEBSITE: 'https://biblestudycards.app',
};

// Default card colors
export const CARD_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
  '#F8B500',
  '#00CED1',
];

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  PRO: 'pro',
};

// Feature limits per subscription tier
export const FEATURE_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    maxFolders: 5,
    maxSets: 10,
    maxCardsPerSet: 50,
    maxNotes: 10,
    aiCredits: 3,
    cloudStorage: false,
  },
  [SUBSCRIPTION_TIERS.PREMIUM]: {
    maxFolders: 50,
    maxSets: 100,
    maxCardsPerSet: 500,
    maxNotes: 100,
    aiCredits: 50,
    cloudStorage: true,
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    maxFolders: -1, // unlimited
    maxSets: -1,
    maxCardsPerSet: -1,
    maxNotes: -1,
    aiCredits: -1,
    cloudStorage: true,
  },
};

export default {
  SPACING,
  BORDER_RADIUS,
  ANIMATION,
  API,
  STORAGE_KEYS,
  SCREENS,
  APP_INFO,
  CARD_COLORS,
  SUBSCRIPTION_TIERS,
  FEATURE_LIMITS,
};

import type { Language } from '@/src/store/settingsStore';

/**
 * WashGo translation dictionary.
 * Single source of truth for user-facing copy — screens look up strings by
 * key through useTranslation() instead of hardcoding English text.
 */

export type TranslationKey =
  // Bottom tabs
  | 'home'
  | 'orders'
  | 'laundries'
  | 'profile'
  // Profile menu / common screens
  | 'settings'
  | 'notifications'
  | 'savedAddresses'
  | 'paymentMethods'
  | 'favoriteLaundries'
  | 'helpCenter'
  | 'aboutWashGo'
  | 'logout'
  // Common actions / booking flow labels
  | 'searchLaundries'
  | 'bookNow'
  | 'requestPickup'
  | 'schedulePickup'
  | 'chooseALaundry'
  | 'chooseServices'
  | 'pickupDetails'
  | 'orderSummary'
  | 'paymentMethod'
  | 'orderTracking'
  | 'orderDetails'
  | 'backToHome'
  // Settings screen
  | 'manageAppPreferences'
  | 'theme'
  | 'lightMode'
  | 'darkMode'
  | 'language'
  | 'english'
  | 'khmer'
  | 'pushNotifications'
  | 'currency'
  | 'appVersion'
  // Profile screen
  | 'myOrders'
  | 'regularMember'
  | 'logOutConfirmTitle'
  | 'logOutConfirmMessage'
  | 'cancel'
  // Home screen
  | 'goodMorning'
  | 'letUsHandleYourLaundry'
  | 'searchLaundriesOrServices'
  | 'categories'
  | 'nearbyLaundries'
  | 'seeAll'
  | 'popularServices'
  | 'noLaundriesFound'
  | 'noLaundriesFoundDescription'
  // Map / location picker
  | 'chooseOnMap'
  | 'chooseLocation'
  | 'moveMapToSelectPickupPoint'
  | 'selectedLocation'
  | 'confirmLocation'
  | 'currentLocation'
  | 'latitude'
  | 'longitude'
  | 'selectedCoordinates'
  | 'locationPermissionRequired'
  | 'locationPermissionMessage'
  | 'unableToGetCurrentLocation'
  | 'locatingYou'
  | 'mapUnavailable'
  | 'mapFallbackMessage';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    home: 'Home',
    orders: 'Orders',
    laundries: 'Laundries',
    profile: 'Profile',

    settings: 'Settings',
    notifications: 'Notifications',
    savedAddresses: 'Saved Addresses',
    paymentMethods: 'Payment Methods',
    favoriteLaundries: 'Favorite Laundries',
    helpCenter: 'Help Center',
    aboutWashGo: 'About WashGo',
    logout: 'Logout',

    searchLaundries: 'Search laundries',
    bookNow: 'Book now',
    requestPickup: 'Request Pickup',
    schedulePickup: 'Schedule Pickup',
    chooseALaundry: 'Choose a Laundry',
    chooseServices: 'Choose Services',
    pickupDetails: 'Pickup Details',
    orderSummary: 'Order Summary',
    paymentMethod: 'Payment Method',
    orderTracking: 'Order Tracking',
    orderDetails: 'Order Details',
    backToHome: 'Back to Home',

    manageAppPreferences: 'Manage app preferences.',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    english: 'English',
    khmer: 'Khmer',
    pushNotifications: 'Push Notifications',
    currency: 'Currency',
    appVersion: 'App Version',

    myOrders: 'My Orders',
    regularMember: 'Regular Member',
    logOutConfirmTitle: 'Log Out',
    logOutConfirmMessage: 'Are you sure you want to log out?',
    cancel: 'Cancel',

    goodMorning: 'Good morning',
    letUsHandleYourLaundry: 'Let us handle your laundry today.',
    searchLaundriesOrServices: 'Search laundries or services',
    categories: 'Categories',
    nearbyLaundries: 'Nearby Laundries',
    seeAll: 'See all',
    popularServices: 'Popular Services',
    noLaundriesFound: 'No laundries found',
    noLaundriesFoundDescription: 'Try searching for another laundry or service.',

    chooseOnMap: 'Choose on Map',
    chooseLocation: 'Choose Location',
    moveMapToSelectPickupPoint: 'Move the map to select your pickup point.',
    selectedLocation: 'Selected Location',
    confirmLocation: 'Confirm Location',
    currentLocation: 'Current Location',
    latitude: 'Latitude',
    longitude: 'Longitude',
    selectedCoordinates: 'Coordinates',
    locationPermissionRequired: 'Location Permission Required',
    locationPermissionMessage: 'Please allow location access to use your current location, or move the map manually to select a pickup point.',
    unableToGetCurrentLocation: 'Unable to get your current location. Please try again or move the map manually.',
    locatingYou: 'Locating you…',
    mapUnavailable: 'Interactive map unavailable',
    mapFallbackMessage: 'The interactive map could not be loaded on this device. You can still confirm the default pickup point below.',
  },
  km: {
    home: 'ទំព័រដើម',
    orders: 'ការបញ្ជាទិញ',
    laundries: 'ហាងបោកគក់',
    profile: 'គណនី',

    settings: 'ការកំណត់',
    notifications: 'ការជូនដំណឹង',
    savedAddresses: 'អាសយដ្ឋានដែលបានរក្សាទុក',
    paymentMethods: 'វិធីបង់ប្រាក់',
    favoriteLaundries: 'ហាងបោកគក់សំណព្វ',
    helpCenter: 'មជ្ឈមណ្ឌលជំនួយ',
    aboutWashGo: 'អំពី WashGo',
    logout: 'ចាកចេញ',

    searchLaundries: 'ស្វែងរកហាងបោកគក់',
    bookNow: 'កម្មង់ឥឡូវនេះ',
    requestPickup: 'ស្នើសុំមកយក',
    schedulePickup: 'កំណត់ពេលមកយក',
    chooseALaundry: 'ជ្រើសរើសហាងបោកគក់',
    chooseServices: 'ជ្រើសរើសសេវាកម្ម',
    pickupDetails: 'ព័ត៌មានលម្អិតការមកយក',
    orderSummary: 'សេចក្តីសង្ខេបការបញ្ជាទិញ',
    paymentMethod: 'វិធីបង់ប្រាក់',
    orderTracking: 'តាមដានការបញ្ជាទិញ',
    orderDetails: 'ព័ត៌មានលម្អិតការបញ្ជាទិញ',
    backToHome: 'ត្រឡប់ទៅទំព័រដើម',

    manageAppPreferences: 'គ្រប់គ្រងការកំណត់កម្មវិធី។',
    theme: 'រូបរាង',
    lightMode: 'របៀបភ្លឺ',
    darkMode: 'របៀបងងឹត',
    language: 'ភាសា',
    english: 'អង់គ្លេស',
    khmer: 'ខ្មែរ',
    pushNotifications: 'ការជូនដំណឹងតាមទូរស័ព្ទ',
    currency: 'រូបិយប័ណ្ណ',
    appVersion: 'កំណែកម្មវិធី',

    myOrders: 'ការបញ្ជាទិញរបស់ខ្ញុំ',
    regularMember: 'សមាជិកទូទៅ',
    logOutConfirmTitle: 'ចាកចេញ',
    logOutConfirmMessage: 'តើអ្នកប្រាកដជាចង់ចាកចេញឬ?',
    cancel: 'បោះបង់',

    goodMorning: 'អរុណសួស្តី',
    letUsHandleYourLaundry: 'ទុកឱ្យយើងខ្ញុំមើលការបោកគក់របស់អ្នកថ្ងៃនេះ។',
    searchLaundriesOrServices: 'ស្វែងរកហាងបោកគក់ ឬសេវាកម្ម',
    categories: 'ប្រភេទ',
    nearbyLaundries: 'ហាងបោកគក់នៅជិត',
    seeAll: 'មើលទាំងអស់',
    popularServices: 'សេវាកម្មពេញនិយម',
    noLaundriesFound: 'រកមិនឃើញហាងបោកគក់',
    noLaundriesFoundDescription: 'សូមសាកល្បងស្វែងរកហាងបោកគក់ ឬសេវាកម្មផ្សេងទៀត។',

    chooseOnMap: 'ជ្រើសរើសលើផែនទី',
    chooseLocation: 'ជ្រើសរើសទីតាំង',
    moveMapToSelectPickupPoint: 'ផ្លាស់ទីផែនទីដើម្បីជ្រើសរើសទីតាំងមកយករបស់អ្នក។',
    selectedLocation: 'ទីតាំងដែលបានជ្រើសរើស',
    confirmLocation: 'បញ្ជាក់ទីតាំង',
    currentLocation: 'ទីតាំងបច្ចុប្បន្ន',
    latitude: 'រយៈទទឹង',
    longitude: 'រយៈបណ្តោយ',
    selectedCoordinates: 'កូអរដោនេ',
    locationPermissionRequired: 'ត្រូវការសិទ្ធិចូលប្រើទីតាំង',
    locationPermissionMessage: 'សូមអនុញ្ញាតការចូលប្រើទីតាំង ដើម្បីប្រើទីតាំងបច្ចុប្បន្នរបស់អ្នក ឬផ្លាស់ទីផែនទីដោយដៃដើម្បីជ្រើសរើសទីតាំងមកយក។',
    unableToGetCurrentLocation: 'មិនអាចទទួលបានទីតាំងបច្ចុប្បន្នរបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត ឬផ្លាស់ទីផែនទីដោយដៃ។',
    locatingYou: 'កំពុងកំណត់ទីតាំងរបស់អ្នក…',
    mapUnavailable: 'ផែនទីអន្តរកម្មមិនអាចប្រើបានទេ',
    mapFallbackMessage: 'ផែនទីអន្តរកម្មមិនអាចផ្ទុកបានលើឧបករណ៍នេះទេ។ អ្នកនៅតែអាចបញ្ជាក់ទីតាំងមកយកលំនាំដើមខាងក្រោម។',
  },
};

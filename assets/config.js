/*
 * RAIN & RINSE: WORKING COMMERCIAL DETAILS
 * Every value here is a working input. Confirm before launch.
 * Change a value once here and all three directions update.
 */
window.RR_CONFIG = {
  product: {
    name: 'Rain & Rinse',
    descriptor: 'Filtered Rain Shower + Hand Shower',
    coreDescription: 'Full-body rain. A hand shower that goes where you need it. Filtered water through both. Meet the shower for everything your day brings.',
    benefits: ['Rain + handheld', 'Use either or both', 'Filtration through both heads'],
    colorLabel: 'Your shower in your signature shade.'
  },

  pricing: {
    currency: '$',
    subscription: 249,      // with filter subscription
    oneTime: 299,           // one-time purchase
    filterPrice: 33,        // replacement filter, subscription
    filterEveryDays: 90
  },

  // First color is the default selection.
  colors: [
    { id: 'lilac',     name: 'Lilac',     hex: '#C2ABFF', tint: '#E4D9FF', ink: '#000' },
    { id: 'moonlight', name: 'Moonlight', hex: '#E7E3DC', tint: '#F1EEE9', ink: '#000' },
    { id: 'black',     name: 'Black',     hex: '#141414', tint: '#3A3A3A', ink: '#FFF7F2' }
  ],

  // Carried over from the live Filtered Shower Kit PDP. Confirm these apply to Rain & Rinse.
  trust: {
    rating: '4.9',
    ratingLine: 'loved by 50,000+ customers',
    perks: ['Free Shipping', '60 Day Free Returns', '5 Year Warranty'],
    announcement: 'Free shipping over $99'
  }
};

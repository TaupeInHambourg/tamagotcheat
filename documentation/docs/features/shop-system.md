# Shop System

The shop system enables players to purchase accessories and backgrounds using in-game currency.

## Currency System

### Koins (K)
- **Free Currency**: Earned through gameplay
- **How to Earn**:
  - Complete daily quests
  - Complete weekly quests
  - Level up monsters
  - Special events

### Gifts (🎁)
- **Premium Currency**: Can be purchased
- **Availability**: Shop and special promotions
- **Future Integration**: Stripe payment system

## Purchase Flow

### 1. Browse Items
```typescript
// Items are fetched server-side
const accessories = await getAccessories();
const backgrounds = await getBackgrounds();
```

### 2. Check Affordability
- System validates wallet balance
- Disabled state if insufficient funds
- Clear pricing display with currency icons

### 3. Complete Purchase
```typescript
// Server action handles the transaction
await purchaseAccessory(accessoryId, userId, price, currency);
```

### 4. Update Inventory
- Item added to user's collection
- Wallet balance updated
- Toast notification confirms purchase

## Item Types

### Accessories

#### Categories
1. **Hats** 🎩
   - Displayed on top of monster
   - Various styles and rarities
   
2. **Glasses** 👓
   - Positioned on monster's face
   - Different frame styles
   
3. **Shoes** 👟
   - Shown at monster's feet
   - Various designs

#### Rarity Levels
- **Common**: Basic items, lower cost
- **Uncommon**: Slightly rare items
- **Rare**: Special designs
- **Epic**: Impressive items
- **Legendary**: Most exclusive items

#### Pricing
```typescript
export const ACCESSORY_PRICES = {
  common: { koins: 10, gifts: 1 },
  uncommon: { koins: 25, gifts: 2 },
  rare: { koins: 50, gifts: 5 },
  epic: { koins: 100, gifts: 10 },
  legendary: { koins: 250, gifts: 25 }
};
```

### Backgrounds

#### Features
- **Full Scene**: Background covers entire monster display
- **Themed Designs**: Various environments and settings
- **Rarity System**: Similar to accessories
- **Preview System**: See background before purchase

#### Pricing
```typescript
export const BACKGROUND_PRICES = {
  common: { koins: 15, gifts: 2 },
  uncommon: { koins: 35, gifts: 3 },
  rare: { koins: 75, gifts: 7 },
  epic: { koins: 150, gifts: 15 },
  legendary: { koins: 300, gifts: 30 }
};
```

## Shop Features

### Filtering
```typescript
// Filter by category
<CategoryFilter 
  categories={['all', 'hats', 'glasses', 'shoes']}
  active={selectedCategory}
  onChange={setCategory}
/>
```

### Sorting
- **By Price**: Low to high or high to low
- **By Rarity**: Common to legendary or reverse
- **By Name**: Alphabetical order

### Ownership Indicators
- **Owned Badge**: Shows items already in inventory
- **Equipped Status**: Indicates if accessory is equipped
- **Purchase History**: Track when items were acquired

### Preview System
```typescript
// Generic ShopCard component
<ShopCard
  item={accessory}
  renderPreview={() => (
    <AccessoryPreview 
      category={accessory.category}
      imageUrl={accessory.imageUrl}
    />
  )}
  onPurchase={handlePurchase}
  isOwned={ownedAccessories.includes(accessory.id)}
/>
```

## Data Models

### Accessory Schema
```typescript
interface IAccessory {
  name: string;
  description: string;
  category: 'hats' | 'glasses' | 'shoes';
  rarity: RarityLevel;
  imageUrl: string;
  equippedOnMonsterId?: ObjectId | null;
}
```

### Background Schema
```typescript
interface IBackground {
  name: string;
  description: string;
  rarity: RarityLevel;
  imageUrl: string;
  usedByMonsterIds: ObjectId[];
}
```

### Purchase Transaction
```typescript
interface PurchaseResult {
  success: boolean;
  message: string;
  walletBalance?: {
    koins: number;
    gifts: number;
  };
}
```

## Server Actions

### Purchase Accessory
```typescript
export async function purchaseAccessory(
  accessoryId: string,
  userId: string,
  price: number,
  currency: 'koins' | 'gifts'
): Promise<PurchaseResult>
```

### Purchase Background
```typescript
export async function purchaseBackground(
  backgroundId: string,
  userId: string,
  price: number,
  currency: 'koins' | 'gifts'
): Promise<PurchaseResult>
```

### Get User Inventory
```typescript
export async function getUserAccessories(userId: string)
export async function getUserBackgrounds(userId: string)
```

## UI Components

### ShopCard (Generic)
Reusable component for all shop items:
- Handles purchase logic
- Displays pricing in both currencies
- Shows ownership status
- Provides purchase feedback

### AccessoryCard
Specialized card for accessories:
- Uses ShopCard base
- Custom accessory preview
- Equipment status display

### BackgroundCard
Specialized card for backgrounds:
- Uses ShopCard base
- Full background preview
- Usage count display

## Best Practices

### Performance
- Server-side data fetching
- Optimistic UI updates
- Image optimization with Next.js Image
- Lazy loading for large catalogs

### User Experience
- Clear affordability indicators
- Instant purchase feedback
- Toast notifications
- Disabled states for unavailable items

### Security
- Server-side validation
- Transaction atomicity
- Wallet balance verification
- Duplicate purchase prevention

## Future Enhancements

- [ ] Gift bundles and packs
- [ ] Limited-time offers
- [ ] Discount system
- [ ] Trade system between users
- [ ] Wishlist functionality
- [ ] Shopping cart for bulk purchases
- [ ] Item preview on monsters before purchase

# Products Directory

This directory contains all product definitions for the website, organized in a structured folder format.

## 📁 Folder Structure

Each product has its own folder with the following structure:

```
lib/products/
├── product-name/
│   ├── index.ts           # Product definition (Product interface)
│   ├── assets/            # Product-specific media files
│   │   ├── image.jpeg
│   │   ├── cover.jpeg
│   │   └── ...
│   └── README.md          # Optional: Product-specific documentation
├── another-product/
│   ├── index.ts
│   └── assets/
├── index.ts               # Central hub that exports all products
├── PRODUCT_TEMPLATE.md    # Template for creating new products
└── PRODUCT_QUESTIONNAIRE.md # Guide for defining product details
```

## �� Current Products

- **doc-assistant** - Document AI Assistant (Coming Soon)
- **editorial-planner** - Staituned Editorial Suite (Beta)
- **fund-comparison** - Comparatore Fondi Pensione (Beta)
- **leave-tracker** - Leave Tracker (TBD)
- **my-smart-haircut** - My Smart Haircut (TBD)

## ✨ Adding a New Product

### 1. Create Product Folder

```bash
mkdir -p lib/products/my-product/assets
```

### 2. Create Product Definition

Create `lib/products/my-product/index.ts`:

```typescript
import type { Product } from '@/types/product'

export const myProduct: Product = {
  slug: 'my-product',
  title: 'My Product Title',
  subtitle: 'Short subtitle',
  tagline: 'Catchy tagline',
  description: 'Brief description',
  longDescription: 'Detailed description...',
  
  // Images - use product-specific paths
  image: '/assets/products/my-product/main-image.jpeg',
  coverImage: '/assets/products/my-product/cover-image.jpeg',
  
  status: 'coming-soon', // or 'beta' or 'live'
  
  tags: ['Tag1', 'Tag2'],
  category: 'productivity',
  techStack: ['React', 'Node.js'],
  
  // ... rest of the product definition
}
```

### 3. Add Product Media

Place your product images in two locations:

1. **Development reference** (optional): `lib/products/my-product/assets/`
2. **Public serving** (required): `public/assets/products/my-product/`

```bash
# Create public assets folder
mkdir -p public/assets/products/my-product

# Copy your images
cp image.jpeg public/assets/products/my-product/
cp cover.jpeg public/assets/products/my-product/
```

### 4. Register Product in Central Index

Add your product to `lib/products/index.ts`:

```typescript
// Import your product
import { myProduct } from './my-product'

// Add to the products array
export const allProducts: Product[] = [
  editorialPlanner,
  fundComparison,
  docAssistant,
  leaveTracker,
  mySmartHaircut,
  myProduct, // Add here
]
```

### 5. Verify

Your product will automatically appear in:
- `/prodotti` - Products listing page
- `/prodotti/my-product` - Product detail page
- `/demo` - Demo page (if applicable)

## 🖼️ Managing Product Media

### Image Guidelines

- **Main Image** (`image`): Square or 16:9, recommended 1200x630px
- **Cover Image** (`coverImage`): Wide format, recommended 1920x1080px
- **Additional Images** (`images[]`): Various formats, max 2MB each

### Naming Convention

Use descriptive, product-specific names:
- ✅ `editorial_planner.jpeg`
- ✅ `editorial_planner_robot.jpeg`
- ✅ `fund_comparison_dashboard.png`
- ❌ `image1.jpeg`
- ❌ `cover.jpeg`

### File Organization

```
public/assets/products/
└── product-name/
    ├── product_name.jpeg           # Main image
    ├── product_name_robot.jpeg     # Alternative/cover
    ├── screenshot_dashboard.png    # Screenshots
    ├── feature_1.png               # Feature images
    └── demo.gif                    # Demos/animations
```

## 📝 Product Definition Reference

### Required Fields

- `slug` - URL-friendly unique identifier
- `title` - Product name
- `description` - Short description (for cards)
- `status` - 'coming-soon' | 'beta' | 'live'
- `tags` - Array of tags
- `category` - Product category

### Optional But Recommended

- `subtitle` / `tagline` - Marketing copy
- `longDescription` - Detailed explanation
- `image` / `coverImage` - Visual assets
- `features[]` - Feature list with icons
- `techStack[]` - Technologies used
- `problem` - Problem statement
- `solution` - Solution description
- `caseStudy` - Real-world example
- `faq[]` - Frequently asked questions
- `pricing` - Pricing information
- `cta` - Call-to-action buttons

### Full Type Definition

See `/types/product.ts` for the complete `Product` interface.

## 🔄 Updating Products

To update a product:

1. Edit the product's `index.ts` file
2. Update images in `public/assets/products/product-name/`
3. Changes are reflected automatically (hot reload in dev)

## 🎨 Best Practices

### 1. Keep Media Organized
- One folder per product
- Use descriptive filenames
- Keep backup copies in `lib/products/product-name/assets/`

### 2. Consistent Naming
- Use kebab-case for folder names: `my-product`
- Use snake_case for image files: `product_image.jpeg`
- Export const names use camelCase: `myProduct`

### 3. Documentation
- Add comments in complex product definitions
- Update this guide when adding patterns
- Use `PRODUCT_TEMPLATE.md` for consistency

### 4. Asset Optimization
- Compress images before uploading
- Use appropriate formats (JPEG for photos, PNG for graphics)
- Keep file sizes under 500KB when possible

## 🚀 Deployment

When deploying, ensure:

1. All images are in `public/assets/products/`
2. Paths in product definitions are correct
3. No broken image links
4. Product slugs are unique

## 📚 Additional Resources

- **Product Template**: See `PRODUCT_TEMPLATE.md`
- **Product Questionnaire**: See `PRODUCT_QUESTIONNAIRE.md`
- **Type Definitions**: See `/types/product.ts`
- **Product Pages**: See `/app/(public)/prodotti/[slug]/`

## 🆘 Troubleshooting

### Product Not Showing
- Check if product is added to `allProducts` array in `index.ts`
- Verify `slug` is unique and URL-friendly
- Check for TypeScript errors

### Images Not Loading
- Verify images exist in `public/assets/products/product-name/`
- Check image paths in product definition start with `/assets/products/`
- Ensure correct spelling and file extensions

### Build Errors
- Run `npm run build` to check for issues
- Verify all required fields are present
- Check TypeScript types match Product interface

---

For questions or improvements, consult the team or update this documentation.

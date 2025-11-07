# Plan to Fix HTML Structure Validation Errors

## Problem Summary
Shopify requires that `richtext` fields (like `text` and `right_text` in various sections) must have all top-level nodes be one of: `<p>`, `<ul>`, `<ol>`, or `<h1>`-`<h6>` tags. Several template files have invalid HTML structure in these fields.

## Verification Summary
After reviewing all 13 files mentioned in the error messages:

✅ **ALL ISSUES FIXED**:

### Article Templates:
- `article.can-we-wear-alpaca-summer.json` - Fixed `left_heading` (2 instances), `right_heading` (1 instance), `left_text`, and `right_text` in `title-and-text` sections. Also removed invalid `style` attributes from `<p>` and `<a>` tags.
- `article.open-range-alpacas.json` - Fixed `left_heading` (1 instance) and `right_text` in `title-and-text` section
- `article.what-is-alpaca-wool.json` - Fixed `left_heading` (1 instance) and `right_text` in `title-and-text` section

### Collection Templates:
- `collection.reinvent.json` - Fixed `text` fields in `scrolling-text` blocks (wrapped `{{ collection.title }}` in `<p>` tags)

### Index Templates:
- `index.glamour.json` - Fixed `text` fields in `scrolling-text` blocks (wrapped all plain text values in `<p>` tags)
- `index.reinvent.json` - Fixed `text` fields in `scrolling-text` blocks (wrapped all plain text values in `<p>` tags)
- `index.sunshine.json` - Fixed `text` fields in `scrolling-text` blocks (wrapped all plain text values in `<p>` tags)

### Page Templates:
- `page.about.json` - Fixed `text` fields in `scrolling-text` blocks (wrapped "SUMMER EDIT", "ICONIC GOODS", "READY TO WEAR", "HAUTE COUTURE" in `<p>` tags)
- `page.about.sunshine.json` - Fixed `text` fields in `scrolling-text` blocks
- `page.cashmere.json` - Fixed `text` fields in `scrolling-text` blocks (wrapped "Sunset glow" in `<p>` tags)

### Product Templates:
- `product.pre-order.json` - Fixed `text` fields in `scrolling-text` blocks
- `product.reinvent.json` - Fixed `text` fields in `background-video` section, gallery sections, and `scrolling-text` blocks
- `product.sunshine.json` - Fixed `text` fields in `scrolling-text` blocks

**Status**: All HTML structure validation errors have been resolved. All `richtext` fields now have proper top-level HTML tags (`<p>`, `<ul>`, `<ol>`, or `<h1>`-`<h6>`).

## Affected Files

### Article Templates (right_text issues):
1. `templates/article.can-we-wear-alpaca-summer.json`
2. `templates/article.open-range-alpacas.json`
3. `templates/article.what-is-alpaca-wool.json`

### Collection Templates (text issues):
4. `templates/collection.reinvent.json`

### Index Templates (text issues):
5. `templates/index.glamour.json`
6. `templates/index.reinvent.json`
7. `templates/index.sunshine.json`

### Page Templates (text issues):
8. `templates/page.about.json`
9. `templates/page.about.sunshine.json`
10. `templates/page.cashmere.json`

### Product Templates (text issues):
11. `templates/product.pre-order.json`
12. `templates/product.reinvent.json`
13. `templates/product.sunshine.json`

## Fix Strategy

### Step 1: Identify the Problematic Fields
For each file, locate:
- `right_text` fields in `title-and-text` sections
- `text` fields in various sections (rich-text, image-with-text, etc.)

### Step 2: Fix HTML Structure
For each problematic field:

1. **If field is empty string (`""`)**: Leave as is (empty is valid)

2. **If field contains plain text (no HTML tags)**:
   - Wrap the entire content in `<p>` tags
   - Example: `"text": "Some text"` → `"text": "<p>Some text</p>"`

3. **If field contains HTML with inline tags but no top-level tags**:
   - Wrap the entire content in `<p>` tags
   - Example: `"text": "Text with <b>bold</b> and <br>break"` → `"text": "<p>Text with <b>bold</b> and <br>break</p>"`

4. **If field contains line breaks (`\n`)**:
   - Replace `\n` with `<br>` and wrap in `<p>` tags
   - Or split into multiple `<p>` tags if appropriate

5. **If field already has proper structure**:
   - Verify it starts with valid top-level tags
   - Leave as is if valid

### Step 3: Specific Fixes Needed (VERIFIED)

#### Article Templates:
1. **`article.can-we-wear-alpaca-summer.json`**:
   - Section `title_and_text_KKDYBy`:
     - `left_text`: Plain text without `<p>` tags - "Alpaca wool helps to protect your skin from the rays of the sun..."
     - `right_text`: Plain text without `<p>` tags - "All products are anti-bacterial and odor-resistant..."

2. **`article.open-range-alpacas.json`**:
   - Section `title_and_text_EKwjU6`:
     - `right_text`: Contains HTML (`<b>`, `<br>`) but NOT wrapped in `<p>` tags - "An alpaca's day begins before the sun rises with a two hour hike up the mountains. <b>Once reaching 5000 meters altitude...</b>"

3. **`article.what-is-alpaca-wool.json`**:
   - Section `title_and_text_DeE3G4`:
     - `right_text`: Plain text without `<p>` tags - "Almost 600 years ago, the Inca Empire called the Alpaca: The Fiber of the Gods..."

#### Product Templates:
4. **`product.reinvent.json`**:
   - Section `b0489ba4-fdb2-4043-8efe-5d9739ec5323` (type: `background-video`):
     - `text`: Plain text without `<p>` tags - "The lightweight gel-cream formula has a pillowy, bouncy feel..."
   - Gallery sections (multiple):
     - `text`: Plain text without `<p>` tags - "Pair text with an image to focus on your chosen image" (appears 3 times)

#### Collection/Index/Page Templates:
- Need to verify: `collection.reinvent.json`, `index.glamour.json`, `index.reinvent.json`, `index.sunshine.json`, `page.about.json`, `page.about.sunshine.json`, `page.cashmere.json`, `product.pre-order.json`, `product.sunshine.json`
- These files may have `text` fields in section settings (not block settings) that need fixing

## Implementation Steps

1. Read each problematic file
2. Parse JSON to find all `text` and `right_text` fields
3. Check each field's content:
   - If empty: skip
   - If already wrapped in valid top-level tags: skip
   - If not wrapped: fix according to strategy above
4. Update the JSON file with corrected HTML
5. Verify JSON is still valid after changes
6. Test that the fix resolves the validation error

## Notes
- Preserve all existing HTML formatting (bold, links, etc.)
- Maintain line breaks where appropriate
- Ensure JSON structure remains valid
- Escape special characters properly in JSON strings

## Specific Examples Found

### Example 1: article.can-we-wear-alpaca-summer.json
**Section: `title_and_text_KKDYBy`**

**Current (INVALID):**
```json
"left_text":"Alpaca wool helps to protect your skin from the rays of the sun. How come? Wool absorbs UV radiation providing protection from the sun, just as it does for alpacas grazing in the fields all day long.\n\nAlthough wearing alpaca wool doesn't mean that you should not put sun cream on, especially if you have a white skin like me! It is just another layer of protection against UV radiation."
"right_text":"All products are anti-bacterial and odor-resistant. Which is a huge advantage in the summer sun, doing outdoor activities. We definitely sweat! Alpaca fiber naturally wicks away sweat without absorbing it. Each time I wear it, me and my clothes stay dry, keeping my body protected.\n\nAlpaca wool does not need to be washed because of its anti-bacterial properties and low moisture absorption. Instead of washing, I air out my gear.\nSave time, water and help save the planet!"
```

**Fixed (VALID):**
```json
"left_text":"<p>Alpaca wool helps to protect your skin from the rays of the sun. How come? Wool absorbs UV radiation providing protection from the sun, just as it does for alpacas grazing in the fields all day long.</p><p>Although wearing alpaca wool doesn't mean that you should not put sun cream on, especially if you have a white skin like me! It is just another layer of protection against UV radiation.</p>"
"right_text":"<p>All products are anti-bacterial and odor-resistant. Which is a huge advantage in the summer sun, doing outdoor activities. We definitely sweat! Alpaca fiber naturally wicks away sweat without absorbing it. Each time I wear it, me and my clothes stay dry, keeping my body protected.</p><p>Alpaca wool does not need to be washed because of its anti-bacterial properties and low moisture absorption. Instead of washing, I air out my gear.</p><p>Save time, water and help save the planet!</p>"
```

### Example 2: article.open-range-alpacas.json
**Section: `title_and_text_EKwjU6`**

**Current (INVALID):**
```json
"right_text":"An alpaca's day begins before the sun rises with a two hour hike up the mountains. <b>Once reaching 5000 meters altitude, they wander the Peruvian Andes freely without any fences.</b> Their fibers absorb more sunlight and taken in the stronger winds. Their wool was made for this intense natural environment. Close to sunset, the owners guide them down to their farmlands below at 3000 meters. Still free from boundaries, alpacas taken the cold fresh air. Although, temperatures drop below freezing point during the night, alpacas are warmed their insulating wool. \n<br><br>\nAn alpaca's life is more important to their owner than their wool. Since Inca Empire, alpacas are a highly respected animal and if an alpaca cannot regrow the same quality fibers; they are still apart of the farmland. Once an alpaca dies of natural causes then they are used for meat."
```

**Fixed (VALID):**
```json
"right_text":"<p>An alpaca's day begins before the sun rises with a two hour hike up the mountains. <b>Once reaching 5000 meters altitude, they wander the Peruvian Andes freely without any fences.</b> Their fibers absorb more sunlight and taken in the stronger winds. Their wool was made for this intense natural environment. Close to sunset, the owners guide them down to their farmlands below at 3000 meters. Still free from boundaries, alpacas taken the cold fresh air. Although, temperatures drop below freezing point during the night, alpacas are warmed their insulating wool.</p><p>An alpaca's life is more important to their owner than their wool. Since Inca Empire, alpacas are a highly respected animal and if an alpaca cannot regrow the same quality fibers; they are still apart of the farmland. Once an alpaca dies of natural causes then they are used for meat.</p>"
```

### Example 3: article.what-is-alpaca-wool.json
**Section: `title_and_text_DeE3G4`**

**Current (INVALID):**
```json
"right_text":"Almost 600 years ago, the Inca Empire called the Alpaca: The Fiber of the Gods. Only the royalty were allowed to use such precious fibers. Hundreds of years later, the alpaca became a necessity for Peruvian people's everyday life. Living in high altitudes, alpacas grow wool that naturally adapt to different climates. This fiber is known as Nature's Superior Function Fiber."
```

**Fixed (VALID):**
```json
"right_text":"<p>Almost 600 years ago, the Inca Empire called the Alpaca: The Fiber of the Gods. Only the royalty were allowed to use such precious fibers. Hundreds of years later, the alpaca became a necessity for Peruvian people's everyday life. Living in high altitudes, alpacas grow wool that naturally adapt to different climates. This fiber is known as Nature's Superior Function Fiber.</p>"
```

### Example 4: product.reinvent.json
**Section: `b0489ba4-fdb2-4043-8efe-5d9739ec5323` (background-video)**

**Current (INVALID):**
```json
"text": "The lightweight gel-cream formula has a pillowy, bouncy feel that blends seamlessly and leaves cheeks dewy, not streaky or chalky"
```

**Fixed (VALID):**
```json
"text": "<p>The lightweight gel-cream formula has a pillowy, bouncy feel that blends seamlessly and leaves cheeks dewy, not streaky or chalky</p>"
```

## Implementation Summary

All issues have been successfully resolved. The problematic `text` fields were found in `scrolling-text` block settings (not section settings), which required wrapping plain text values and Liquid variables in `<p>` tags.

### Key Findings:
- **Article templates**: Issues were in `title-and-text` section fields (`left_heading`, `right_heading`, `left_text`, `right_text`)
- **Collection/Index/Page/Product templates**: Issues were in `scrolling-text` block `text` fields, not section settings
- **Solution**: All plain text values and Liquid variables (e.g., `{{ collection.title }}`) were wrapped in `<p>` tags

## Verification Notes
- ✅ All 13 files have been fixed and verified
- ✅ All `richtext` fields now have proper top-level HTML tags
- ✅ No remaining validation errors found in the affected files
- ✅ JSON structure remains valid after all changes


# Custom product photography

Drop the 12 generated JPGs here, named exactly to match each product's slug. **You can do this incrementally** — uncomment one slug at a time in `lib/mock-data.ts` and only that product swaps to the local photo.

```
campus-comfort-hamper.jpg
executive-leather-set.jpg
nurse-restore-bundle.jpg
thanksgiving-harvest-basket.jpg
romance-deluxe-box.jpg
graduation-keepsake-bundle.jpg
kids-celebration-box.jpg
office-pickme-up-hamper.jpg
anniversary-gold-hamper.jpg
study-snack-stack.jpg
faith-blessings-hamper.jpg
mums-treasure-hamper.jpg
```

Square 1:1 aspect, 1024×1024 from DALL·E 3 is fine. Generation prompts: [`docs/photography-prompts.md`](../../docs/photography-prompts.md).

**Workflow for each photo:**
1. Generate it via DALL·E 3 using the prompt for that slug
2. Save the JPG into this folder using the exact filename above
3. Open `lib/mock-data.ts`, uncomment the matching slug in the `CUSTOM_PHOTOGRAPHY` Set
4. That product card now shows the local photo. The other 11 keep using Unsplash until you do the same for them.

# Tools to Apps Migration Plan

## Goal Description
Rename the "Tools" section to "Apps" and update its visual style to match the "MiniText" page (white background).

## Proposed Changes

### 1. Directory Structure
- Rename `src/app/tools` directory to `src/app/apps` to change the route from `/tools` to `/apps`.

### 2. Code Updates
#### [MODIFY] src/app/apps/page.tsx (formerly tools/page.tsx)
- Change component name `ToolsPage` to `AppsPage`.
- Update text "Tools" to "Apps".
- Update styling to match MiniText:
  - Add `fontFamily: 'var(--font-geist-sans)'`.
  - Increasing font weight to `900`.
  - Change color to `black`.
  - Adjust margins and sizing to match MiniText.
- Update background color to `white`.

#### [MODIFY] src/components/Navigation.tsx
- Update navigation link:
  - `href: '/tools'` -> `href: '/apps'`
  - `label: 'Tools'` -> `label: 'Apps'`

#### [MODIFY] src/components/ToolCard.tsx
- Ensure component handles white background correctly (it currently uses `styles.card` which likely needs verification in `ToolCard.module.css`).

### 3. Styling (CSS Modules)
#### [MODIFY] src/app/apps/page.module.css (formerly tools/page.module.css)
- Replicate `minitext.module.css` styles for consistency:
  - `main`: `backgroundColor` to `white`.
  - `title`: Adjust font size, weight, and color (black).
  - `grid`: Ensure card layout works with white background.

#### [MODIFY] [page.tsx](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/app/minitext/[slug]/page.tsx)
add `generateMetadata` to set dynamic title and description.

#### [VERIFY]
Check if `opengraph-image.tsx` is correctly generating the image. If not, debug.

#### [MODIFY] [Scene3D.module.css](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/components/Scene3D.module.css)
Add styles for `.socialLinks` and `.socialIcon`.

#### [MODIFY] [Scene3D.tsx](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/components/Scene3D.tsx)
Add social icons markup with inline SVGs for Twitter and Instagram.

#### [MODIFY] [Scene3D.tsx](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/components/Scene3D.tsx)
Add text-based social links for mobile layout, positioned below the control panel.

#### [MODIFY] [Scene3D.module.css](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/components/Scene3D.module.css)
Style the new text links to be visible only on mobile and positioned correctly below the controls.

#### [MODIFY] [Navigation.tsx](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/components/Navigation.tsx)
Add a sub-header below the main navigation to display "Twitter / Instagram" text links.

#### [MODIFY] [Navigation.module.css](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/components/Navigation.module.css)
Style the new sub-header to sit directly below the navigation border, ensuring it is fixed and visible on all devices.

#### [MODIFY] [Scene3D.tsx](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/components/Scene3D.tsx)
Remove the previously added social icons and mobile text links.

#### [MODIFY] [Scene3D.module.css](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/components/Scene3D.module.css)
Remove styles related to social icons and mobile links.

#### [NEW] [CopyLinkButton.tsx](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/components/CopyLinkButton.tsx)
Create a Client Component that:
- Uses `navigator.clipboard.writeText` to copy `window.location.href`.
- Shows a temporary "Copied!" state.
- Is styled as a small, unobtrusive button.

#### [NEW] [CopyLinkButton.module.css](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/components/CopyLinkButton.module.css)
Styles for the button.

#### [MODIFY] [page.tsx](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/app/minitext/[slug]/page.tsx)
- Import `CopyLinkButton`.
- Update `header` structure to include a `meta` div containing both the date and the button.

#### [MODIFY] [post.module.css](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/app/minitext/[slug]/post.module.css)
- Add `.meta` class to align date and button horizontally.

## Verification Plan
### Automated Tests
- Build verification (`npm run build`).

### Manual Verification
- Navigate to http://localhost:3000/apps
- Check if the page title is "Apps".
- Verify the background is white.
- Verify the navigation menu shows "Apps" and links correctly.

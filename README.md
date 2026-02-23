# Rapid City Transportation Hub – SPFx Landing Page

Production-ready SharePoint Framework (SPFx) React web part for the **Rapid City Transportation Hub** intranet homepage.

## Requirements

- **Node.js**: Use **v18.x** (e.g. 18.17.1 or later within 18) for `gulp build`.  
  SPFx 1.18 does not support Node 20. Use [nvm-windows](https://github.com/coreybutler/nvm-windows) or similar to switch: `nvm use 18`
- **npm**: 6.x or later
- **SharePoint**: Modern site (SharePoint Online or supported on-prem)

## Quick Start

```bash
npm install
npx gulp build
```

To serve locally (workbench):

```bash
npx gulp serve
```

## What’s Included

- **Web part**: `RapidCityHomepageWebPart` – full-page layout (header, nav, hero, daily highlight, quick links, footer).
- **Theme**: `src/webparts/rapidCityHomepage/theme/ThemeTokens.ts` and `themeVariables.scss` – tokens for primary/secondary, background, surface, text, borders, accents; 8px spacing grid.
- **Configurable**:
  - **Quick links**: Property pane “Quick Links (JSON)” – array of `{ "label": "...", "url": "...", "iconName": "..." }`. Default set: Employee Directory, Contact Cards, ADP, Teams, Outlook, Five9, RISE Hub.
  - **Contact Cards page URL**: Used when user submits search – redirect to Contact Cards with `?q=...`.
  - **Feedback URL**: “Send Feedback” link in footer.
- **Search**: Search bar submits to Contact Cards page via `window.location.assign` with query string `q=...`. Update `contactCardsPageUrl` in the property pane to your real page (e.g. `/sites/intranet/SitePages/ContactCards.aspx`).
- **Navigation**: “Department Hubs” and “Employee Support” are dropdowns; update `DEPARTMENT_HUBS_OPTIONS` and `EMPLOYEE_SUPPORT_OPTIONS` in `Navigation.tsx` with real intranet links.
- **Accessibility**: Skip-to-content link, semantic HTML (`header`, `nav`, `main`, `footer`), ARIA labels on icon buttons, focus outlines, high contrast (dark text on light). Aimed at WCAG AA.
- **Reusable component**: `<InfoTooltipIcon text="..." />` – Fluent Tooltip + Info icon; used in Daily Highlight and reusable in Contact Cards.

## Where to Update URLs

- **Contact Cards (search target)**  
  Web part property pane → “Contact Cards page URL (for search redirect)”  
  Or default in `RapidCityHomepageWebPart.ts`: `contactCardsPageUrl`

- **Feedback link**  
  Web part property pane → “Send Feedback link URL”  
  Or default in `RapidCityHomepageWebPart.ts`: `feedbackUrl`

- **Nav dropdown links**  
  `src/webparts/rapidCityHomepage/components/Navigation/Navigation.tsx`:  
  - `DEPARTMENT_HUBS_OPTIONS`  
  - `EMPLOYEE_SUPPORT_OPTIONS`  
  - “Training Hub” and “Home” `href` values

- **Quick links**  
  Either configure in the property pane (JSON) or change `DEFAULT_QUICK_LINKS` in `RapidCityHomepageWebPart.ts`.

## Package & Deploy

```bash
npx gulp bundle --ship
npx gulp package-solution --ship
```

Output: `sharepoint/solution/rapid-city-transportation-hub.sppkg`. Upload to your app catalog and deploy.

## Tech Stack

- SPFx 1.18.2, React 17, TypeScript 4.7
- Fluent UI React 8 (`@fluentui/react`) – SearchBox, Icon, IconButton, Dropdown, TooltipHost
- CSS Modules (`.module.scss`) for all styles; no global CSS
- Theme tokens in TypeScript + SCSS variables for consistency and WCAG contrast

## File Summary

| Path | Purpose |
|------|--------|
| `src/webparts/rapidCityHomepage/RapidCityHomepageWebPart.ts` | Web part entry, property pane, quick links parsing |
| `src/webparts/rapidCityHomepage/components/RapidCityHomepage.tsx` | Main layout, search handler, skip link, theme vars |
| `src/webparts/rapidCityHomepage/components/Header/` | Branding, search bar, utility icons |
| `src/webparts/rapidCityHomepage/components/Navigation/` | Nav row + Department Hubs / Employee Support dropdowns |
| `src/webparts/rapidCityHomepage/components/Hero/` | Welcome title + subtitle |
| `src/webparts/rapidCityHomepage/components/DailyHighlight/` | Olympics-style highlight card + InfoTooltipIcon example |
| `src/webparts/rapidCityHomepage/components/QuickLinks/` | Config-driven quick link tiles |
| `src/webparts/rapidCityHomepage/components/Footer/` | Copyright, Send Feedback, Last Updated |
| `src/webparts/rapidCityHomepage/components/InfoTooltipIcon/` | Reusable info tooltip (Fluent Tooltip + Info icon) |
| `src/webparts/rapidCityHomepage/theme/ThemeTokens.ts` | Theme token types and defaults |
| `src/webparts/rapidCityHomepage/theme/themeVariables.scss` | CSS custom properties (--rct-*) |

# Astro Site Structure

## Recommended Project Structure

```text
src/
  pages/
    index.astro
  components/
    Header.astro
    Hero.astro
    Welcome.astro
    Location.astro
    Hotels.astro
    DressCode.astro
    Food.astro
    RsvpForm.astro
    MusicPlayer.astro
    Footer.astro
  layouts/
    BaseLayout.astro
  styles/
    global.css
public/
  audio/
    wedding-track.mp3
  images/
```

## Component Responsibilities

### Header.astro

- Site brand: G + L
- Anchor links to page sections
- RSVP call-to-action
- Mobile-friendly navigation

### Hero.astro

- Save the Date heading
- Couple names
- Wedding date
- Optional visual treatment or background

### Welcome.astro

- Welcome copy
- Adults-only note

### Location.astro

- Reception time
- Venue and address
- Google Maps link
- Getting there notes

### Hotels.astro

- Hotel cards grouped by budget, mid-range, and luxury
- External hotel links

### DressCode.astro

- Dress code copy

### Food.astro

- Food and entertainment cards
- Ffwrnes Pizza details
- TBC placeholder content

### RsvpForm.astro

- Form markup
- Client-side validation where useful
- Turnstile widget
- Submit to `/api/rsvp`
- Success and error states

### MusicPlayer.astro

- Audio element for the music track
- First-interaction playback script
- Fallback play/pause control

### Footer.astro

- Names
- Date and location summary

## Content Approach

For the first version, content can live directly in Astro components. This keeps the rebuild simple and easy to edit.

If content changes become frequent, move repeated or structured content into:

```text
src/content/site.ts
```

or:

```text
src/data/site.ts
```

## Styling Approach

- Use a single global stylesheet initially.
- Prefer semantic HTML and CSS custom properties.
- Avoid a heavy UI framework unless there is a clear need.
- Match the current visual tone while keeping the implementation simple.
- Test the page at desktop and mobile widths.

## Build Output

Cloudflare Pages should serve the Astro static build from:

```text
dist
```

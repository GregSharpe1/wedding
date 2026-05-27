# Wedding Website Rebuild Plan

## Goal

Rebuild the existing Lovable wedding website as a self-managed Astro project hosted on Cloudflare.

The first production version should be simple, fast, and maintainable. It should preserve the current site content and feel while moving ownership into this repository.

## Source Site

- Current URL: https://wedding-notes-app.lovable.app/
- Current title: The Sharpes — Wedding
- Couple: Greg + Lucy
- Date: Sunday 30th May 2027
- Location: Tramshed, Clare Road, Cardiff CF11 6QP

## Target Stack

- Astro for the frontend
- Cloudflare Pages for hosting
- Cloudflare Pages Functions for the RSVP API
- Cloudflare D1 for RSVP storage
- Cloudflare Turnstile for spam protection
- Cloudflare DNS and SSL for the production domain

## First Release Scope

- Rebuild the single-page wedding website.
- Add sections for save the date, welcome, venue, travel, hotels, dress code, food, RSVP, and footer.
- Add an RSVP form backed by Cloudflare D1.
- Add a short music track that attempts playback when the visitor first scrolls or otherwise interacts with the page.
- Include a small fallback play/pause control if browser autoplay restrictions block playback.
- Deploy on Cloudflare Pages.

## Deferred Scope

- RSVP admin page.
- CSV export endpoint.
- Email notifications for new RSVPs.
- Guest-specific invite links.
- Password protection.
- Multi-page CMS-style editing.

## Key Browser Constraint

Browsers generally block autoplaying audio with sound until the visitor interacts with the page. The implementation should attempt playback on the first scroll, wheel, touch, pointer, or keyboard interaction. If playback is blocked, the site should show a subtle manual play control.

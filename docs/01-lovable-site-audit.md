# Lovable Site Audit

## Inspected Site

- URL: https://wedding-notes-app.lovable.app/
- Title: The Sharpes — Wedding
- Type: Single-page wedding website

## Navigation

Current navigation anchors:

- Save the Date
- Welcome
- Location & Time
- Dress Code
- Food
- RSVP

## Page Sections

### Header

- Brand text: G + L
- Anchor navigation to page sections
- RSVP call-to-action link

### Save the Date

- Heading: Save the Date
- Names: Greg + Lucy
- Date: Sunday 30th May 2027

### Welcome

- Heading: Welcome
- Main message welcoming guests to the wedding website
- Adults-only note

Current text:

> Welcome to our wedding website. We're so happy to have you here, and we can't wait to celebrate this special day with you. All the details you need are right here, and we're looking forward to seeing you on the dance floor!

> We love your children, but we hope you can join us for an evening of adults-only festivities.

### Location & Time

- Label: Reception
- Time: 4:00 PM — 11:00 PM
- Venue: Tramshed
- Address: Tramshed, Clare Road, Cardiff CF11 6QP
- Description: All guests welcome. Dinner, drinks and dancing in the old tram depot.
- Map link: https://www.google.com/maps/search/?api=1&query=Tramshed%2C%20Clare%20Road%2C%20Cardiff%20CF11%206QP

### Getting There

- Cardiff Central
- Closest train station, approximately 15 minutes on foot
- Taxis available outside the station
- Parking note for on-site and nearby parking
- Free street parking after 6pm
- Additional paid parking near NCP Clare Road and Capitol Centre

### Hotels

Budget:

- Travelodge Cardiff Central
- Approximately 20 minute walk, 5 minute taxi
- URL: https://www.travelodge.co.uk/hotels/504/Cardiff-Central-Queen-Street-hotel

Mid-range:

- Hotel Indigo Cardiff
- Approximately 20 minute walk, 5 minute taxi
- URL: https://www.ihg.com/hotelindigo/hotels/gb/en/cardiff/cdfin/hoteldetail

Luxury:

- voco St. David's Cardiff
- Approximately 15 minute taxi, Cardiff Bay
- URL: https://www.ihg.com/voco/hotels/gb/en/cardiff/cwlbr/hoteldetail

### Dress Code

- Heading: Dress Code
- Text: Our dress code is relaxed and fun — think casual party vibes!

### Food & Entertainment

- Ffwrnes Pizza
- Wood-fired Neapolitan-style pizza
- Instagram: https://www.instagram.com/ffwrnes/
- Placeholder second food/entertainment item marked as TBC

### RSVP

- Heading: RSVP
- Deadline: by the first of May
- Fields visible on the current site:
  - Full name
  - Email
  - Will you attend?
  - Number of guests including you
  - Dietary restrictions or allergies
  - Song request for the Spotify playlist
  - A note for the couple

### Footer

- Greg + Lucy
- 30 · 05 · 2027 — Cardiff

## Rebuild Notes

- Preserve the current one-page structure for the first release.
- Remove the Lovable badge and dependency on Lovable hosting.
- Recreate the design in maintainable Astro components rather than copying generated app code.
- Keep text content editable in obvious component files for the first release.
- Later, move content into a dedicated data file if editing becomes frequent.

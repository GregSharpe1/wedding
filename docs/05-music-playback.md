# Music Playback

## Requirement

The site should play a short two-minute track when the user begins to scroll the page, without requiring a dedicated manual start button in the normal path.

## Browser Limitation

Modern browsers usually block audio with sound until the visitor interacts with the page. A scroll, wheel, touch, keyboard, or pointer event usually counts as interaction, but behavior can vary across browsers and devices.

The implementation should attempt to start music on first interaction, prioritising scroll-related interactions.

## Audio File

Recommended location:

```text
public/audio/wedding-track.mp3
```

Recommended format:

- MP3
- Approximately 2 minutes
- Compressed to roughly 2-5 MB if possible

## Playback Behaviour

Initial behaviour:

- Render an `<audio>` element without autoplay.
- Listen for the first qualifying user interaction.
- Try to call `audio.play()`.
- Remove first-interaction listeners after the first attempt succeeds.
- Show a subtle play/pause control if playback fails or is blocked.

Qualifying events:

```text
wheel
touchstart
scroll
pointerdown
keydown
```

## Fallback Control

Even though the preferred flow is scroll-started playback, include a small fallback control so the experience is not broken on stricter browsers.

Suggested placement:

- Bottom-right fixed control
- Small and unobtrusive
- Visible when playback is blocked or once playback has started

## Accessibility And UX

- Always allow users to pause the music.
- Do not loop by default unless explicitly desired.
- Keep the audio volume reasonable.
- Avoid blocking page content with the player.
- Do not hide controls from keyboard users if fallback is visible.

## Legal Note

Use a track you have the right to publish. If the site is public, avoid uploading copyrighted commercial music unless licensed for public web use.

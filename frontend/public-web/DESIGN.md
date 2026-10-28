# GOPU Public Web - Design Direction

## Brand

- Use the supplied `public/brand/gopu-logo.png` as the source for the header and footer mark. Keep the original logo file unchanged.
- Island teal `#087F78` is the primary action color. Logo blue remains inside the logo asset; do not introduce blue action buttons.
- Light canvas `#F5F8F7`, white surfaces, deep ink `#132C32`, muted text `#52666A`, and borders `#DCE8E5`.
- The supplied master logo has a white background, so this demo keeps one consistent light theme until a transparent or dark brand asset is available.

## Typography

- Be Vietnam Pro, self-hosted by `next/font`, for Vietnamese and English content.
- Headlines use weight 800 and controlled line length; body text uses relaxed line height.
- Inputs and small labels remain readable at mobile sizes. Primary actions stay on one line.

## Layout and Interaction

- Keep the existing navigation and customer flows. Desktop uses a split hero; below 768px it becomes one column.
- Make forms visibly labeled, with at least 44px touch targets and clear focus states.
- Service and itinerary controls group related choices without truncating selected values.
- Use restrained hover and press feedback. Respect reduced-motion settings.
- Show source and update time for live weather, and label all sample prices and requests as demo content.

## Avoid

- Generic AI branding, decorative text over photography, neon glows, tiny controls, overlapping content, and unsupported claims about real availability or booking.

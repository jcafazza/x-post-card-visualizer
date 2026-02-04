/**
 * Card Dimension and Interaction Constants
 * 
 * Standard values for the post card's physical properties and 
 * interactive boundaries.
 */

/** Minimum allowed width for the card in pixels */
export const CARD_MIN_WIDTH = 350

/** Maximum allowed width for the card in pixels */
export const CARD_MAX_WIDTH = 700

/** Default card width when initialized or reset */
export const CARD_DEFAULT_WIDTH = 500

/** Card border width in pixels (used for gradient plate inset, etc.) */
export const CARD_BORDER_WIDTH = 1

/** Default border radius for the card in pixels */
export const CARD_DEFAULT_RADIUS = 20

/** Maximum allowed border radius for the card in pixels */
export const CARD_MAX_RADIUS = 40

/** The size of the interactive "hit zone" for corner resizing in pixels */
export const CARD_CORNER_ZONE = 24

/** Length of the resize handles in pixels */
export const CARD_HANDLE_LENGTH = 12

/** Space from viewport edge to the resize handle edge when viewport shrinks (px). */
export const CARD_VIEWPORT_MARGIN = 28

/** Width resize handles extend this far outside the card (px). Used with CARD_VIEWPORT_MARGIN so card + handles stay within viewport. */
export const CARD_HANDLE_OVERHANG = 20

/** Space from viewport edge to card when there are no resize handles (share link, mobile placeholder). Matches semantic spacing (e.g. 24px ≈ spacing-6). */
export const CARD_VIEWPORT_MARGIN_LOCKED = 24

/** Maximum overshoot distance for rubberband effect when dragging beyond max width (in pixels) */
export const RUBBERBAND_MAX_OVERSHOOT = 30

/** Spacing below the card for the "View original post" button (in pixels) */
export const CARD_BOTTOM_MARGIN = 20

/** Vertical space between the card bottom edge and the "View original post" button (in pixels) */
export const CARD_BOTTOM_TO_VIEW_ORIGINAL_GAP = 48

/** Maximum height of post image areas (single or row) so wide cards don't show oversized image blocks (in pixels) */
export const POST_IMAGE_MAX_HEIGHT = 200

/** Height of the gradient plate behind the "View original post" button (fade from transparent to solid), clipped to card bottom. In pixels. */
export const VIEW_ORIGINAL_PLATE_HEIGHT = 120

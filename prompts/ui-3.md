Here is the updated ASCII wireframe and description for Global Template page:

### **Revised ASCII Wireframe (With Layout Constraints)**

This version illustrates the precise alignment and sizing relationships between the canvas, the vertical filmstrip, and the instruction input bar.

```ascii
+----------------------+----------------------------------------------------+
|                      | [MAIN CONTENT AREA - REVISED LAYOUT]               |
|  RenderCam AI        |                                                    |
|                      |                                                    |
|  Dashboard           |   +---------------------------------+ +--------+   |
|                      |   |                                 | |        |   |
|  FEATURES            |   |    [  Upload Product Image  ]   | | Thumb  |   |
|   - Virtual Photoshoot |   |                                 | |   01   |   |
|   - Virtual Models   |   |        or select from           | |        |   |
|   - UGC-Style Shots  |   |                                 | +--------+   |
|                      |   | [Demo Img] [Demo Img] [Demo Img]| |        |   |
|                      |   +---------------------------------+ | Thumb  |   |
|                      |   ^-- Canvas & Filmstrip have same height --^ |   02   |   |
|                      |                                     |        |   |
|                      |                                     +--------+   |
|                      |                                                    |
|                      |   +--------------------------------------------+   |
|                      |   |  Additional Instruction (optional)       [>] |   |
|                      |   +--------------------------------------------+   |
|                      |   ^-- Input spans combined width of above columns --^|
|  (!) LOGOUT          |                                                    |
+----------------------+----------------------------------------------------+
```

### **Updated Layout Rules & Description**

Here are the specific implementation rules for the frontend developer and designer based on your constraints:

1.  **Canvas and Filmstrip Vertical Alignment:**

      * The `VerticalFilmstrip` column's height must be **exactly equal** to the `Canvas` component's height.
      * These two components should be top-aligned, forming a single, cohesive rectangular block.

2.  **Instruction Input Full-Width Span:**

      * The `InstructionInput` component is positioned directly beneath the Canvas/Filmstrip block.
      * Its width must **span the total combined width** of the `Canvas`, the `VerticalFilmstrip`, and any spacing (i.e., gutter or gap) between them.

#### **Developer Note:**

This layout can be efficiently achieved using CSS. A recommended approach would be:

  * A primary `div` container for the upper section with `display: flex` or `display: grid`.
      * This container would hold the `Canvas` and `VerticalFilmstrip` components as its children.
  * The `InstructionInput` component would be a separate element placed after this primary container, with its width set to `100%` of their shared parent.
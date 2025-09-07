
### "UGC-Style Shots" Narrative Template

```
Analyze the provided product image. Using the product, create an authentic, realistic, user-generated style photograph suitable for social media content and customer reviews.

[shot_composition_description] The setting is a [background_description] background that suits the product.

[photo_style_description] The final image should feel genuine and spontaneous, avoiding any overly polished or professional studio appearance. The composition must adhere to a [aspect_ratio] aspect ratio.
```

-----

### Backend Logic: Populating the Template

Your application backend will populate the `[bracketed_placeholders]` based on the user's selections.

**1. For `[shot_composition_description]`:**

  * **If `Product Only`:** Replace with: `"The shot is a simple, clear photo focusing only on the product in an everyday setting."`
  * **If `First-Person View (POV)`:** Replace with: `"The shot is from a first-person point of view (POV), looking down at the product as if being used by the viewer."`
  * **If `Selfie with Product`:** Replace with: `"The shot is a casual selfie-style photo, featuring a person happily holding and showcasing the product."`
  * **If `Candid Action`:** Replace with: `"The shot is a candid action photo, capturing a person naturally using the product without posing for the camera."`

**2. For `[background_description]`:**

  * **If `Auto`:** Replace with an empty string.
      * *Resulting line:* `"The setting is a background that suits the product."`
  * **If `Preset` -\> `Indoor` or `Outdoor`:** Replace with the selected style.
      * *Resulting line:* `"The setting is a [Style from Dropdown] background that suits the product."` (e.g., "Cafe", "Beach")
  * **If `Upload`:** Replace with: `"user-provided background, ensuring the product is integrated in a realistic, non-professional manner"`
  * **If `Describe`:** Replace with: `"custom environment described as: '[User's Text Description]'"`

**3. For `[photo_style_description]`:**

  * **If `Modern Smartphone (Clear)`:** Replace with: `"The photo should look like it was taken on a modern high-end smartphone: crisp, clear, with natural, bright daylighting."`
  * **If `Action Shot (Slight Blur)`:** Replace with: `"The photo should feel dynamic, with a slight, natural motion blur on the background or action to convey movement. The product itself should remain relatively in focus."`
  * **If `Golden Hour`:** Replace with: `"The photo should be taken during the golden hour, with warm, soft, low-angled sunlight creating a beautiful, atmospheric glow."`

**4. For `[aspect_ratio]`:**

  * Replace with the selected ratio, e.g., `"1:1 square"`, `"4:5 portrait"`.

-----

### Filled-Out Prompt Example

**User Selections:**

  * **Background**: `[Preset]` -\> `[Indoor]` -\> `[At Home]`
  * **Photo Style**: `[Golden Hour]`
  * **Shot Composition**: `[First-Person View (POV)]`
  * **Output**: `[Portrait (4:5)]`

**Generated Prompt for the API:**

> Analyze the provided product image. Using the product, create an authentic, realistic, user-generated style photograph suitable for social media content and customer reviews.
>
> The shot is from a first-person point of view (POV), looking down at the product as if being used by the viewer. The setting is a At Home background that suits the product.
>
> The photo should be taken during the golden hour, with warm, soft, low-angled sunlight creating a beautiful, atmospheric glow. The final image should feel genuine and spontaneous, avoiding any overly polished or professional studio appearance. The composition must adhere to a 4:5 portrait aspect ratio.
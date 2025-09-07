Here is the new narrative prompt template for the "Virtual Models" feature, built according to your specifications and the new logic.

This template is designed to seamlessly integrate a human model with the user's product, creating a realistic lifestyle or e-commerce photograph.

### "Virtual Models" Narrative Template

```
Analyze the provided product image. Using the product, create a hyperrealistic and professional photograph intended for high-end e-commerce, lifestyle advertising, and social media campaigns.

The image must feature a photorealistic model who is a [gender] of [ethnicity] ethnicity, within the [age_range] age range, interacting naturally with the product. The model should be placed in a [background_description] background that suits the product.

The shot is captured from a [camera_angle_description] to best showcase the product in use. The lighting must emulate a cinematic vibe with dramatic lighting, creating a high-end, aspirational mood. Employ a shallow depth of field, as if shot with an 85mm f/1.8 lens, to create a subtle background blur (bokeh) that keeps the focus on the model and product.

The final image must be of ultra-high resolution, with authentic, physically accurate textures on both the product and the model. The composition should be balanced and aesthetically pleasing, adhering to a [aspect_ratio] aspect ratio.
```

-----

### Backend Logic: Populating the Template

Your backend will populate the placeholders using the following rules:

**1. For Model Characteristics (`[gender]`, `[ethnicity]`, `[age_range]`):**

  * Simply insert the direct value from the dropdown.
  * **If the user leaves the default `Any` selected:**
      * `[gender]`: Replace with `"person"`
      * `[ethnicity]`: Replace with an empty string (e.g., "...of ethnicity...") to let the AI choose.
      * `[age_range]`: Replace with `"adult"`

**2. For `[background_description]`:**

  * **If `Auto`:** Replace with an empty string.
      * *Resulting line:* \`"The model should be placed in a background that suits the product."\*
  * **If `Preset` -\> `Studio` or `Outdoor`:** Replace with the selected style.
      * *Resulting line:* \`"The model should be placed in a [Style from Dropdown] background that suits the product."\*
  * **If `Upload`:** Replace with: `"user-provided background, ensuring the model and product are seamlessly integrated"`
  * **If `Describe`:** Replace with: `"custom environment described as: '[User's Text Description]'"`

**3. For `[camera_angle_description]`:**

  * **If `Auto`:** Replace with: `'same' angle as the original product shot`
  * **If `Preset`:** Replace with the preset name.
      * *Example:* `"full body shot"` or `"close-up shot on the product being worn/used"`
  * **If `Describe`:** Replace with: `shot framing described as: '[User's Text Description]'`

**4. For `[aspect_ratio]`:**

  * Replace with the selected ratio, e.g., `"1:1 square"`, `"4:5 portrait"`.

-----

### Filled-Out Prompt Example

**User Selections:**

  * **Model**: `[Female]`, `[18-25]`, `[Hispanic]`
  * **Background**: `[Preset]` -\> `[Outdoor]` -\> `[Bright Urban Street]`
  * **Camera Angle**: `[Preset]` -\> `[Full Body]`
  * **Output**: `[Portrait (4:5)]`

**Generated Prompt for the API:**

> Analyze the provided product image. Using the product, create a hyperrealistic and professional photograph intended for high-end e-commerce, lifestyle advertising, and social media campaigns.
>
> The image must feature a photorealistic model who is a female of Hispanic ethnicity, within the 18-25 age range, interacting naturally with the product. The model should be placed in a Bright Urban Street background that suits the product.
>
> The shot is captured from a full body shot to best showcase the product in use. The lighting must emulate a cinematic vibe with dramatic lighting, creating a high-end, aspirational mood. Employ a shallow depth of field, as if shot with an 85mm f/1.8 lens, to create a subtle background blur (bokeh) that keeps the focus on the model and product.
>
> The final image must be of ultra-high resolution, with authentic, physically accurate textures on both the product and the model. The composition should be balanced and aesthetically pleasing, adhering to a 4:5 portrait aspect ratio.
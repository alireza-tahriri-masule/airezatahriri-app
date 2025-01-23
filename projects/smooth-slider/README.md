# SmoothSlider

**SmoothSlider** is a sleek, smooth, and modern image slider built with **Tailwind CSS**. It allows you to display images in a beautiful, fluid carousel, enhancing the user experience on your website.

## Demo
https://github.com/user-attachments/assets/a9aa4e20-69f7-4599-bc5b-e2b5087006b4

## Features
- 🌟 Smooth sliding animations
- 🚀 Built with **Tailwind CSS** for responsive design
- 🎨 Customizable size and duration
- 🖼️ Displays images in a rotating, auto-scrolling manner
- ✨ Clean and simple code

## Installation

To use **SmoothSlider** in your project, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/alireza-tahriri-masule/smooth-slider
    ```

2. Include the **output.css** file from Tailwind CSS in your HTML file:
    ```html
    <link href="./output.css" rel="stylesheet">
    ```

3. Add the HTML structure:
    ```html
    <div class="slider">
      <img src="./images/01.png" alt="01">
      <img src="./images/02.png" alt="02">
      <img src="./images/03.png" alt="03">
      <!-- Add more images as needed -->
    </div>
    ```

4. Customize the CSS (optional):
    - You can change the slider width, height, and duration by adjusting the `:root` variables in the CSS file.

## Customization

You can easily customize the slider by adjusting the following variables in the `:root` section of the CSS file:

- `--item-count`: Number of images in the slider
- `--width`: Width of the slider (e.g., `400px`)
- `--height`: Height of the slider (e.g., `400px`)
- `--duration`: Duration of the slide transition (e.g., `8s`)

## License

This project is open-source and available under the [MIT License](LICENSE).

const sharp = require('sharp');

module.exports = (url, alt = "Missing alt text") => {
    const imageName = url.split('.').shift(); // Extract image name (assuming no dots in the name itself)
    const outputFormats = ['avif', 'webp', 'jpg'];

    // Generate all required image formats 
    const formatPromises = outputFormats.map(format => { 
        return sharp(`/images/${url}`) // Adjust the path if needed
            .resize({ width: 1600 }) // Set the maximum width to match the xxlarge breakpoint
            [format]({ quality: 80})
            .toFile(`/images/${imageName}.${format}`); 
    });

    // Wait for all formats to be generated
    Promise.all(formatPromises)
        .then(() => {
            return `<picture>
                <source srcset="/images/xxlarge/${imageName}.avif" type="image/avif" media="(min-width: 1600px)">
                <source srcset="/images/xxlarge/${imageName}.webp" type="image/webp" media="(min-width: 1600px)">
                <source srcset="/images/xlarge/${imageName}.avif" type="image/avif" media="(min-width: 1200px)">
                <source srcset="/images/xlarge/${imageName}.webp" type="image/webp" media="(min-width: 1200px)">
                <source srcset="/images/large/${imageName}.avif" type="image/avif" media="(min-width: 992px)">
                <source srcset="/images/large/${imageName}.webp" type="image/webp" media="(min-width: 992px)">
                <source srcset="/images/medium/${imageName}.avif" type="image/avif" media="(min-width: 768px)">
                <source srcset="/images/medium/${imageName}.webp" type="image/webp" media="(min-width: 768px)">
                <source srcset="/images/small/${imageName}.avif" type="image/avif" media="(min-width: 481px)">
                <source srcset="/images/small/${imageName}.webp" type="image/webp" media="(min-width: 481px)">
                <source srcset="/images/xsmall/${imageName}.avif" type="image/avif" media="(max-width: 480px)">
                <source srcset="/images/xsmall/${imageName}.webp" type="image/webp" media="(max-width: 480px)">
                <img src="/images/${imageName}.jpg" alt="${alt}" />
            </picture>`;
        })
        .catch(err => console.error("Error generating image formats:", err)); 
};

// tailwind.config.js

module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}", // Fix typo to correctly include all files in src directory and its subdirectories
    ],
    theme: {
        extend: {
            colors: {
                primaryTransparent: '#fff',
                blackTransparent: 'rgba(1, 1, 1, .7)',
            }
        },
    },
    plugins: [],
};

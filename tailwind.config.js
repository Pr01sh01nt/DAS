/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    
  theme: {
    extend: {
      colors: {
        'custom-blue': '#97ABE4',
        'custom-green': '#9CC48E',
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'xs': '900px', // Define custom breakpoint named lg2
      },
    },
  },
  plugins: [
    // require('@tailwindcss/typography'),
  ],

  
};

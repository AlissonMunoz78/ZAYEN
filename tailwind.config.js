module.exports = {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ['"EB Garamond"', 'Georgia', 'serif'],
        body:  ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      colors: {
        zayen: {
          cyan: '#00D4C8',
          purple: '#6B35C8',
          magenta: '#E8166B',
          dark: '#0D1B2A',
        }
      },
      fontSize: {
        base: ['17px', '1.7'],
      }
    },
  },
  plugins: [],
}

import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        'admin-dashboard': 'admin-dashboard.html',
        'student-dashboard': 'student-dashboard.html',
        facilities: 'facilities.html',
        'our-hostels': 'our-Hostels.html',
        'boys-hostel': 'boys-hostel.html',
        'girl-hostel': 'girl-hostel.html',
        'contact-us': 'contact-us.html',
        rules: 'rules.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
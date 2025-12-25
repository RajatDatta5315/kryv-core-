```jsx
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>WhatsApp Clone</title>
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
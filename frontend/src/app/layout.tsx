import Web3Provider from "../context/Web3Provider";

export default function RootLayout({ children }) {
  return (
    <Web3Provider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Web3Provider>
  );
}

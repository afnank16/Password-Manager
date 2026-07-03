# 🔐 Password Manager

A secure and modern password manager built with JavaScript that allows users to safely store, encrypt, and manage their passwords.

## Features

* 🔒 Encrypts passwords before storing them
* 🔑 Password-based key derivation using PBKDF2
* 🛡️ AES-256-GCM encryption for strong security
* 👤 Master password authentication
* ➕ Add new passwords
* ✏️ Edit existing passwords
* 🗑️ Delete saved passwords
* 🔍 Search stored credentials
* 💾 indexedDB storage
* 📱 Responsive and user-friendly interface

## Technologies Used

* JavaScript (ES6+)
* HTML5
* CSS3
* Web Crypto API
* IndexedDB

## Security

This project uses modern browser cryptography through the Web Crypto API.

* **PBKDF2** with **SHA-256** for key derivation
* **250,000 iterations** for enhanced resistance against brute-force attacks
* **AES-256-GCM** for authenticated encryption
* Randomly generated salts and initialization vectors (IVs)

> **Note:** This project is intended for learning and portfolio purposes. For production use, consider additional security measures such as secure backups, hardware-backed key storage, and comprehensive security audits.

## Installation

1. Clone the repository.

```bash
git clone <repository-url>
```

2. Navigate to the project directory.

```bash
cd password-manager
```

3. Install dependencies (if applicable).

```bash
npm install
```

4. Start the development server.

```bash
npm run dev
```

5. Open the application in your browser.

## Project Structure

```text
password-manager/
│
├── src/
│   ├── components/
│   ├── crypto/
│   ├── db/
│   ├── hooks/
|   |__ utils?
│   └── main.jsx
│
├── public/
├── package.json
└── README.md
```

## Future Improvements

* Password generator
* Password strength meter
* Auto-lock after inactivity
* Import and export passwords
* Cloud synchronization
* Multi-device support
* Two-factor authentication (2FA)
* Browser extension

## License

This project is licensed under the MIT License.

## Author

Created by **Afnan Khan**.

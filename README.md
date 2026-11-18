# GramUdyam 🌾
### Empowering Rural Entrepreneurs Through Digital Technology

GramUdyam is an AI-powered digital marketplace designed to support rural entrepreneurs, traditional artisans, and small-scale producers in Maharashtra. The platform aims to connect local creators with wider markets by providing digital tools for product showcasing, branding, authenticity, and business growth.

It focuses on reducing the digital gap faced by rural entrepreneurs and helping them present their products to customers beyond their local communities.

---

## 🎯 Project Objective

To build an accessible digital platform that enables rural entrepreneurs and traditional artisans to:

- Showcase and sell their handmade and locally produced products.
- Improve product presentation and digital branding.
- Preserve and share the stories behind traditional crafts.
- Build customer trust through QR-based product information.
- Connect with customers through a digital marketplace.
- Explore opportunities for business growth and wider market access.

## ✨ Key Features

### 1. Digital Marketplace
- Browse and explore products offered by rural entrepreneurs.
- View product details, images, descriptions, and pricing.
- Support customer shopping and ordering workflows.

### 2. AI-Powered Branding Assistance
- Generate product descriptions with AI assistance.
- Provide branding suggestions to improve product presentation.
- Help entrepreneurs create more attractive product listings.

### 3. QR-Based TrustTag
- QR-based product identification and verification interface.
- Display product information and artisan details.
- Help customers learn about the origin and story behind products.

### 4. Voice-Based Product Creation
- Support voice input for product creation.
- Help entrepreneurs describe their products more easily.
- Reduce dependence on typing and complex digital workflows.

### 5. Entrepreneur Dashboard
- Manage product listings.
- View orders and business-related information.
- Access branding, analytics, and product quality tools.

### 6. Multilingual Interface
- Language support for English, Hindi, and Marathi.
- Designed to make the platform more accessible to rural users.

### 7. Customer Features
- Customer registration and login.
- Product browsing and shopping cart.
- Checkout and order tracking interfaces.

### 8. Product Quality and Analytics
- AI-assisted product quality scoring interface.
- Entrepreneur analytics dashboard.
- Tools to help entrepreneurs understand and improve their product presentation.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| CSS | Styling and responsive interface |
| Supabase | Backend services, database, and authentication |
| React Router | Application navigation |
| Supabase JavaScript Client | Frontend-backend integration |

---

## 📁 Project Structure

```text
Gramudyam/
│
├── DESIGN_REFERENCE/       # UI design references
│
├── public/                 # Public assets and icons
│
├── src/
│   ├── assets/             # Images and static assets
│   ├── components/         # Reusable UI components
│   ├── context/            # Application context providers
│   ├── data/               # Application data
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Supabase configuration
│   ├── locales/            # Language translations
│   ├── pages/              # Application pages
│   ├── services/           # Application services
│   ├── utils/              # Utility functions
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
└── vite.config.js
```

---

## ⚙️ Installation and Setup

Follow these steps to run GramUdyam locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- A Supabase project

### Step 1: Clone the Repository

```bash
git clone https://github.com/pathakayush25/Gramudyam.git
```

### Step 2: Navigate to the Project Folder

```bash
cd Gramudyam
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory using `.env.example` as a reference.

Add your Supabase project credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_PUBLIC_APP_URL=
```

Replace the placeholder values with your own Supabase project details.

**Important:** Never upload your actual `.env` file or private credentials to GitHub.

### Step 5: Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173/
```

### Step 6: Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

---

## 🌍 Target Users

- Rural entrepreneurs and small business owners.
- Traditional artisans and handicraft producers.
- Self-help groups (SHGs).
- Customers interested in handmade and locally produced products.
- Rural communities seeking digital business opportunities.

---

## 🚀 Future Scope

- Integration of secure online payment gateways.
- Improved AI-powered business recommendations.
- Advanced multilingual voice assistance.
- Product authenticity and verification improvements.
- Delivery tracking and logistics integration.
- Expansion to more rural communities across Maharashtra and India.
- B2B marketplace support for bulk orders and business partnerships.

---

## 🎓 Project Information

**Project Name:** GramUdyam

**Project Theme:** Tech4Startup – Enabling Rural Entrepreneurship through Digital Tools in Maharashtra

**Domain:** Artificial Intelligence, E-Commerce, and Rural Entrepreneurship

**Developed Using:** React.js, Vite, JavaScript, and Supabase

**Project Type:** Academic / Student Project

---

## 🤝 Contribution

Contributions, suggestions, and improvements are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Submit a Pull Request.

---

## 📄 License

This project is developed for academic and educational purposes. Licensing terms can be added as the project evolves.

---

**GramUdyam – Bringing Rural Entrepreneurship Closer to the Digital World. 🌱**

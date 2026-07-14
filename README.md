# 🚀 MediaPilot AI

> **AI-Powered Media Management SaaS Platform**

MediaPilot AI is a modern full-stack SaaS application that enables users to securely upload, optimize, organize, and share media assets using Cloudinary. The platform combines AI-powered metadata generation, media optimization, analytics, and secure authentication into a clean, production-ready dashboard.

🌐 **Live Demo:** https://28-ai-powered-saas.vercel.app/home

---

## 📸 Preview
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0d5047ff-9b6b-408e-a770-ffe3ca996a4b" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5e379c36-ff6e-4d73-8423-752babee003a" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0071c3eb-b1cd-435b-8c95-5758f3884a97" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6c688868-1489-44d0-881d-97e8dd2ef800" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4d6d0a5a-b167-4391-bb47-2f1d99e4312b" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d9213919-3c2c-4b21-b450-11dd092828aa" />




- Dashboard
- Upload Media
- Social Share Studio
- Collections
- Analytics
- Activity Log

---

# ✨ Features

### 🔐 Authentication
- Secure Google Authentication using Clerk
- Protected routes
- Multi-user support
- Automatic user onboarding

---

### 📁 Media Management
- Upload Images & Videos
- Cloudinary-powered media storage
- Automatic media optimization
- Original vs Compressed size comparison
- Delete media assets
- Favorite assets
- Collections/Folders
- Activity tracking

---

### 🤖 AI Features
- AI-generated metadata
- Automatic title generation
- Smart descriptions
- Intelligent tagging
- Search-ready metadata

---

### 📊 Dashboard Analytics
- Total uploaded assets
- Storage utilization
- Compression statistics
- Bandwidth savings
- Upload activity visualization

---

### 🌐 Social Share Studio
Automatically generate optimized media for different platforms.

Supports resizing for:
- Instagram
- Facebook
- LinkedIn
- X (Twitter)
- YouTube

---

### 🎨 Modern UI
- Premium Dashboard
- Dark / Light Mode
- Responsive Design
- Interactive Cards
- Modern Sidebar Navigation

---

## 🏗 Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- Lucide Icons

### Backend

- Next.js API Routes
- Prisma ORM
- Neon PostgreSQL

### Authentication

- Clerk

### Media Processing

- Cloudinary

### Deployment

- Vercel

---

# 📂 Project Structure

```
MediaPilot-AI
│
├── app
│   ├── api
│   ├── home
│   ├── upload
│   ├── collections
│   ├── favorites
│   ├── activity
│   └── social-share
│
├── components
│
├── lib
│
├── prisma
│
├── public
│
└── types
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/MediaPilot-AI.git
```

Go inside project

```bash
cd MediaPilot-AI
```

Install dependencies

```bash
npm install
```

Configure Environment Variables

Create

```
.env
```

Add

```env
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Push Prisma Schema

```bash
npx prisma db push
```

Run locally

```bash
npm run dev
```

---

# 📊 Application Workflow

```text
User Login
      │
      ▼
Clerk Authentication
      │
      ▼
Media Upload
      │
      ▼
Cloudinary Optimization
      │
      ▼
AI Metadata Generation
      │
      ▼
Store Metadata (Neon + Prisma)
      │
      ▼
Dashboard Analytics
      │
      ▼
Collections / Search / Share
```

---

# 📈 Key Highlights

✅ Production Ready

✅ Secure Authentication

✅ AI Metadata Generation

✅ Cloudinary Media Optimization

✅ Responsive Dashboard

✅ Modern SaaS UI

✅ Server-side Rendering

✅ Multi-user Support

✅ PostgreSQL Database

✅ Fully Deployed on Vercel

---

# 🚀 Future Enhancements

- Drag & Drop Folder Uploads
- Bulk Media Upload
- AI Image Captioning
- Video Transcription
- Storage Usage Notifications
- Team Workspaces
- Public Share Links
- Usage Billing Dashboard

---

# 👨‍💻 Author

**Vinayak Dhyani**

📧 vinayakdhyani27@gmail.com

GitHub:
https://github.com/Vinayak-123-jpj

LinkedIn:
https://www.linkedin.com/in/vinayak-dhyani-18b547373/

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates further improvements.

---

## 📄 License

This project is licensed under the MIT License.

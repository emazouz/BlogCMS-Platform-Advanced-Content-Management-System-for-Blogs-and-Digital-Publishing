# BlogCMS 🚀

BlogCMS is a comprehensive web platform for managing and publishing digital content, built to provide a professional blogging experience that combines high performance with ease of use. Aimed at bloggers, content writers, and media institutions, the platform focuses on **SEO optimization**, **monetization**, and **user engagement**.

---

## ✨ Key Features

### 1. 🛡️ Unparalleled Admin Experience

- **Central Dashboard:** Manage the entire site, monitor traffic growth, and analyze earnings (Google AdSense) in one place with precise interactive charts powered by **Recharts**.
- **Smart Text Editor:** An advanced writing experience using **Tiptap**, supporting full formatting, media uploads, and auto-save.
- **Built-in SEO Tools:** Optimize content for search engines directly within the editor.
- **Comprehensive Management:** Full control over users, comments, categories, tags, and FAQs.

### 2. 🌐 Premium Visitor Experience

- **Modern Design:** A fast, responsive UI built with **Tailwind CSS** and **Shadcn UI**, supporting **Dark Mode** and seamless performance across all devices.
- **Smooth Animations:** Fluid transitions and interactive elements powered by **Framer Motion**.
- **Live Interaction:** Secure login via **NextAuth**, allowing users to comment on articles, rate content, and join the community.
- **Advanced Search:** An instant, high-speed search system for effortless content discovery.

---

## 🛠️ Technical Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Charts:** [Recharts](https://recharts.org/)
- **Editor:** [Tiptap](https://tiptap.dev/)
- **Media:** [Cloudinary](https://cloudinary.com/) (Integration detected)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB instance (local or Atlas)
- Cloudinary account for media uploads

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd blogs
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file based on `.env.example` and fill in your credentials:

   ```env
   DATABASE_URL=
   NEXTAUTH_SECRET=
   CLOUDINARY_CLOUD_NAME=
   ...
   ```

4. **Seed the database (Optional):**

   ```bash
   npm run seed-categories
   npm run seed-posts
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📈 Summary

BlogCMS is not just a blog—it's a production-ready technical solution adhering to global standards of speed, security, and user experience.

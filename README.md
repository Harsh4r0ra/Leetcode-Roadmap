# LeetCode Roadmap 🚀

A modern web application to track your progress through the NeetCode 150 problems. Built with Next.js, Tailwind CSS, and Supabase.

![LeetCode Roadmap](https://i.imgur.com/your-screenshot.png)

## ✨ Features

- 📊 Track progress through 150 curated LeetCode problems
- 🎯 Organized by problem categories and difficulty levels
- 🔐 User authentication with email/password
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🎨 Modern UI with glass-morphism effects
- 📈 Progress tracking and statistics
- 🔗 Direct links to LeetCode problems

## 🛠️ Tech Stack

- **Frontend:**
  - Next.js 14
  - React
  - Tailwind CSS
  - Framer Motion (for animations)
  - Inter font

- **Backend:**
  - Supabase (Authentication & Database)
  - PostgreSQL

- **Deployment:**
  - Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/leetcode-roadmap.git
   cd leetcode-roadmap
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

```
leetcode-roadmap/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── globals.css       # Global styles
│   └── layout.js         # Root layout
├── components/           # React components
├── lib/                  # Utility functions and data
│   └── roadmapData.js   # Problem data
├── public/              # Static assets
└── styles/             # Additional styles
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Set up authentication:
   - Enable Email/Password auth
   - Configure email templates
3. Create necessary tables:
   - users
   - progress
   - problems

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 🚀 Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables
4. Deploy!

### Deploying to Other Platforms

The application can be deployed to any platform that supports Next.js applications. Make sure to:
1. Set up environment variables
2. Configure build settings
3. Set up proper routing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NeetCode](https://neetcode.io/) for the curated problem list
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Supabase](https://supabase.io/) for the backend services

## 📞 Contact

Harsh Arora - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/yourusername/leetcode-roadmap](https://github.com/yourusername/leetcode-roadmap)

---

Made with ❤️ by Harsh Arora 
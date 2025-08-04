# 🦷 Ajinkya Narke(Ai Enginner) made Toothsi क्लिनिक  Website

A modern, responsive dental clinic website built with React, TypeScript, and Tailwind CSS. Features appointment booking, contact management, and admin dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.11-blue.svg)

## 🌟 Features

### 🏥 **Patient Features**
- **Modern Landing Page** - Professional design with hero section, services, and testimonials
- **Appointment Booking** - Integrated Cal.com booking system with multiple fallback options
- **Contact Forms** - Callback request system with Supabase backend
- **Service Information** - Detailed dental services with pricing and descriptions
- **Team Profiles** - Meet the dental professionals
- **Gallery** - Before/after photos and clinic images
- **Responsive Design** - Works perfectly on all devices

### 👨‍💼 **Admin Features**
- **Admin Dashboard** - Comprehensive management interface
- **Callback Management** - View and manage patient callback requests
- **Appointment Tracking** - Monitor and manage appointments
- **Content Management** - Update services, team, and gallery
- **Contact Information** - Manage clinic details and contact info
- **Testimonials** - Add and manage patient reviews

### 🔧 **Technical Features**
- **Cal.com Integration** - Professional appointment booking
- **Supabase Backend** - Real-time database and authentication
- **Dark/Light Mode** - Theme switching capability
- **SEO Optimized** - Meta tags and structured data
- **Performance Optimized** - Fast loading and smooth animations

## 🚀 **Live Demo**

- **Website:** [Your Vercel URL]
- **Admin Panel:** [Your Vercel URL]/admin/login

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18.3.1** - Modern React with hooks
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.1** - Fast build tool and dev server
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **React Router Dom** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Lucide React** - Beautiful icons

### **Backend & Services**
- **Supabase** - Database, authentication, and real-time features
- **Cal.com** - Appointment booking integration
- **Vercel** - Deployment and hosting

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📦 **Installation**

### **Prerequisites**
- Node.js 18+ 
- npm or pnpm
- Supabase account
- Cal.com account

### **Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/AjinkyaNarke/Toothsi-Clinic.git
   cd Toothsi-Clinic
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Create a Supabase project
   - Run the SQL commands to create the `callback_requests` table
   - Configure Row Level Security (RLS) policies

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🗄️ **Database Schema**

### **callback_requests Table**
```sql
CREATE TABLE callback_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    preferred_time VARCHAR(50) NOT NULL DEFAULT 'anytime',
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority VARCHAR(10) DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    called_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);
```

## 🚀 **Deployment**

### **Vercel Deployment**

1. **Connect to Vercel**
   - Push code to GitHub
   - Connect repository to Vercel
   - Configure environment variables

2. **Build Settings**
   ```
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Environment Variables**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

## 📱 **Usage**

### **For Patients**
1. Visit the website
2. Browse services and team information
3. Book appointments using the "Book Now" buttons
4. Submit callback requests through contact forms
5. View testimonials and gallery

### **For Admin**
1. Access `/admin/login`
2. Login with admin credentials
3. Manage callback requests in the dashboard
4. Update content and settings
5. Monitor appointments and patient interactions

## 🎨 **Customization**

### **Styling**
- Colors defined in `tailwind.config.ts`
- Custom CSS in `src/index.css`
- Component styles using Tailwind classes

### **Content**
- Update clinic information in components
- Modify services in `AdminDentalServices`
- Change team members in `AdminTeam`
- Update contact details in `AdminContact`

### **Features**
- Add new pages in `src/pages/`
- Create new components in `src/components/`
- Extend admin functionality in admin components

## 🔧 **Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npm run deploy:vercel    # Deploy to Vercel
```

## 📂 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── AdminCallbacks.tsx
│   ├── BookingModal.tsx
│   ├── ContactSection.tsx
│   └── ...
├── pages/              # Page components
│   ├── Index.tsx
│   ├── About.tsx
│   ├── AdminDashboard.tsx
│   └── ...
├── lib/                # Utilities and configurations
│   ├── supabase.ts
│   └── utils.ts
├── hooks/              # Custom React hooks
└── App.tsx             # Main application component
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Developer**

**Dr. Prasad's Lotus Dental Clinic Website**
- GitHub: [@AjinkyaNarke](https://github.com/AjinkyaNarke)
- Repository: [Toothsi Dental Clinic](https://github.com/AjinkyaNarke/Toothsi-Clinic)
- Website: Dr. Prasad's Lotus Dental Clinic
- Contact: Professional dental care services

## 🙏 **Acknowledgments**

- **Shadcn/ui** - For the beautiful UI components
- **Cal.com** - For the appointment booking integration
- **Supabase** - For the backend infrastructure
- **Vercel** - For hosting and deployment
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 **Support
ajinkya.narke21@gmail.com

For support, contact Dr. Prasad's Lotus Dental Clinic or create an issue in the [GitHub repository](https://github.com/AjinkyaNarke/Toothsi-Clinic/issues).

---

**Built with ❤️ From Ajinkya Narke**

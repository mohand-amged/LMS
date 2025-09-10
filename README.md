# Educational Dashboard System (EduLMS)

A comprehensive educational platform with separate dashboard interfaces for teachers and students, featuring course management, assignments, quizzes, real-time analytics, and interactive learning tools.

## 🚀 Features

### Teacher Dashboard
- **Content Management:**
  - Upload and manage courses/lessons (video, documents, slides)
  - Create and assign homework/assignments with due dates
  - Build interactive quizzes with multiple question types
  - Set grading rubrics and point values
  
- **Student Monitoring & Analytics:**
  - Real-time attendance tracking and absence reports
  - Assignment submission status monitoring
  - Quiz performance analytics with detailed breakdowns
  - Individual student progress tracking
  - Class performance overview with visual charts
  
- **Leaderboard Management:**
  - Configure leaderboard criteria
  - Set point systems and rewards
  - View and manage student rankings
  
- **Analytics Dashboard:**
  - Class engagement metrics
  - Assignment completion rates
  - Quiz performance trends
  - Student activity heatmaps
  - Export capabilities for reports

### Student Dashboard
- **Learning Interface:**
  - Browse and access assigned courses/lessons
  - Stream video content with progress tracking
  - Download course materials and resources
  - Mark lessons as complete
  
- **Assignment System:**
  - View assigned homework with due dates
  - Upload assignment submissions (multiple file types)
  - Track submission status and grades
  - Receive feedback from teachers
  
- **Quiz Platform:**
  - Take assigned quizzes with time limits
  - Auto-save progress during quizzes
  - Instant feedback on quiz results
  - Review incorrect answers (if enabled by teacher)
  
- **Personal Progress:**
  - View personal leaderboard position
  - Track grades and performance over time
  - See completion statistics
  - Achievement badges/rewards system

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** SQLite (development), PostgreSQL (production)
- **Authentication:** Custom role-based auth system
- **File Upload:** Custom file handling with validation
- **Charts:** Recharts for analytics visualization
- **UI Components:** Custom component library with Radix UI
- **Real-time:** WebSocket support for notifications

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/educational-dashboard.git
   cd educational-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the `.env.local` file with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-change-this"
   UPLOAD_DIR="./uploads"
   MAX_FILE_SIZE=10485760
   ```

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Open [http://localhost:3000](http://localhost:3000)
   - Default demo accounts are created automatically

## 🔐 Default Accounts

The system automatically creates demo accounts for testing:

### Teacher Account
- **Username:** teacher@demo.com
- **Password:** teacher123

### Student Account
- **Username:** student@demo.com
- **Password:** student123

## 🏗 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── analytics/          # Analytics endpoints
│   │   ├── assignments/        # Assignment management
│   │   ├── courses/           # Course management
│   │   ├── quizzes/           # Quiz management
│   │   └── upload/            # File upload handling
│   ├── components/            # Reusable components
│   │   ├── analytics/         # Analytics components
│   │   ├── ui/               # UI components
│   │   └── ...
│   ├── contexts/             # React contexts
│   ├── dashboard/            # Dashboard pages
│   │   ├── teacher/          # Teacher dashboard
│   │   └── student/          # Student dashboard
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── dev.db              # SQLite database (dev)
├── public/                 # Static assets
└── uploads/               # File uploads directory
```

## 📊 API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/[id]` - Get course details

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment
- `GET /api/assignments/[id]` - Get assignment details

### Quizzes
- `GET /api/quizzes` - Get quizzes
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes/[id]` - Get quiz details

### Analytics
- `GET /api/analytics` - Get analytics data

### File Upload
- `POST /api/upload` - Upload files

## 🚀 Deployment

### Vercel Deployment

1. Push to GitHub repository
2. Connect to Vercel and configure environment variables
3. Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ for education

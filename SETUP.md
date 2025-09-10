# Educational Dashboard System - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### 1. Clone and Install
```bash
# If starting fresh
git clone <your-repo-url>
cd lms

# Install existing dependencies
npm install

# Install additional packages for enhanced functionality
npm install recharts@2.8.0 @radix-ui/react-dialog@1.0.5 @radix-ui/react-dropdown-menu@2.0.6 date-fns@3.0.6 react-dropzone@14.2.3
```

### 2. Environment Configuration
```bash
# Create environment file
cp .env.example .env.local

# Update .env.local with:
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
NODE_ENV="development"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Apply database schema
npx prisma db push

# View database (optional)
npx prisma studio
```

### 4. Start Development
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## 🔐 Demo Accounts

The system includes pre-built authentication with demo data:

### Teacher Account
- **Email:** teacher@example.com
- **Password:** teacher123
- **Features:** Full teacher dashboard, course management, student analytics

### Student Account  
- **Email:** student@example.com
- **Password:** student123
- **Features:** Student dashboard, course enrollment, assignment submission

### Admin Account
- **Email:** admin@example.com  
- **Password:** admin123
- **Features:** Full system access, user management

## 📁 Project Structure

```
lms/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── analytics/          # Analytics endpoints
│   │   ├── assignments/        # Assignment management
│   │   ├── courses/           # Course CRUD operations
│   │   ├── quizzes/           # Quiz management
│   │   └── upload/            # File upload handling
│   ├── components/            # React components
│   │   ├── analytics/         # Chart and analytics components
│   │   ├── notifications/     # Real-time notifications
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # React Context providers
│   ├── dashboard/            # Dashboard pages
│   │   ├── teacher/          # Teacher-specific pages
│   │   └── student/          # Student-specific pages
│   └── types/               # TypeScript definitions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── dev.db              # SQLite database file
└── uploads/                # File uploads directory
```

## 🎯 Key Features Implemented

### ✅ Authentication System
- **Role-based access control** (Teacher, Student, Admin)
- **Secure password handling** with bcrypt hashing
- **Session management** with persistent login
- **Route protection** based on user roles

### ✅ Teacher Dashboard
- **Course Management**
  - Create, edit, and delete courses
  - Upload course materials (videos, documents, slides)
  - Organize lessons with different content types
  - Set course visibility and enrollment settings

- **Assignment System**
  - Create assignments with due dates and point values
  - Set different assignment types (Essay, Project, Lab, etc.)
  - Configure grading rubrics
  - Bulk operations for efficient management

- **Quiz Builder**
  - Multiple question types (Multiple Choice, True/False, Short Answer, Essay)
  - Time limits and attempt restrictions
  - Randomized question order
  - Instant or delayed result publication

- **Student Analytics**
  - Individual student performance tracking
  - Class performance overview with visual charts
  - Assignment completion rates and trends
  - Attendance tracking and absence reports
  - Exportable reports for administrative use

- **Leaderboard Management**
  - Configurable ranking criteria
  - Point system with customizable weights
  - Achievement badges and rewards
  - Class engagement metrics

### ✅ Student Dashboard
- **Learning Interface**
  - Browse enrolled courses with progress tracking
  - Stream video content with resume functionality
  - Download course materials and resources
  - Mark lessons as complete for progress tracking

- **Assignment Workflow**
  - View assignments with clear due dates
  - Upload multiple file types for submissions
  - Track submission status (Draft, Submitted, Graded)
  - Receive detailed teacher feedback

- **Interactive Quiz Platform**
  - Take quizzes with auto-save functionality
  - Timer display for time-limited quizzes
  - Instant feedback on quiz completion
  - Review incorrect answers (when enabled)

- **Personal Progress Tracking**
  - View personal leaderboard position
  - Track grades and performance over time
  - Course completion statistics
  - Achievement system with badges

### ✅ Advanced Analytics
- **Performance Metrics**
  - Real-time data visualization with Recharts
  - Engagement tracking and activity heatmaps
  - Performance trend analysis
  - Comparative analytics between students/classes

- **Reporting System**
  - Export capabilities (JSON, CSV formats)
  - Customizable time range filtering
  - Comprehensive data breakdowns
  - Visual chart exports

### ✅ File Management System
- **Secure File Upload**
  - Drag and drop interface
  - File type validation and size limits
  - Progress tracking during upload
  - Virus scanning ready architecture

- **Content Organization**
  - Categorized file storage
  - Metadata tracking
  - Version control support
  - Cloud storage ready

### ✅ Real-time Features
- **Notification System**
  - Instant notifications for new assignments
  - Grade publication alerts
  - Discussion updates
  - System announcements

- **Live Updates**
  - Real-time leaderboard updates
  - Activity feed synchronization
  - Progress tracking updates

## 🔧 API Documentation

### Authentication Endpoints
```
POST /api/auth/login     # User login
POST /api/auth/register  # User registration  
POST /api/auth/logout    # User logout
```

### Course Management
```
GET    /api/courses           # List all courses
POST   /api/courses           # Create new course
GET    /api/courses/[id]      # Get course details
PUT    /api/courses/[id]      # Update course
DELETE /api/courses/[id]      # Delete course
```

### Assignment Management
```
GET    /api/assignments       # List assignments
POST   /api/assignments       # Create assignment
GET    /api/assignments/[id]  # Get assignment details
PUT    /api/assignments/[id]  # Update assignment
POST   /api/assignments/[id]/submit  # Submit assignment
```

### Quiz Management
```
GET    /api/quizzes           # List quizzes
POST   /api/quizzes           # Create quiz
GET    /api/quizzes/[id]      # Get quiz details
POST   /api/quizzes/[id]/attempt  # Submit quiz attempt
```

### Analytics
```
GET /api/analytics?type=overview&period=30        # Overview analytics
GET /api/analytics?type=course&courseId=123       # Course analytics
GET /api/analytics?type=student&studentId=456     # Student analytics
GET /api/analytics?type=leaderboard&courseId=123  # Leaderboard data
```

### File Upload
```
POST /api/upload              # Upload files
GET  /api/files/[...path]     # Serve uploaded files
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Next.js)
```bash
# 1. Push to GitHub
git add .
git commit -m "Educational dashboard system"
git push origin main

# 2. Deploy to Vercel
# - Connect your GitHub repository to Vercel
# - Configure environment variables in Vercel dashboard
# - Deploy automatically
```

### Option 2: Docker Deployment
```dockerfile
# Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t edu-lms .
docker run -p 3000:3000 edu-lms
```

### Option 3: Traditional Server
```bash
# Production build
npm run build

# Start production server
npm start
```

## 🛠 Development Workflow

### Adding New Features
1. **Database Changes**
   ```bash
   # Edit prisma/schema.prisma
   npx prisma db push
   npx prisma generate
   ```

2. **Create API Endpoints**
   ```typescript
   // app/api/your-endpoint/route.ts
   export async function GET(request: NextRequest) {
     // Implementation
   }
   ```

3. **Build UI Components**
   ```typescript
   // app/components/YourComponent.tsx
   export default function YourComponent() {
     // Implementation
   }
   ```

### Code Quality
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

## 🔒 Security Features

- **Authentication:** Secure password hashing with bcryptjs
- **Authorization:** Role-based access control throughout the application
- **File Upload:** Type and size validation with sanitization
- **Input Validation:** Zod schema validation on all API endpoints
- **SQL Injection:** Protection via Prisma ORM parameterized queries
- **XSS Protection:** Built-in Next.js protections and input sanitization

## 📊 Performance Optimizations

- **Database:** Optimized queries with proper indexing
- **Caching:** Component-level caching with React
- **File Handling:** Streaming uploads with progress tracking
- **Code Splitting:** Next.js automatic code splitting
- **Image Optimization:** Next.js built-in image optimization

## 🧪 Testing

```bash
# Unit tests (when implemented)
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android tablets)
- Mobile devices (iOS, Android)
- Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Reset database
   rm prisma/dev.db
   npx prisma db push
   ```

2. **Upload Directory Missing**
   ```bash
   # Create uploads directory
   mkdir uploads
   mkdir uploads/documents
   mkdir uploads/images
   mkdir uploads/videos
   ```

3. **Environment Variables**
   ```bash
   # Ensure .env.local exists and is properly configured
   cp .env.example .env.local
   ```

4. **Package Installation Issues**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🎯 Next Steps

The educational dashboard system is now complete with all major features implemented. The system includes:

✅ **Complete Authentication System** with role-based access
✅ **Comprehensive Database Schema** with all educational entities
✅ **Full Teacher Dashboard** with course management and analytics
✅ **Complete Student Dashboard** with learning and progress tracking
✅ **Advanced Analytics System** with visual reporting
✅ **File Upload and Management** system
✅ **Real-time Notifications** and updates
✅ **Professional UI/UX** with responsive design
✅ **Production-ready Architecture** with security best practices

The system is ready for deployment and can be extended with additional features as needed.

---
**🎓 Educational Dashboard System - Making Learning Accessible and Engaging**

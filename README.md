# 🎓 WeStud - Online Learning Platform

A modern online learning platform built with Next.js and Strapi CMS.

## 🚀 Live Demo

- **🌐 Live Site:** https://we-stud.vercel.app
- **⚙️ Admin Panel:** https://westud.mdpahlovi.com/admin

## 🛠️ Tech Stack

| Layer    | Technologies                                  |
| -------- | --------------------------------------------- |
| Backend  | Strapi, PostgreSQL                            |
| Frontend | TypeScript, Next.js, Tailwind CSS, Shadcn/ui, |

## 🚀 Installation & Setup

### Clone the repository

```bash
git clone https://github.com/mdpahlovi/WeStud.git
cd WeStud
```

### Backend Setup

```bash
cd backend
npm install
# Create .env file (see Environment Variables section)
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
# Create .env file (see Environment Variables section)
npm run dev
```

## 🔐 Environment Variables

### Backend

```env
# Server
NODE_ENV=development
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=http://localhost:1337

# Secrets
APP_KEYS='...'
API_TOKEN_SALT='...'
ADMIN_JWT_SECRET='...'
TRANSFER_TOKEN_SALT='...'
ENCRYPTION_KEY='...'

# Database
DATABASE_CLIENT='...'
DATABASE_HOST='...'
DATABASE_PORT='...'
DATABASE_NAME='...'
DATABASE_USERNAME='...'
DATABASE_PASSWORD='...'
DATABASE_SSL='...'
DATABASE_FILENAME='...'

JWT_SECRET='...'
```

### Frontend

```env
SERVER_URL='http://localhost:1337'
```

### 🔑 Test Credentials

| Role            | Email                | Password |
| --------------- | -------------------- | -------- |
| **Super Admin** | superadmin@gmail.com | 123456   |
| **Student**     | student@gmail.com    | 123456   |
| **User**        | user@gmail.com       | 123456   |

## 📁 Project Structure

```
WeStud/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── components/
│   │   │   │   ├── signin/
│   │   │   │   ├── signup/
│   │   │   │   └── layout.tsx
│   │   │   ├── (main)/
│   │   │   │   ├── course/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── actions/
│   │   │   │   ├── course.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── index.ts
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── course/
│   │   │   ├── home/
│   │   │   └── ui/
│   │   ├── lib/
│   │   └── stores/
├── backend/
│   ├── config/
│   ├── src/
│   │   ├── api/
│   │   │   ├── course/
│   │   │   ├── module/
│   │   │   ├── class/
│   │   │   └── enrollment/
│   │   └── index.ts
│
└── README.md
```

## 🗄 Database Schema

### Collections Overview

#### Users (Extended)

- **Fields:** username, email, password, role, firstName, lastName
- **Roles:** admin, user, student, social_media_manager, developer
- **Relations:** enrollments (One-to-Many)

#### Courses

- **Fields:** title, description, image, duration, price, badge
- **Relations:** modules (One-to-Many), enrollments (One-to-Many)

#### Enrollments (Junction Table)

- **Fields:** enrolled_date, progress, status, price
- **Relations:** user (Many-to-One), course (Many-to-One)
- **Status:** pending, running, completed

#### Modules

- **Fields:** title, description, order
- **Relations:** course (Many-to-One), classes (One-to-Many)

#### Classes

- **Fields:** title, description, video, duration, order
- **Relations:** module (Many-to-One)

### Relationships

```
Users ←→ Enrollments ←→ Courses (Many-to-Many)
Courses → Modules (One-to-Many)
Modules → Classes (One-to-Many)
```

## 📄 License

This project is licensed under the MIT License.

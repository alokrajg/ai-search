# 🚀 Frontend-Backend Integration Guide

## ✅ What We've Built

A complete **GEO Search Platform** with modern frontend-backend integration:

### 🎯 **Frontend Features:**

- ✅ **Modern React Dashboard** with real-time data
- ✅ **4 Integrated Sections**: Overview, Visibility, Optimization, Alerts
- ✅ **Real-time API Integration** with backend services
- ✅ **Responsive Design** with modern animations
- ✅ **Brand Selection** and data filtering
- ✅ **Interactive Components** with loading states

### 🔧 **Backend Features:**

- ✅ **FastAPI REST API** with comprehensive endpoints
- ✅ **Firebase/Firestore Integration** for data storage
- ✅ **Perplexity API Integration** for AI search monitoring
- ✅ **Automated Query Execution** with scheduling
- ✅ **CSV Import System** for bulk data management
- ✅ **Real-time Citation Tracking** and analysis

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   External      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • REST Endpoints│    │ • Firebase      │
│ • Components    │    │ • Data Models   │    │ • Perplexity    │
│ • API Service   │    │ • Schedulers    │    │ • CSV Import    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Quick Start**

### 1. **Start Backend Server**

```bash
cd backend
source venv/bin/activate
python main.py
```

**Backend runs on:** `http://localhost:8000`

### 2. **Start Frontend Server**

```bash
npm run dev
```

**Frontend runs on:** `http://localhost:3000`

### 3. **Access Dashboard**

- **Main App:** `http://localhost:3000`
- **Dashboard:** `http://localhost:3000/dashboard`
- **API Docs:** `http://localhost:8000/docs`

## 📊 **Dashboard Sections**

### 🏠 **Overview Dashboard**

- **Real-time Metrics**: Total citations, active alerts, optimization suggestions
- **Recent Activity**: Latest alerts and top performing pages
- **Engine Performance**: Distribution across AI search engines
- **Brand Selection**: Switch between different brands

### 👁️ **Visibility Dashboard**

- **Citation Timeline**: Visual representation of citation trends
- **Engine Distribution**: Performance across different AI engines
- **Top Pages**: Best performing pages with relevance scores
- **Key Metrics**: Total citations, unique pages, average relevance

### 🎯 **Optimization Dashboard**

- **AI-Powered Suggestions**: Content optimization recommendations
- **Impact Analysis**: High/medium/low impact suggestions
- **Status Tracking**: Pending, in-progress, completed suggestions
- **Category Filtering**: Content, technical, structure, metadata

### 🚨 **Alerts Dashboard**

- **Real-time Monitoring**: Brand and misinformation alerts
- **Severity Levels**: High, medium, low priority alerts
- **Alert Management**: Dismiss, resolve, and take action
- **Filtering Options**: By severity, type, and status

## 🔌 **API Integration**

### **API Service (`lib/api.ts`)**

```typescript
// Brand Management
await apiService.getBrands();
await apiService.getBrand(brandId);
await apiService.createBrand(brandData);

// Visibility Metrics
await apiService.getVisibilityMetrics(brandId);
await apiService.getVisibilityTimeSeries(brandId);

// Alerts Management
await apiService.getAlerts(brandId);
await apiService.createAlert(alertData);

// Citations
await apiService.getCitations(brandId);
```

### **Data Flow**

1. **Frontend** makes API calls to backend
2. **Backend** processes requests and queries Firebase
3. **Firebase** returns real-time data
4. **Backend** formats and returns JSON responses
5. **Frontend** updates UI with new data

## 📁 **File Structure**

```
ai-search/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard page
│   ├── about/                   # About page
│   ├── blog/                    # Blog page
│   └── page.tsx                 # Homepage
├── components/                  # React Components
│   ├── VisibilityDashboard.tsx  # Visibility section
│   ├── AlertsDashboard.tsx      # Alerts section
│   ├── OptimizationDashboard.tsx # Optimization section
│   ├── OverviewDashboard.tsx    # Overview section
│   └── ...                      # Other components
├── lib/                         # Utilities
│   └── api.ts                   # API service
├── backend/                     # Python Backend
│   ├── main.py                  # FastAPI app
│   ├── core/                    # Core modules
│   ├── api/                     # API routes
│   └── scripts/                 # Utility scripts
└── ...                          # Other files
```

## 🎨 **Modern UI Features**

### **Design System**

- ✅ **Glass-morphism Effects**: Backdrop blur and transparency
- ✅ **Gradient Backgrounds**: Modern color schemes
- ✅ **Smooth Animations**: Hover effects and transitions
- ✅ **Responsive Layout**: Mobile-first design
- ✅ **Interactive Elements**: Buttons, cards, and forms

### **Component Features**

- ✅ **Loading States**: Spinners and skeleton screens
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Real-time Updates**: Auto-refresh functionality
- ✅ **Filtering & Search**: Advanced data filtering
- ✅ **Export Options**: Data export capabilities

## 🔧 **Configuration**

### **Environment Variables**

Create `.env.local` in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### **Backend Configuration**

Backend uses `.env` file in `/backend/` directory with:

- Firebase credentials
- Perplexity API key
- Database settings

## 📈 **Data Management**

### **CSV Import System**

```bash
# Create sample files
python scripts/import_cli.py samples

# Import data
python scripts/import_cli.py brands sample_brands.csv
python scripts/import_cli.py queries sample_queries.csv
python scripts/import_cli.py competitors sample_competitors.csv
```

### **Real-time Data**

- **Citations**: Automatically tracked from AI engines
- **Alerts**: Real-time monitoring and notifications
- **Metrics**: Live visibility scores and trends
- **Suggestions**: AI-generated optimization recommendations

## 🚀 **Production Deployment**

### **Frontend (Vercel)**

```bash
npm run build
npm run start
```

### **Backend (Railway/Heroku)**

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 🔍 **Testing the Integration**

### **1. Test API Connection**

```bash
curl http://localhost:8000/api/v1/debug/health
```

### **2. Test Brand Creation**

```bash
curl -X POST http://localhost:8000/api/v1/brands/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Brand","domains":["test.com"],"canonical_pages":["https://test.com"]}'
```

### **3. Test Frontend**

- Open `http://localhost:3000/dashboard`
- Select a brand from the dropdown
- Navigate between different sections
- Verify real-time data updates

## 🎉 **Success!**

Your GEO Search Platform is now fully integrated with:

- ✅ **Modern Frontend** with real-time data
- ✅ **Powerful Backend** with AI integration
- ✅ **Database Storage** with Firebase
- ✅ **CSV Import** for bulk data management
- ✅ **Real-time Monitoring** of AI search engines
- ✅ **Professional UI/UX** with animations

**Ready for production deployment!** 🚀

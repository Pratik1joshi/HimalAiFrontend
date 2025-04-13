
---

# Fintrack 💹

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://react.dev/)  
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green?logo=fastapi)](https://fastapi.tiangolo.com/)  
[![Groq](https://img.shields.io/badge/Groq-API-orange)](https://groq.com/)

**Fintrack** is an intelligent finance tracker that automatically analyzes your spending patterns across multiple accounts, providing actionable insights for expense optimization and financial management. Powered by AI-driven analysis through the Groq API.

![Fintrack Demo](https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.fiverr.com%2Fabdulrehman551%2Fdevelop-full-stack-web-apps-using-fastapi-and-react-js&psig=AOvVaw2uX4qLofGAVNBujn8d7vA2&ust=1744625392423000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjtwpni1IwDFQAAAAAdAAAAABAE) <!-- Replace with actual screenshot -->

## Key Features ✨

- 🚨 Overspending alerts & budget recommendations  
- 💳 Multi-account aggregation & management  
- 📊 AI-powered expense categorization (Groq integration)  
- 📈 Interactive financial insights dashboard  
- 🔄 Automated bank statement processing  
- 🔐 Secure user authentication & authorization  
- 📤 Email notifications & report generation  

## Tech Stack 🛠️

**Frontend**:  
- React 18 + Vite  
- React Router 6  

**Backend**:  
- FastAPI  
- SQLAlchemy + PostgreSQL  
- Groq API (AI Analysis)  
- (Async Tasks)  
- JWT Authentication  

```
fintrack/
└── backend/
    ├── app/
    │   ├── core/                  
    │   │   ├── __init__.py
    │   │   ├── config.py          # Environment variables
    │   │   ├── database.py        # Database connection
    │   │   ├── logging.py         # Logging setup
    │   │   └── security.py        # JWT authentication
    │   │
    │   ├── models/                
    │   │   ├── __init__.py
    │   │   ├── transaction.py     # Transaction model
    │   │   ├── user.py            # User and profile models
    │   │   └── voucher.py         # Rewards system
    │   │
    │   ├── routes/                
    │   │   ├── __init__.py
    │   │   ├── auth.py            # Authentication
    │   │   ├── file_upload.py     # Statement uploads
    │   │   ├── health.py          # Health checks
    │   │   ├── transaction.py     # Transaction CRUD
    │   │   ├── user_detail.py     # User profiles
    │   │   └── voucher_router.py  # Rewards system
    │   │
    │   ├── schemas/               
    │   │   ├── __init__.py
    │   │   ├── transaction.py     # Transaction validation
    │   │   ├── user.py            # User schemas
    │   │   └── voucher.py         # Rewards schemas
    │   │
    │   ├── services/              
    │   │   ├── __init__.py
    │   │   ├── auth_service.py    # Authentication
    │   │   ├── category_detector.py # AI categorization
    │   │   ├── file_processor.py  # PDF/Excel extraction
    │   │   ├── groq_service.py    # LLM integration 
    │   │   ├── source_detector.py # Statement detection
    │   │   ├── transaction_service.py # Transaction processing
    │   │   └── voucher_service.py # Rewards logic
    │   │
    │   ├── utils/                 
    │   │   ├── __init__.py
    │   │   └── email.py           # Email notifications
    │   │
    │   └── main.py                # Entry point
    │
    ├── requirements.txt           # Dependencies
    ├── README.md                  # Documentation
    ├── runtime.txt                # Python version
    └── vercel.json                # Deployment config
```

```
fintrack/
└── frontend/
    ├── src/
    │   ├── components/            
    │   │   ├── common/            # Common UI elements
    │   │   ├── dashboard/         # Dashboard widgets
    │   │   ├── transactions/      # Transaction views
    │   │   └── profile/           # User profile components
    │   │
    │   ├── pages/                 
    │   │   ├── auth/              # Login/register pages
    │   │   ├── dashboard/         # Main dashboard
    │   │   ├── transactions/      # Transaction management
    │   │   └── profile/           # User profile
    │   │
    │   ├── services/              
    │   │   ├── authService.js     # Authentication API
    │   │   ├── fileService.js     # File uploads
    │   │   └── transactionService.js # Transaction API
    │   │
    │   ├── utils/                 
    │   │   ├── formatters.js      # Data formatting
    │   │   └── mockTransactionData.js # Development data
    │   │
    │   ├── assets/                # Static files
    │   └── App.jsx                # Main component
    │
    ├── package.json               # Dependencies
    └── vite.config.js             # Vite config
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+  
- Node.js 16+  
- PostgreSQL database  
- Groq API key  

```bash
# Clone the repository
git clone https://github.com/yourusername/fintrack.git
cd fintrack/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and Groq API key

# Run the application
uvicorn app.main:app --reload
```

- API will be available at: `http://localhost:8000`  
- Swagger docs at: `http://localhost:8000/docs`

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

- Frontend will be available at: `http://localhost:5173`

---

## 🔄 Transaction Processing Flow

1. **File Upload**: User uploads bank statement (PDF/Excel)  
2. **Extraction**: Backend extracts transaction data using PDFPlumber  
3. **Source Detection**: Groq AI identifies statement source (eSewa/Khalti/Bank)  
4. **Standardization**: Data is converted to a consistent format  
5. **Categorization**: Each transaction is categorized using Groq AI  
6. **Storage**: Processed transactions are saved to the database  
7. **Visualization**: Frontend displays insights and transaction history  

---

## 🧠 AI Integration

FinTrack leverages Groq's LLM API for two key features:

### 1. Source Detection

```python
async def detect_source(csv_data: str) -> Dict[str, str]:
    """Identify which financial platform a statement belongs to"""
    # Call Groq API to analyze CSV structure
    response = await ask_groq(
        system_prompt="You are a financial data expert...",
        user_prompt=f"Identify the source of this statement: {csv_data[:2000]}"
    )
    # Parse response to extract source name
    return {"source": extracted_source}
```

### 2. Transaction Categorization

---

## 🔍 API Endpoints

**Authentication**  
- `POST /api/auth/register`: Create new user account  
- `POST /api/auth/login`: Obtain JWT token  
- `POST /api/auth/refresh`: Refresh JWT token  

**Files**  
- `POST /api/files/upload`: Upload and process bank statement  

**Transactions**  
- `GET /api/transactions`: Get user transactions with pagination  
- `POST /api/transactions`: Create manual transaction  
- `PATCH /api/transactions/{id}`: Update transaction  
- `DELETE /api/transactions/{id}`: Delete transaction  

**User Profile**  
- `GET /api/users/profile`: Get current user profile  
- `PATCH /api/users/{id}/profile`: Update user profile  

---

## 📊 Database Schema

**Transaction Model**

```python
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    transaction_id = Column(String, nullable=True)  # Original ID from statement
    transaction_date = Column(Date, nullable=False)
    transaction_time = Column(Time, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)  # AI-detected category
    dr = Column(Float, default=0.0)  # Debit amount
    cr = Column(Float, default=0.0)  # Credit amount
    source = Column(String, nullable=False)  # eSewa, Khalti, etc.
    balance = Column(Float, nullable=False)
    raw_data = Column(String, nullable=True)  # Original JSON data
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="transactions")
```

---

## 🛡️ Security Features

- JWT token authentication with refresh token mechanism  
- Password hashing with bcrypt  
- Role-based access control for admin features  
- CORS protection for API endpoints  

---

## 🚧 Future Enhancements

- Add support for more Nepali financial institutions  
- Implement budget planning and tracking  

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch:  
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:  
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch:  
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request  

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Let me know if you'd like this turned into a `README.md` file or need help with the actual screenshot replacement or Groq API integration!

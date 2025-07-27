# 🧪 Demo API Service (FastAPI + MCP + PostgreSQL)

A demonstration project showcasing a modular REST API built with **FastAPI**, featuring an auxiliary **MCP server** for AI integrations and a relational **PostgreSQL** database schema.

Designed for showcasing backend architecture, clean code structure, and integration between classic APIs and AI-oriented microservices.

---

## 🚀 Features

- ⚡ FastAPI-based REST endpoints (`api_service.py`)
- 🤖 Lightweight MCP server for AI/ML integration (`mcp_service.py`)
- 🗄 PostgreSQL database schema with users, posts, tags, post-tag relations
- 🧱 SQLAlchemy 2.0 ORM models
- 🔐 Pydantic models for data validation
- 🧪 Minimal test runner (`testing.py`)

---

## 🖼 Demo Screenshots

### FastAPI OpenAPI Documentation

![FastAPI API Docs](images/api.png)

### CursorAI integration with MCP server

![CursorAI Example](images/cursorai.png)

### MCP Server usage via Postman

![MCP via Postman](images/mcp.png)

---

## 📁 Project Structure

```
demo-api-test/
├── Tools/
│   ├── __init__.py          # Declares as package
│   ├── config.py            # Constants & DB config
│   ├── db.py                # DB access logic (CRUD)
│   ├── models.py            # SQLAlchemy ORM models
│   ├── schemas.py           # Pydantic models
│   └── testing.py           # Simple test script
├── api_service.py           # Main REST API service
├── mcp_service.py           # AI/MCP integration server
├── SQL/
│   ├── schema.sql           # PostgreSQL schema (users, posts, tags)
│   └── dummy_data.sql       # Sample data
```

---

## 🛠 Setup

### 1. Clone the repository

```bash
git clone https://github.com/genry86/demo-api-test
cd demo-api-test
```

### 2. Set up the database

Use `SQL/schema.sql` to create the schema, then load test data from `SQL/dummy_data.sql`:

```bash
psql -U your_user -d your_db -f SQL/schema.sql
psql -U your_user -d your_db -f SQL/dummy_data.sql
```

Make sure your database credentials match those in `Tools/config.py`.

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

(*Note: Create `requirements.txt` if missing using `pip freeze > requirements.txt`*)

### 4. Run the API service

```bash
python api_service.py
```

### 5. Run the MCP server (optional AI interface)

```bash
python mcp_service.py
```

---

## 🎯 API Overview

Once running, access:

- Main API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- MCP API Docs: [http://localhost:9000/docs](http://localhost:9000/docs)

---

## 🧪 Testing

Quick test runner is available via:

```bash
python Tools/testing.py
```

You can customize test routines as needed.

---

## 🧠 Notes

- All modules under `Tools/` are part of a Python package (`__init__.py` is present).
- Imports follow absolute module structure (e.g., `from Tools.db import DatabaseManager`)
- SQLAlchemy relationships are `lazy="select"` to avoid unnecessary joins.
- Relationships like `posts` are loaded only when explicitly requested via `.options(selectinload(...))`.

---

## 🔗 Repository

GitHub: [https://github.com/genry86/demo-api-test](https://github.com/genry86/demo-api-test)

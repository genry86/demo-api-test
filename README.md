# 🧪 Demo API Service (FastAPI + GraphQL + MCP)

A demonstration project showcasing a modular REST API built with **FastAPI**, featuring an auxiliary **MCP server** for AI integrations and a relational **PostgreSQL** database schema.

Designed for showcasing backend architecture, clean code structure, and integration between classic APIs and AI-oriented microservices.

---

## 🚀 Features

- ⚡ FastAPI-based REST endpoints (`api_service.py`)
- 🔄 GraphQL API with Strawberry GraphQL (`graphql_service.py`)
- 🤖 Lightweight MCP server for AI/ML integration (`mcp_service.py`)
- 🗄 PostgreSQL database schema with users, posts, tags, post-tag relations
- 🧱 SQLAlchemy 2.0 ORM models
- 🔐 Pydantic models for data validation
- 🧪 Minimal test runner (`testing.py`)

---

## 🖼 Demo Screenshots

### FastAPI OpenAPI Documentation

![FastAPI API Docs](images/api.png)

### GraphQL Explorer Interface

![GraphQL Explorer](images/graphql.png)

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
├── graphql_service.py       # GraphQL API service (Strawberry + FastAPI)
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

### 2. Install and start PostgreSQL

**Critical Step:** PostgreSQL must be installed and running before proceeding.

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database (if needed)
createdb DemoApiTest
```

For other operating systems, install PostgreSQL using your package manager.

### 3. Set up the database schema

Use `SQL/schema.sql` to create the schema, then load test data from `SQL/dummy_data.sql`:

```bash
psql -U your_user -d your_db -f SQL/schema.sql
psql -U your_user -d your_db -f SQL/dummy_data.sql
```

Make sure your database credentials match those in `Tools/config.py`.

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

(*Note: Create `requirements.txt` if missing using `pip freeze > requirements.txt`*)

### 5. Run the services

```bash
# Run REST API service (port 8000)
python api_service.py

# Run GraphQL API service (port 8001)
python graphql_service.py

# Run MCP server (optional AI interface, port 9000)
python mcp_service.py
```

---

## 🎯 API Overview

Once running, access:

- **REST API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **GraphQL Playground**: [http://localhost:8001/graphql](http://localhost:8001/graphql)
- **MCP API Docs**: [http://localhost:9000/docs](http://localhost:9000/docs)

### GraphQL API Features

The GraphQL service uses **Strawberry GraphQL** in combination with **FastAPI** to provide:

- **Queries**: `user`, `users`, `post`, `posts`, `tag`, `tags` (equivalent to GET operations)
- **Mutations**: `createUser`, `updateUser`, `deleteUser`, `createPost`, `updatePost`, `deletePost`, `resetDatabase` (equivalent to POST/PUT/DELETE operations)
- **Type-safe GraphQL schema** with full relationship support
- **Interactive GraphQL Explorer** for testing queries and mutations

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

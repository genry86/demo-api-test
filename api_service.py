"""
FastAPI service providing REST endpoints for database operations.
Implements CRUD operations for users, posts, and tags with proper error handling.
Uses DatabaseManager for database operations and Pydantic schemas for validation.
"""

from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, Path, Depends
from fastapi.responses import JSONResponse

import uvicorn

from Tools import (
    DatabaseManager, 
    UserCreate, UserUpdate, UserSearch, UserResponse, 
    PostCreate, PostUpdate, PostSearch, PostResponse, 
    TagResponse
)

app = FastAPI(
    title="Demo API",
    description="REST API for managing users, posts, and tags",
    version="1.0.0"
)

# Initialize database manager
db_manager = DatabaseManager()

@app.get("/reset")
def reset_database():
    """Reset the database."""
    db_manager.reset_database()
    return {"message": "Database reset successfully"}

# User endpoints
@app.post("/users/", response_model=UserResponse, status_code=201)
def create_user(user_data: UserCreate):
    """Create a new user with the provided data."""
    try:
        user = db_manager.create_user(user_data)
        if user is None:
            raise HTTPException(status_code=400, detail="Failed to create user")
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int = Path(..., description="ID of the user to retrieve"),
    include_posts: bool = Query(True, description="Include user's posts in response")
):
    """Get user by ID with optional posts data."""
    user = db_manager.get_user(user_id, include_posts=include_posts)
    if user is None:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    return user

@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_data: UserUpdate,
    user_id: int = Path(..., description="ID of the user to update")
):
    """Update existing user with provided data."""
    try:
        user = db_manager.update_user(user_id, user_data)
        if user is None:
            raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/users/{user_id}")
def delete_user(user_id: int = Path(..., description="ID of the user to delete")):
    """Delete user by ID."""
    success = db_manager.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    return {"message": f"User {user_id} deleted successfully"}

@app.get("/users/", response_model=List[UserResponse])
def search_users(params: UserSearch = Depends()):
    """Search users with optional filters and pagination."""
    return db_manager.search_users(params)

# Post endpoints
@app.post("/posts/", response_model=PostResponse, status_code=201)
def create_post(
    post_data: PostCreate,
    author_id: int = Query(..., description="ID of the post author")
):
    """Create a new post for the specified author."""
    try:
        post = db_manager.create_post(author_id, post_data)
        if post is None:
            raise HTTPException(status_code=404, detail=f"Author with ID {author_id} not found")
        return post
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/posts/{post_id}", response_model=PostResponse)
def get_post(
    post_id: int = Path(..., description="ID of the post to retrieve"),
    include_author: bool = Query(True, description="Include author data in response"),
    include_tags: bool = Query(True, description="Include author data in response")
):
    """Get post by ID with optional author data."""
    post = db_manager.get_post(post_id, include_author=include_author, include_tags=include_tags)
    if post is None:
        raise HTTPException(status_code=404, detail=f"Post with ID {post_id} not found")
    return post

@app.put("/posts/{post_id}", response_model=PostResponse)
def update_post(
    post_data: PostUpdate,
    post_id: int = Path(..., description="ID of the post to update")
):
    """Update existing post with provided data."""
    try:
        post = db_manager.update_post(post_id, post_data)
        if post is None:
            raise HTTPException(status_code=404, detail=f"Post with ID {post_id} not found")
        return post
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/posts/{post_id}")
def delete_post(post_id: int = Path(..., description="ID of the post to delete")):
    """Delete post by ID."""
    success = db_manager.delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Post with ID {post_id} not found")
    return {"message": f"Post {post_id} deleted successfully"}

@app.get("/posts/", response_model=List[PostResponse])
def search_posts(params: PostSearch = Depends()):
    """Search posts with optional filters and pagination."""
    return db_manager.search_posts(params)

# Tag endpoints
@app.get("/tags/", response_model=List[TagResponse])
def get_all_tags(
    include_posts: bool = Query(False, description="Include tag's posts in response")
):
    """Get all tags from the database."""
    return db_manager.get_all_tags(include_posts=include_posts)

@app.get("/tags/{tag_id}", response_model=TagResponse)
def get_tag(
    tag_id: int = Path(..., description="ID of the tag to retrieve"),
    include_posts: bool = Query(True, description="Include tag's posts in response")
):
    """Get tag by ID with optional posts data."""
    tag = db_manager.get_tag(tag_id, include_posts=include_posts)
    if tag is None:
        raise HTTPException(status_code=404, detail=f"Tag with ID {tag_id} not found")
    return tag

# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint to verify API is running."""
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

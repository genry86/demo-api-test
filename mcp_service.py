from typing import List, Optional, Dict, Any
from fastmcp import FastMCP, Context
from fastmcp.utilities.types import File
import json

from Tools import (
    DatabaseManager,
    UserCreate, UserUpdate, UserSearch, UserResponse,
    PostCreate, PostUpdate, PostSearch, PostResponse,
    TagResponse
)

mcp = FastMCP(
    "Demo Users MCP Server",
    instructions="This MCP server provides comprehensive access to Users, Posts, and Tags data through tools and resources. Use tools for data modifications and resources for read-only access."
)

# Initialize database manager
db_manager = DatabaseManager()

# ========== UTILITY TOOLS ==========

@mcp.tool
def reset_database() -> str:
    """Reset the database to its initial state with dummy data."""
    db_manager.reset_database()
    return "Database reset successfully"
 

# ========== USER TOOLS ==========

@mcp.tool
def create_user(user_data: UserCreate) -> dict:
    """Create a new user with the provided data."""
    try:
        user = db_manager.create_user(user_data)
        if user is None:
            raise Exception("Failed to create user")
        return user.model_dump()
    except Exception as e:
        raise ValueError(f"Failed to create user: {str(e)}")

@mcp.tool
def update_user(user_id: int, user_data: UserUpdate) -> dict:
    """Update existing user with provided data."""
    try:
        user = db_manager.update_user(user_id, user_data)
        if user is None:
            raise Exception(f"User with ID {user_id} not found")
        return user.model_dump()
    except Exception as e:
        raise ValueError(f"Failed to update user: {str(e)}")

@mcp.tool
def delete_user(user_id: int) -> str:
    """Delete user by ID."""
    success = db_manager.delete_user(user_id)
    if not success:
        raise ValueError(f"User with ID {user_id} not found")
    return f"User {user_id} deleted successfully"

@mcp.tool
def search_users(search_params: UserSearch) -> List:
    """Search users with optional filters and pagination."""
    users = db_manager.search_users(search_params)
    return [user.model_dump() for user in users]

@mcp.tool
def get_user(user_id: int, include_posts: bool = True) -> dict:
    """Get user by ID with optional posts data."""
    user = db_manager.get_user(user_id, include_posts=include_posts)
    if user is None:
        raise ValueError(f"User with ID {user_id} not found")
    return user.model_dump()

# ========== POST TOOLS ==========

@mcp.tool
def create_post(author_id: int, post_data: PostCreate) -> dict:
    """Create a new post for the specified author."""
    try:
        post = db_manager.create_post(author_id, post_data)
        if post is None:
            raise Exception(f"Author with ID {author_id} not found")
        return post.model_dump()
    except ValueError as e:
        raise ValueError(str(e))
    except Exception as e:
        raise Exception(f"Failed to create post: {str(e)}")

@mcp.tool
def update_post(post_id: int, post_data: PostUpdate) -> dict:
    """Update existing post with provided data."""
    try:
        post = db_manager.update_post(post_id, post_data)
        if post is None:
            raise Exception(f"Post with ID {post_id} not found")
        return post.model_dump()
    except ValueError as e:
        raise ValueError(str(e))
    except Exception as e:
        raise Exception(f"Failed to update post: {str(e)}")

@mcp.tool
def delete_post(post_id: int) -> str:
    """Delete post by ID."""
    success = db_manager.delete_post(post_id)
    if not success:
        raise ValueError(f"Post with ID {post_id} not found")
    return f"Post {post_id} deleted successfully"

@mcp.tool
def search_posts(search_params: PostSearch) -> List:
    """Search posts with optional filters and pagination."""
    posts = db_manager.search_posts(search_params)
    return [post.model_dump() for post in posts]

@mcp.tool
def get_post(
    post_id: int, 
    include_author: bool = True, 
    include_tags: bool = True
) -> dict:
    """Get post by ID with optional author and tags data."""
    post = db_manager.get_post(post_id, include_author=include_author, include_tags=include_tags)
    if post is None:
        raise ValueError(f"Post with ID {post_id} not found")
    return post.model_dump()

# ========== TAG TOOLS ==========

@mcp.tool
def get_all_tags(include_posts: bool = False) -> List:
    """Get all tags from the database."""
    tags = db_manager.get_all_tags(include_posts=include_posts)
    return [tag.model_dump() for tag in tags]

@mcp.tool
def get_tag(tag_id: int, include_posts: bool = True) -> dict:
    """Get tag by ID with optional posts data."""
    tag = db_manager.get_tag(tag_id, include_posts=include_posts)
    if tag is None:
        raise ValueError(f"Tag with ID {tag_id} not found")
    return tag.model_dump()

# ========== RESOURCES ==========
 
@mcp.resource(uri="data://config")
def get_config() -> str:
    """Provides the application configuration as JSON."""
    config = {
        "application": "Demo Users MCP Server",
        "version": "1.0.0",
        "database": "PostgreSQL",
        "features": {
            "users": True,
            "posts": True,
            "tags": True,
            "relationships": True
        },
        "endpoints": {
            "tools": [
                "create_user", "update_user", "delete_user", "search_users", "get_user",
                "create_post", "update_post", "delete_post", "search_posts", "get_post",
                "get_all_tags", "get_tag", "reset_database"
            ],
            "resources": [
                "data://user/{user_id}",
                "data://post/{post_id}",
                "data://tag/{tag_id}",
                "data://tags",
                "data://config"
            ]
        }
    }
    return json.dumps(config, indent=2)

# ========== HEALTH CHECK RESOURCE ==========

@mcp.resource(uri="data://health")
def health_check() -> str:
    """Health check resource to verify MCP server is running."""
    health_info = {
        "status": "healthy",
        "message": "MCP server is running",
        "timestamp": "2024-01-01T00:00:00Z",
        "database_connected": True,
        "version": "1.0.0"
    }
    return json.dumps(health_info, indent=2)

if __name__ == "__main__":
    mcp.run(
        transport="http", 
        host="127.0.0.1", 
        port=9000, 
        log_level="DEBUG"
    )
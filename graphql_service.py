"""
GraphQL service providing GraphQL endpoints for database operations.
Implements queries and mutations for users, posts, and tags using Strawberry GraphQL.
Uses DatabaseManager for database operations and mirrors REST API functionality.
"""

from typing import List, Optional
from datetime import date, datetime
import strawberry
from strawberry.fastapi import GraphQLRouter
from fastapi import FastAPI
import uvicorn

from Tools import (
    DatabaseManager,
    UserCreate, UserUpdate, UserSearch, UserResponse,
    PostCreate, PostUpdate, PostSearch, PostResponse,
    TagResponse
)

# Initialize database manager
db_manager = DatabaseManager()

# GraphQL Types
@strawberry.type
class UserMinimal:
    """Minimal user data for post author reference."""
    id: int
    first_name: str
    last_name: str
    nickname: str

@strawberry.type
class PostMinimal:
    """Minimal post data for user's posts and tag's posts references."""
    id: int
    author_id: int
    title: str
    content: str
    is_published: bool
    created_at: datetime
    updated_at: datetime

@strawberry.type
class TagMinimal:
    """Minimal tag data for post's tags reference."""
    id: int
    title: str
    description: Optional[str] = None

@strawberry.type
class User:
    """GraphQL User type with all user attributes and relationships."""
    id: int
    first_name: str
    last_name: str
    nickname: str
    email: str
    birthdate: date
    location: Optional[str] = None
    gender: Optional[str] = None
    job_title: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime
    posts: List[PostMinimal] = strawberry.field(default_factory=list)

@strawberry.type
class Post:
    """GraphQL Post type with all post attributes and relationships."""
    id: int
    author_id: int
    title: str
    content: str
    is_published: bool
    rating: int
    views: int
    created_at: datetime
    updated_at: datetime
    author: Optional[UserMinimal] = None
    tags: List[TagMinimal] = strawberry.field(default_factory=list)

@strawberry.type
class Tag:
    """GraphQL Tag type with all tag attributes and relationships."""
    id: int
    title: str
    description: Optional[str] = None
    created_at: datetime
    posts: List[PostMinimal] = strawberry.field(default_factory=list)

# Input Types for mutations
@strawberry.input
class UserCreateInput:
    """Input type for creating users."""
    first_name: str
    last_name: str
    nickname: str
    email: str
    password: str
    birthdate: date
    location: Optional[str] = None
    gender: Optional[str] = None
    job_title: Optional[str] = None
    phone: Optional[str] = None

@strawberry.input
class UserUpdateInput:
    """Input type for updating users."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    nickname: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    birthdate: Optional[date] = None
    location: Optional[str] = None
    gender: Optional[str] = None
    job_title: Optional[str] = None
    phone: Optional[str] = None

@strawberry.input
class UserSearchInput:
    """Input type for searching users."""
    nickname: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    job_title: Optional[str] = None
    include_posts: bool = False
    skip: int = 0
    limit: int = 100

@strawberry.input
class PostCreateInput:
    """Input type for creating posts."""
    title: str
    content: str
    is_published: bool = True
    tag_ids: Optional[List[int]] = None

@strawberry.input
class PostUpdateInput:
    """Input type for updating posts."""
    title: Optional[str] = None
    content: Optional[str] = None
    is_published: Optional[bool] = None
    tag_ids: Optional[List[int]] = None

@strawberry.input
class PostSearchInput:
    """Input type for searching posts."""
    title: Optional[str] = None
    content: Optional[str] = None
    include_author: bool = True
    include_tags: bool = False
    skip: int = 0
    limit: int = 100

# Helper functions to convert Pydantic models to GraphQL types
def user_response_to_graphql(user_response: UserResponse) -> User:
    """Convert UserResponse to GraphQL User type."""
    return User(
        id=user_response.id,
        first_name=user_response.first_name,
        last_name=user_response.last_name,
        nickname=user_response.nickname,
        email=user_response.email,
        birthdate=user_response.birthdate,
        location=user_response.location,
        gender=user_response.gender,
        job_title=user_response.job_title,
        phone=user_response.phone,
        created_at=user_response.created_at,
        posts=[PostMinimal(
            id=post.id,
            author_id=post.author_id,
            title=post.title,
            content=post.content,
            is_published=post.is_published,
            created_at=post.created_at,
            updated_at=post.updated_at
        ) for post in user_response.posts]
    )

def post_response_to_graphql(post_response: PostResponse) -> Post:
    """Convert PostResponse to GraphQL Post type."""
    author = None
    if post_response.author:
        author = UserMinimal(
            id=post_response.author.id,
            first_name=post_response.author.first_name,
            last_name=post_response.author.last_name,
            nickname=post_response.author.nickname
        )

    return Post(
        id=post_response.id,
        author_id=post_response.author_id,
        title=post_response.title,
        content=post_response.content,
        is_published=post_response.is_published,
        rating=post_response.rating,
        views=post_response.views,
        created_at=post_response.created_at,
        updated_at=post_response.updated_at,
        author=author,
        tags=[TagMinimal(
            id=tag.id,
            title=tag.title,
            description=tag.description
        ) for tag in post_response.tags]
    )

def tag_response_to_graphql(tag_response: TagResponse) -> Tag:
    """Convert TagResponse to GraphQL Tag type."""
    return Tag(
        id=tag_response.id,
        title=tag_response.title,
        description=tag_response.description,
        created_at=tag_response.created_at,
        posts=[PostMinimal(
            id=post.id,
            author_id=post.author_id,
            title=post.title,
            content=post.content,
            is_published=post.is_published,
            created_at=post.created_at,
            updated_at=post.updated_at
        ) for post in tag_response.posts]
    )

# GraphQL Queries
@strawberry.type
class Query:
    """GraphQL queries for reading data."""

    @strawberry.field
    def user(self, user_id: int, include_posts: bool = True) -> Optional[User]:
        """Get user by ID with optional posts data."""
        user_response = db_manager.get_user(user_id, include_posts=include_posts)
        if user_response is None:
            return None
        return user_response_to_graphql(user_response)

    @strawberry.field
    def users(self, search_params: Optional[UserSearchInput] = None) -> List[User]:
        """Search users with optional filters and pagination."""
        if search_params is None:
            search_params = UserSearchInput()

        search_obj = UserSearch(
            nickname=search_params.nickname,
            email=search_params.email,
            location=search_params.location,
            job_title=search_params.job_title,
            include_posts=search_params.include_posts,
            skip=search_params.skip,
            limit=search_params.limit
        )
        user_responses = db_manager.search_users(search_obj)
        return [user_response_to_graphql(user) for user in user_responses]

    @strawberry.field
    def post(self, post_id: int, include_author: bool = True, include_tags: bool = True) -> Optional[Post]:
        """Get post by ID with optional author and tags data."""
        post_response = db_manager.get_post(post_id, include_author=include_author, include_tags=include_tags)
        if post_response is None:
            return None
        return post_response_to_graphql(post_response)

    @strawberry.field
    def posts(self, search_params: Optional[PostSearchInput] = None) -> List[Post]:
        """Search posts with optional filters and pagination."""
        if search_params is None:
            search_params = PostSearchInput()

        search_obj = PostSearch(
            title=search_params.title,
            content=search_params.content,
            include_author=search_params.include_author,
            include_tags=search_params.include_tags,
            skip=search_params.skip,
            limit=search_params.limit
        )
        post_responses = db_manager.search_posts(search_obj)
        return [post_response_to_graphql(post) for post in post_responses]

    @strawberry.field
    def tag(self, tag_id: int, include_posts: bool = True) -> Optional[Tag]:
        """Get tag by ID with optional posts data."""
        tag_response = db_manager.get_tag(tag_id, include_posts=include_posts)
        if tag_response is None:
            return None
        return tag_response_to_graphql(tag_response)

    @strawberry.field
    def tags(self, include_posts: bool = False) -> List[Tag]:
        """Get all tags from the database."""
        tag_responses = db_manager.get_all_tags(include_posts=include_posts)
        return [tag_response_to_graphql(tag) for tag in tag_responses]

# GraphQL Mutations
@strawberry.type
class Mutation:
    """GraphQL mutations for modifying data."""

    @strawberry.mutation
    def create_user(self, user_data: UserCreateInput) -> User:
        """Create a new user with the provided data."""
        try:
            user_create = UserCreate(
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                nickname=user_data.nickname,
                email=user_data.email,
                password=user_data.password,
                birthdate=user_data.birthdate,
                location=user_data.location,
                gender=user_data.gender,
                job_title=user_data.job_title,
                phone=user_data.phone
            )
            user_response = db_manager.create_user(user_create)
            if user_response is None:
                raise Exception("Failed to create user")
            return user_response_to_graphql(user_response)
        except Exception as e:
            raise Exception(f"Failed to create user: {str(e)}")

    @strawberry.mutation
    def update_user(self, user_id: int, user_data: UserUpdateInput) -> Optional[User]:
        """Update existing user with provided data."""
        try:
            user_update = UserUpdate(
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                nickname=user_data.nickname,
                email=user_data.email,
                password=user_data.password,
                birthdate=user_data.birthdate,
                location=user_data.location,
                gender=user_data.gender,
                job_title=user_data.job_title,
                phone=user_data.phone
            )
            user_response = db_manager.update_user(user_id, user_update)
            if user_response is None:
                return None
            return user_response_to_graphql(user_response)
        except Exception as e:
            raise Exception(f"Failed to update user: {str(e)}")

    @strawberry.mutation
    def delete_user(self, user_id: int) -> bool:
        """Delete user by ID."""
        return db_manager.delete_user(user_id)

    @strawberry.mutation
    def create_post(self, author_id: int, post_data: PostCreateInput) -> Post:
        """Create a new post for the specified author."""
        try:
            post_create = PostCreate(
                title=post_data.title,
                content=post_data.content,
                is_published=post_data.is_published,
                tag_ids=post_data.tag_ids
            )
            post_response = db_manager.create_post(author_id, post_create)
            if post_response is None:
                raise Exception(f"Author with ID {author_id} not found")
            return post_response_to_graphql(post_response)
        except ValueError as e:
            raise Exception(str(e))
        except Exception as e:
            raise Exception(f"Failed to create post: {str(e)}")

    @strawberry.mutation
    def update_post(self, post_id: int, post_data: PostUpdateInput) -> Optional[Post]:
        """Update existing post with provided data."""
        try:
            post_update = PostUpdate(
                title=post_data.title,
                content=post_data.content,
                is_published=post_data.is_published,
                tag_ids=post_data.tag_ids
            )
            post_response = db_manager.update_post(post_id, post_update)
            if post_response is None:
                return None
            return post_response_to_graphql(post_response)
        except ValueError as e:
            raise Exception(str(e))
        except Exception as e:
            raise Exception(f"Failed to update post: {str(e)}")

    @strawberry.mutation
    def delete_post(self, post_id: int) -> bool:
        """Delete post by ID."""
        return db_manager.delete_post(post_id)

    @strawberry.mutation
    def reset_database(self) -> bool:
        """Reset the database to its initial state with dummy data."""
        try:
            db_manager.reset_database()
            return True
        except Exception:
            return False

# Create GraphQL schema
schema = strawberry.Schema(query=Query, mutation=Mutation)

# Create FastAPI app
app = FastAPI(
    title="Demo GraphQL API",
    description="GraphQL API for managing users, posts, and tags using Strawberry",
    version="1.0.0"
)

# Add GraphQL router
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint to verify GraphQL API is running."""
    return {"status": "healthy", "message": "GraphQL API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
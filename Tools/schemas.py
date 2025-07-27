"""
Pydantic models for request/response data validation and serialization.
Provides type safety and validation for database operations.
Includes models for creating, updating, and querying database records.
"""

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict

class BaseResponseModel(BaseModel):
    """Base class for all response models with datetime serialization."""
    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={datetime: lambda v: v.isoformat()}
    )

# User-related models
class UserBase(BaseModel):
    """Base user model with common attributes for validation."""
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    nickname: str = Field(..., min_length=1, max_length=30)
    email: EmailStr
    birthdate: date
    location: Optional[str] = Field(None, max_length=100)
    gender: Optional[str] = Field(None, max_length=20)
    job_title: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)

class UserCreate(UserBase):
    """Model for creating new users with password field."""
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    """Model for updating existing user data with all fields optional."""
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    nickname: Optional[str] = Field(None, min_length=1, max_length=30)
    email: Optional[EmailStr] = None
    birthdate: Optional[date] = None
    location: Optional[str] = Field(None, max_length=100)
    gender: Optional[str] = Field(None, max_length=20)
    job_title: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    password: Optional[str] = Field(None, min_length=6)

class UserSearch(BaseModel):
    """Model for user search criteria with pagination."""
    nickname: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    job_title: Optional[str] = None
    include_posts: bool = False
    skip: int = Field(0, ge=0, description="Number of records to skip")
    limit: int = Field(100, ge=1, le=1000, description="Maximum number of records to return")

class UserMinimalResponse(BaseResponseModel):
    """Minimal user data for post author reference."""
    id: int
    first_name: str
    last_name: str
    nickname: str

class UserResponse(UserBase, BaseResponseModel):
    """Model for user data in API responses including relationships."""
    id: int
    created_at: datetime
    posts: List["PostMinimalResponse"] = []

# Post-related models
class PostBase(BaseModel):
    """Base post model with common attributes for validation."""
    title: str = Field(..., min_length=1, max_length=200)
    content: str
    is_published: bool = True

class PostCreate(PostBase):
    """Model for creating new posts with optional tag associations."""
    tag_ids: Optional[List[int]] = None

class PostUpdate(BaseModel):
    """Model for updating existing post data with all fields optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = None
    is_published: Optional[bool] = None
    tag_ids: Optional[List[int]] = None

class PostSearch(BaseModel):
    """Model for post search criteria with pagination."""
    title: Optional[str] = None
    content: Optional[str] = None
    include_author: bool = True
    include_tags: bool = False
    skip: int = Field(0, ge=0, description="Number of records to skip")
    limit: int = Field(100, ge=1, le=1000, description="Maximum number of records to return")

class PostMinimalResponse(PostBase, BaseResponseModel):
    """Minimal post data for user's posts and tag's posts references."""
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime

class PostResponse(PostBase, BaseResponseModel):
    """Model for post data in API responses including relationships."""
    id: int
    author_id: int
    author: Optional[UserMinimalResponse] = None
    rating: int = 0
    views: int = 0
    created_at: datetime
    updated_at: datetime
    tags: List["TagMinimalResponse"] = []

# Tag-related models
class TagBase(BaseModel):
    """Base tag model with common attributes for validation."""
    title: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None

class TagCreate(TagBase):
    """Model for creating new tags."""
    pass

class TagUpdate(BaseModel):
    """Model for updating existing tag data with all fields optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = None

class TagMinimalResponse(TagBase, BaseResponseModel):
    """Minimal tag data for post's tags reference."""
    id: int

class TagResponse(TagBase, BaseResponseModel):
    """Model for tag data in API responses including relationships."""
    id: int
    created_at: datetime
    posts: List[PostMinimalResponse] = []

# Forward references for relationships
UserResponse.model_rebuild()
PostResponse.model_rebuild()
TagResponse.model_rebuild() 
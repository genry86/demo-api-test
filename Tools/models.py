"""
SQLAlchemy ORM models for the database.
Defines the structure and relationships of database tables.
Uses SQLAlchemy 2.0 style declarations with type hints.
"""

from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import ForeignKey, String, Integer, Date, DateTime, Boolean, Text, Table, Column
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    """Base class for all database models."""
    pass

# Association table for Posts and Tags many-to-many relationship
posts_tags = Table(
    "posts_tags",
    Base.metadata,
    Column("post_id", Integer, ForeignKey("public.posts.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("public.tags.id", ondelete="CASCADE"), primary_key=True),
    Column("created_at", DateTime, default=datetime.utcnow),
    schema="public"
)

class User(Base):
    """User model for storing user account information and profile data."""
    __tablename__ = "users"
    __table_args__ = {'schema': 'public'}
    
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    nickname: Mapped[str] = mapped_column(String(30), unique=True)
    password: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(100), unique=True)
    birthdate: Mapped[date] = mapped_column(Date)
    location: Mapped[Optional[str]] = mapped_column(String(100))
    gender: Mapped[Optional[str]] = mapped_column(String(20))
    job_title: Mapped[Optional[str]] = mapped_column(String(100))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    posts: Mapped[Optional[List["Post"]]] = relationship("Post", back_populates="author", cascade="all, delete-orphan", lazy="select")

class Post(Base):
    """Post model for storing blog posts and articles with metadata."""
    __tablename__ = "posts"
    __table_args__ = {'schema': 'public'}
    
    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("public.users.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    rating: Mapped[int] = mapped_column(Integer, default=0)
    views: Mapped[int] = mapped_column(Integer, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    author: Mapped["User"] = relationship("User", back_populates="posts", lazy="select")
    tags: Mapped[List["Tag"]] = relationship("Tag", secondary=posts_tags, back_populates="posts", lazy="select")

class Tag(Base):
    """Tag model for categorizing and organizing posts."""
    __tablename__ = "tags"
    __table_args__ = {'schema': 'public'}
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(50), unique=True)
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    posts: Mapped[List["Post"]] = relationship("Post", secondary=posts_tags, back_populates="tags", lazy="select") 
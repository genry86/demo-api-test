"""
Database management module providing a high-level interface for database operations.
Implements CRUD operations, search functionality, and relationship management.
Uses SQLAlchemy for database interactions and Pydantic for data validation.
"""

from contextlib import contextmanager
from typing import Any, Dict, List, Optional, Type, TypeVar, Generic

from sqlalchemy import create_engine, select, or_, and_, text, inspect
from sqlalchemy.orm import Session, joinedload, noload, selectinload

from Tools.config import settings
from Tools.models import Base, User, Post, Tag
from Tools.schemas import (
    UserCreate, UserUpdate, UserSearch, UserResponse, UserMinimalResponse,
    PostCreate, PostUpdate, PostSearch, PostResponse, PostMinimalResponse,
    TagCreate, TagUpdate, TagResponse, TagMinimalResponse
)

T = TypeVar('T')

class DatabaseManager:
    """
    Main database interface providing methods for all database operations.
    Handles connection management, CRUD operations, and complex queries.
    """
    
    def __init__(self):
        """Initialize database connection and create tables if they don't exist."""
        self.engine = create_engine(settings.DATABASE_URL)
        self._session = None
        Base.metadata.create_all(self.engine)
    
    @contextmanager
    def get_session(self) -> Session:
        """Context manager for database sessions with automatic commit/rollback."""
        if self._session is None:
            self._session = Session(self.engine)
        
        try:
            yield self._session
            self._session.commit()
        except Exception:
            self._session.rollback()
            raise
    
    def close_session(self):
        """Explicitly close the current session."""
        if self._session:
            self._session.close()
            self._session = None
    
    def reset_database(self) -> None:
        """Reset database to initial state and load dummy data."""
        self.close_session()
        
        Base.metadata.drop_all(self.engine)
        Base.metadata.create_all(self.engine)
        
        dummy_data_path = settings.SQL_DIR / "dummy_data.sql"
        with open(dummy_data_path, "r") as f:
            sql_script = f.read()
        
        with self.get_session() as session:
            for statement in sql_script.split(";"):
                if statement.strip():
                    session.execute(text(statement))
    
    def _get_by_id(self, session: Session, model: Type[T], id: int) -> Optional[T]:
        """Generic method to get model instance by ID."""
        return session.get(model, id)
    
    def _create(self, session: Session, model: Type[T], data: Dict[str, Any]) -> T:
        """Generic method to create new model instance."""
        db_obj = model(**data)
        session.add(db_obj)
        session.flush()
        return db_obj
    
    def _update(self, session: Session, db_obj: T, data: Dict[str, Any]) -> T:
        """Generic method to update model instance."""
        for key, value in data.items():
            if hasattr(db_obj, key):
                setattr(db_obj, key, value)
        session.flush()
        return db_obj
    
    def _delete(self, session: Session, db_obj: T) -> None:
        """Generic method to delete model instance."""
        session.delete(db_obj)
        session.flush()
    
    # User operations
    def create_user(self, user_data: UserCreate) -> Optional[UserResponse]:
        """Create new user from validated data."""
        with self.get_session() as session:
            user = self._create(session, User, user_data.model_dump())
            return UserResponse.model_validate(user)
    
    def get_user(self, user_id: int, include_posts: bool = True) -> Optional[UserResponse]:
        """Get user by ID with optional post data."""
        with self.get_session() as session:
            query = select(User).options(
                selectinload(User.posts) if include_posts else noload(User.posts)
            )
            if user := session.execute(query.filter(User.id == user_id)).scalar_one_or_none():
                return UserResponse.model_validate(user)
        return None
    
    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[UserResponse]:
        """Update existing user with validated data."""
        with self.get_session() as session:
            if db_user := self._get_by_id(session, User, user_id):
                updated_user = self._update(session, db_user, user_data.model_dump(exclude_unset=True))
                return UserResponse.model_validate(updated_user)
        return None
    
    def delete_user(self, user_id: int) -> bool:
        """Delete user by ID."""
        with self.get_session() as session:
            if db_user := self._get_by_id(session, User, user_id):
                self._delete(session, db_user)
                return True
        return False
   
    def search_users(self, search_params: UserSearch) -> List[UserResponse]:
        """Search users with filters and pagination."""
        with self.get_session() as session:
            query = select(User).options(
                selectinload(User.posts) if search_params.include_posts else noload(User.posts)
            )

            filters = []
            if search_params.nickname:
                filters.append(User.nickname.ilike(f"%{search_params.nickname}%"))
            if search_params.email:
                filters.append(User.email.ilike(f"%{search_params.email}%"))
            if search_params.location:
                filters.append(User.location.ilike(f"%{search_params.location}%"))
            if search_params.job_title:
                filters.append(User.job_title.ilike(f"%{search_params.job_title}%"))
            
            if filters:
                query = query.filter(or_(*filters))
            
            users = session.execute(query.offset(search_params.skip).limit(search_params.limit)).scalars().all()
            return [UserResponse.model_validate(user) for user in users]
    
    # Post operations
    def create_post(self, author_id: int, post_data: PostCreate) -> Optional[PostResponse]:
        """Create new post with tags for specified author."""
        with self.get_session() as session:
            if not self._get_by_id(session, User, author_id):
                return None
            
            post = Post(
                author_id=author_id,
                title=post_data.title,
                content=post_data.content,
                is_published=post_data.is_published
            )
            
            if post_data.tag_ids:
                tags = session.execute(
                    select(Tag).where(Tag.id.in_(post_data.tag_ids))
                ).scalars().all()
                
                if len(tags) != len(post_data.tag_ids):
                    missing_ids = set(post_data.tag_ids) - {tag.id for tag in tags}
                    raise ValueError(f"Tags not found: {missing_ids}")
                
                post.tags = tags
            
            session.add(post)
            session.flush()
            return PostResponse.model_validate(post)
    
    def get_post(self, post_id: int, include_author: bool = True, include_tags: bool = True) -> Optional[PostResponse]:
        """Get post by ID with optional author data."""
        with self.get_session() as session:
            query = select(Post).options(
                joinedload(Post.author) if include_author else noload(Post.author),
                selectinload(Post.tags) if include_tags else noload(Post.tags)
            )
            if post := session.execute(query.filter(Post.id == post_id)).scalar_one_or_none():
                return PostResponse.model_validate(post)
        return None
    
    def update_post(self, post_id: int, post_data: PostUpdate) -> Optional[PostResponse]:
        """Update existing post with validated data."""
        with self.get_session() as session:
            if db_post := self._get_by_id(session, Post, post_id):
                update_data = post_data.model_dump(exclude_unset=True)
                
                if 'tag_ids' in update_data:
                    tag_ids = update_data.pop('tag_ids')
                    if tag_ids is not None:
                        tags = session.execute(
                            select(Tag).where(Tag.id.in_(tag_ids))
                        ).scalars().all()
                        
                        if len(tags) != len(tag_ids):
                            missing_ids = set(tag_ids) - {tag.id for tag in tags}
                            raise ValueError(f"Tags not found: {missing_ids}")
                        
                        db_post.tags = tags
                
                updated_post = self._update(session, db_post, update_data)
                return PostResponse.model_validate(updated_post)
        return None
    
    def delete_post(self, post_id: int) -> bool:
        """Delete post by ID."""
        with self.get_session() as session:
            if db_post := self._get_by_id(session, Post, post_id):
                self._delete(session, db_post)
                return True
        return False
    
    def search_posts(self, search_params: PostSearch) -> List[PostResponse]:
        """Search posts with filters and pagination."""
        with self.get_session() as session:
            query = select(Post).options(
                joinedload(Post.author) if search_params.include_author else noload(Post.author),
                selectinload(Post.tags) if search_params.include_tags else noload(Post.tags)
            )

            filters = []
            if search_params.title:
                filters.append(Post.title.ilike(f"%{search_params.title}%"))
            if search_params.content:
                filters.append(Post.content.ilike(f"%{search_params.content}%"))
            
            if filters:
                query = query.filter(or_(*filters))
            
            posts = session.execute(query.offset(search_params.skip).limit(search_params.limit)).scalars().all()
            return [PostResponse.model_validate(post) for post in posts]
    
    # Tag operations
    def create_tag(self, tag_data: TagCreate) -> TagResponse:
        """Create new tag from validated data."""
        with self.get_session() as session:
            tag = self._create(session, Tag, tag_data.model_dump())
            return TagResponse.model_validate(tag)
    
    def get_tag(self, tag_id: int, include_posts: bool = True) -> Optional[TagResponse]:
        """Get tag by ID with optional post data."""
        with self.get_session() as session:
            query = select(Tag).options(
                selectinload(Tag.posts) if include_posts else noload(Tag.posts)
            )
            if tag := session.execute(query.filter(Tag.id == tag_id)).scalar_one_or_none():
                return TagResponse.model_validate(tag)
        return None
    
    def update_tag(self, tag_id: int, tag_data: TagUpdate) -> Optional[TagResponse]:
        """Update existing tag with validated data."""
        with self.get_session() as session:
            if db_tag := self._get_by_id(session, Tag, tag_id):
                updated_tag = self._update(session, db_tag, tag_data.model_dump(exclude_unset=True))
                return TagResponse.model_validate(updated_tag)
        return None
    
    def delete_tag(self, tag_id: int) -> bool:
        """Delete tag by ID."""
        with self.get_session() as session:
            if db_tag := self._get_by_id(session, Tag, tag_id):
                self._delete(session, db_tag)
                return True
        return False
    
    def get_all_tags(self, include_posts: bool = True) -> List[TagResponse]:
        """Get all tags from the database."""
        with self.get_session() as session:
            query = select(Tag).options(
                selectinload(Tag.posts) if include_posts else noload(Tag.posts)
            )
            tags = session.execute(query).scalars().all()
            return [TagResponse.model_validate(tag) for tag in tags] 
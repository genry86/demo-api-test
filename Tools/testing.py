"""Test module for DatabaseManager functionality and API endpoints."""

from datetime import date, datetime
import unittest
from typing import List

import sys
import os
path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Tools.db import DatabaseManager
from Tools.schemas import (
    UserCreate, UserUpdate, UserSearch,
    PostCreate, PostUpdate, PostSearch,
    TagCreate, TagUpdate
)

class TestDatabaseManager(unittest.TestCase):
    """Test cases for DatabaseManager class."""
    
    def setUp(self):
        """Initialize test environment before each test."""
        self.db = DatabaseManager()
        self.db.reset_database()  # Start with fresh data for each test
    
    def test_user_operations(self):
        """Test all user-related operations."""
        # Create user
        user_data = UserCreate(
            first_name="Test",
            last_name="User",
            nickname="testuser",
            email="test@example.com",
            password="testpass123",
            birthdate=date(1990, 1, 1),
            location="Test City",
            gender="Other",
            job_title="Tester",
            phone="+1-555-0123"
        )
        user = self.db.create_user(user_data)
        self.assertIsNotNone(user)
        self.assertEqual(user.email, "test@example.com")
        
        # Get user
        retrieved_user = self.db.get_user(user.id)
        self.assertIsNotNone(retrieved_user)
        self.assertEqual(retrieved_user.nickname, "testuser")
        
        # Get user with posts
        user_with_posts = self.db.get_user(user.id, include_posts=True)
        self.assertIsNotNone(user_with_posts)
        self.assertEqual(len(user_with_posts.posts), 0)  # No posts yet
        
        # Update user
        update_data = UserUpdate(
            job_title="Senior Tester",
            location="New Test City"
        )
        updated_user = self.db.update_user(user.id, update_data)
        self.assertIsNotNone(updated_user)
        self.assertEqual(updated_user.job_title, "Senior Tester")
        
        # Search users
        search_params = UserSearch(
            job_title="Tester"
        )
        found_users = self.db.search_users(search_params)
        self.assertGreater(len(found_users), 0)
        
        # Test search with pagination
        search_with_pagination = UserSearch(
            job_title="Tester",
            skip=0,
            limit=1
        )
        paginated_users = self.db.search_users(search_with_pagination)
        self.assertEqual(len(paginated_users), 1)
 
        # Delete user
        deleted = self.db.delete_user(user.id)
        self.assertTrue(deleted)
        self.assertIsNone(self.db.get_user(user.id))
    
    def test_tag_operations(self):
        """Test all tag-related operations."""
        # Create tag
        tag_data = TagCreate(
            title="TestTag",
            description="Test tag description"
        )
        tag = self.db.create_tag(tag_data)
        self.assertIsNotNone(tag)
        self.assertEqual(tag.title, "TestTag")
        
        # Get tag
        retrieved_tag = self.db.get_tag(tag.id)
        self.assertIsNotNone(retrieved_tag)
        self.assertEqual(retrieved_tag.description, "Test tag description")
        
        # Get tag with posts
        tag_with_posts = self.db.get_tag(tag.id, include_posts=True)
        self.assertIsNotNone(tag_with_posts)
        self.assertEqual(len(tag_with_posts.posts), 0)  # No posts yet
        
        # Update tag
        update_data = TagUpdate(
            description="Updated test tag description"
        )
        updated_tag = self.db.update_tag(tag.id, update_data)
        self.assertIsNotNone(updated_tag)
        self.assertEqual(updated_tag.description, "Updated test tag description")
        
        # Get all tags
        all_tags = self.db.get_all_tags()
        self.assertGreater(len(all_tags), 0)
        
        # Delete tag
        deleted = self.db.delete_tag(tag.id)
        self.assertTrue(deleted)
        self.assertIsNone(self.db.get_tag(tag.id))
    
    def test_post_operations(self):
        """Test all create-related operations."""
        # First create a user and tags
        user_data = UserCreate(
            first_name="Post",
            last_name="Author",
            nickname="postauthor",
            email="author@example.com",
            password="author123",
            birthdate=date(1990, 1, 1),
            location=None,
            gender=None,
            job_title=None,
            phone=None
        )
        user = self.db.create_user(user_data)
        
        tag1 = self.db.create_tag(TagCreate(title="Tag1"))
        tag2 = self.db.create_tag(TagCreate(title="Tag2"))
        
        # Create post
        post_data = PostCreate(
            title="Test Post",
            content="Test post content",
            is_published=True,
            tag_ids=[tag1.id, tag2.id]
        )
        post = self.db.create_post(user.id, post_data)
        self.assertIsNotNone(post)
        self.assertEqual(post.title, "Test Post")
        self.assertEqual(len(post.tags), 2)
        
        # Get post
        retrieved_post = self.db.get_post(post.id)
        self.assertIsNotNone(retrieved_post)
        self.assertEqual(retrieved_post.content, "Test post content")
        
        # Get post with author
        post_with_author = self.db.get_post(post.id, include_author=True)
        self.assertIsNotNone(post_with_author)
        self.assertEqual(post_with_author.author.nickname, "postauthor")
        
        # Update post
        update_data = PostUpdate(
            title="Updated Test Post",
            tag_ids=[tag1.id]  # Remove one tag
        )
        updated_post = self.db.update_post(post.id, update_data)
        self.assertIsNotNone(updated_post)
        self.assertEqual(updated_post.title, "Updated Test Post")
        self.assertEqual(len(updated_post.tags), 1)
        
        # Search posts
        search_params = PostSearch(
            title="Test",
            content="content"
        )
        found_posts = self.db.search_posts(search_params)
        self.assertGreater(len(found_posts), 0)
        
        # Test search with pagination
        search_with_pagination = PostSearch(
            title="Test",
            skip=0,
            limit=1
        )
        paginated_posts = self.db.search_posts(search_with_pagination)
        self.assertEqual(len(paginated_posts), 1)
        
        # Delete post
        deleted = self.db.delete_post(post.id)
        self.assertTrue(deleted)
        self.assertIsNone(self.db.get_post(post.id))
    
    def test_reset_database(self):
        """Test database reset functionality."""
        # Create some custom data
        user = self.db.create_user(UserCreate(
            first_name="Custom",
            last_name="User",
            nickname="customuser",
            email="custom@example.com",
            password="custom123",
            birthdate=date(1990, 1, 1),
            location=None,
            gender=None,
            job_title=None,
            phone=None
        ))

        user_id = user.id
        self.db.reset_database()
        
        # Verify custom data is gone and dummy data is loaded
        self.assertIsNone(self.db.get_user(user_id))
        
        # Check if dummy data is loaded
        all_tags = self.db.get_all_tags()
        self.assertGreater(len(all_tags), 0)  # Verify dummy data is loaded

if __name__ == '__main__':
    unittest.main() 
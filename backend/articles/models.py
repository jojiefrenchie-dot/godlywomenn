import uuid
from django.db import models
from users.models import User


from django.utils.text import slugify

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "categories"
        ordering = ['name']  # Sort categories alphabetically
    
    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate slug from name
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            
            # Ensure unique slug
            while Category.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
                
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


from django.utils import timezone

class Article(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=1024)
    slug = models.SlugField(max_length=1024, unique=True)
    content = models.TextField()
    excerpt = models.TextField(blank=True, null=True)
    featured_image = models.ImageField(upload_to='articles/%Y/%m/%d/', blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='draft')
    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    viewers = models.ManyToManyField(User, through='ArticleView', related_name='viewed_articles')


class ArticleView(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_views')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='views')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'article')  # A user can only view an article once
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} viewed {self.article.title}"

    def save(self, *args, **kwargs):
        # Set published_at when article is published
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        # Clear published_at if article is unpublished
        elif self.status == 'draft':
            self.published_at = None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ArticleLike(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='article_likes')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'article')  # A user can only like an article once
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} liked {self.article.title}"


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.author.username} on {self.article.title}"


class CommentLike(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_likes')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')  # A user can only like a comment once
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} liked a comment"

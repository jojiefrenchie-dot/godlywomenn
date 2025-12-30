# Testing Guide - Like and Comment Features

## Prerequisites

Ensure both servers are running:
- Django backend: `python manage.py runserver 8000`
- Next.js frontend: `npm run dev` (should be at http://localhost:3000)

## Manual Testing Steps

### 1. Test Article Likes

**Steps:**
1. Navigate to the articles page or dashboard
2. Find an article in the grid view (ArticleCard)
3. Look for the heart icon with like count
4. Click the heart icon

**Expected Results:**
- Heart should fill with pink color
- Like count should increment by 1
- If you click again, it should unfill and decrement

**Without Authentication:**
- Like button should still appear
- Clicking should NOT like (silently fail or show error)

### 2. Test Comments Section

**Steps:**
1. Find an article with comments
2. Scroll to the Comments section at bottom of ArticleCard
3. Look for "Sign in to comment" message if not authenticated
4. Sign in to your account

**Expected Results:**
- Comment input field should appear
- Previous comments should be displayed
- Each comment shows author, timestamp, like count

### 3. Test Adding a Comment

**Steps:**
1. Ensure you're logged in
2. Scroll to comments section
3. Type "Test comment" in the input field
4. Click "Post" button

**Expected Results:**
- New comment appears at top of comments list
- Comment shows your author info and timestamp
- Input field clears
- Comment count updates

### 4. Test Liking a Comment

**Steps:**
1. Find a comment (yours or someone else's)
2. Click the heart icon on the comment
3. Check the like count

**Expected Results:**
- Heart fills with pink
- Like count increments
- Clicking again toggles the like off

### 5. Test Replying to Comments

**Steps:**
1. Find a comment
2. Click "Reply" button under it
3. Type "Test reply" in reply input
4. Click "Reply" button

**Expected Results:**
- Reply appears nested under parent comment
- Reply shows indentation/nesting
- Reply shows author and timestamp
- Reply can be liked like any comment

### 6. Test Nested Replies

**Steps:**
1. Find a comment with replies
2. Click Reply on one of the replies
3. Add a reply to the reply

**Expected Results:**
- Further nested replies appear with additional indentation
- Replies can be infinitely nested
- Each level maintains like/reply functionality

## Backend Testing

### API Endpoint Tests

**Test Like Article Endpoint:**
```bash
curl -X POST http://localhost:8000/api/articles/{article-id}/like/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

Expected: 201 Created or 200 OK

**Test Unlike Article:**
```bash
curl -X DELETE http://localhost:8000/api/articles/{article-id}/like/ \
  -H "Authorization: Bearer {token}"
```

Expected: 204 No Content

**Test Create Comment:**
```bash
curl -X POST http://localhost:8000/api/articles/{article-id}/comment/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test comment"}'
```

Expected: 201 Created

**Test Like Comment:**
```bash
curl -X POST http://localhost:8000/api/articles/comment/{comment-id}/like/ \
  -H "Authorization: Bearer {token}"
```

Expected: 201 Created or 200 OK

**Test Reply to Comment:**
```bash
curl -X POST http://localhost:8000/api/articles/comment/{comment-id}/reply/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test reply"}'
```

Expected: 201 Created

## Frontend Testing

### Console Checks

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors (should be none)
4. Check Network tab for API calls

**Expected requests:**
- `POST /api/articles/[id]/like`
- `DELETE /api/articles/[id]/like`
- `POST /api/articles/[id]/comment`
- `POST /api/articles/comment/[pk]/like`
- `POST /api/articles/comment/[pk]/reply`

### State Management Checks

1. Add a comment
2. Refresh the page
3. Scroll to comments section

**Expected:**
- Previously added comment should still appear (persisted to database)
- Like counts should match what you set

## Performance Testing

### Load Testing
1. Add multiple comments (10+)
2. Add replies to multiple comments
3. Like various comments
4. Check if UI remains responsive

**Expected:**
- No lag in UI updates
- All operations complete within 1-2 seconds
- No memory leaks in browser

### Mobile Testing
1. Open on mobile device (or use DevTools mobile emulation)
2. Test all functionality

**Expected:**
- Like button easily clickable
- Comment input responsive
- Replies display correctly on narrow screens

## Error Handling Testing

### Test 401 Unauthorized
1. Clear authentication cookies
2. Try to like an article without logging in

**Expected:**
- Request should fail silently or show error
- Like should not persist

### Test 404 Not Found
1. Modify API call to use invalid article/comment ID
2. Attempt operation

**Expected:**
- Graceful error message
- UI should recover

### Test Network Error
1. Disconnect internet
2. Try to add comment

**Expected:**
- Error message or timeout
- UI remains usable
- Can retry when connection restored

## Regression Testing

Ensure existing functionality still works:
- [x] Article CRUD operations
- [x] Article viewing
- [x] Article filtering by category
- [x] Article search
- [x] User authentication
- [x] Article publish/unpublish
- [x] Article deletion
- [x] Featured image upload

## Database Verification

```bash
# Check likes table
sqlite3 db.sqlite3 "SELECT * FROM articles_articlelike LIMIT 5;"

# Check comments table
sqlite3 db.sqlite3 "SELECT id, author_id, content, parent_id FROM articles_comment LIMIT 10;"

# Check comment likes table
sqlite3 db.sqlite3 "SELECT * FROM articles_commentlike LIMIT 5;"

# Check article relationships
sqlite3 db.sqlite3 "SELECT id, title, view_count FROM articles_article WHERE status='published' LIMIT 1;"
```

## Sign-Off Checklist

- [ ] All likes functionality working
- [ ] All comment functionality working
- [ ] All reply functionality working
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No Python errors
- [ ] Database contains expected data
- [ ] API endpoints responding correctly
- [ ] Authentication required where needed
- [ ] Loading states visible
- [ ] Error messages helpful
- [ ] UI responsive on all screen sizes
- [ ] Performance acceptable
- [ ] No regression in existing features

---

**Test Date**: _______________
**Tester Name**: _______________
**Status**: _______________

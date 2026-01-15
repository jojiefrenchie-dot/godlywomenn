#!/bin/bash

# Test the authentication flow
echo "Testing Authentication Flow"
echo "==========================="

# Test 1: Try to get a token with valid credentials
echo -e "\n[TEST 1] Getting token from Django..."
TOKEN_RESPONSE=$(curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com","password":"password123"}' \
  -w "\n%{http_code}" \
  -s)

HTTP_CODE=$(echo "$TOKEN_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$TOKEN_RESPONSE" | head -n-1)

echo "Status: $HTTP_CODE"
echo "Response: $RESPONSE_BODY"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Token obtained successfully"
    ACCESS_TOKEN=$(echo "$RESPONSE_BODY" | grep -o '"access":"[^"]*' | cut -d'"' -f4)
    echo "Access Token: ${ACCESS_TOKEN:0:50}..."
else
    echo "✗ Failed to get token"
fi

# Test 2: Test NextAuth endpoint
echo -e "\n[TEST 2] Testing NextAuth callback endpoint..."
NEXTAUTH_RESPONSE=$(curl -X GET http://localhost:3000/api/auth/providers \
  -w "\n%{http_code}" \
  -s)

HTTP_CODE=$(echo "$NEXTAUTH_RESPONSE" | tail -n1)
echo "NextAuth Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ NextAuth is responding"
else
    echo "✗ NextAuth not responding properly"
fi

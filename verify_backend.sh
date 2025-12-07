#!/bin/bash

# Start backend in background
cd ../backend
node server.js &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

# Base URL
API_URL="http://localhost:4000/api"
COOKIE_FILE="cookies.txt"

# 1. Signup/Login to get cookie
echo "Registering user..."
curl -s -c $COOKIE_FILE -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

echo "Logging in (to ensure cookie is set)..."
curl -s -c $COOKIE_FILE -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

echo "Cookies saved."

# 2. Create a Book
echo "Creating book..."
BOOK_RES=$(curl -s -b $COOKIE_FILE -X POST "$API_URL/books" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test Author","price":10}')

echo "Create Book Response: $BOOK_RES"
BOOK_ID=$(echo $BOOK_RES | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Book ID: $BOOK_ID"

# 3. Get Books
echo "Fetching books..."
curl -s -b $COOKIE_FILE "$API_URL/books" | grep "Test Book" && echo "Book found in list."

# 4. Update Book
if [ ! -z "$BOOK_ID" ]; then
  echo "Updating book..."
  UPDATE_RES=$(curl -s -b $COOKIE_FILE -X PUT "$API_URL/books/$BOOK_ID" \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated Test Book"}')
  echo "Update Response: $UPDATE_RES"
fi

# 5. Delete Book
if [ ! -z "$BOOK_ID" ]; then
  echo "Deleting book..."
  DELETE_RES=$(curl -s -b $COOKIE_FILE -X DELETE "$API_URL/books/$BOOK_ID")
  echo "Delete Response: $DELETE_RES"
fi

# Cleanup
kill $BACKEND_PID
rm $COOKIE_FILE
echo "Done."

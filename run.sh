#!/bin/bash

# Start backend in background (from root)
./mvnw spring-boot:run &

# Start frontend from its directory
cd src/main/java/com/genbridge/frontend
npm run dev
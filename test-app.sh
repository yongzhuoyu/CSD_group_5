#!/bin/bash

echo "======================================"
echo "GenBridge Application Test Script"
echo "======================================"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

echo "Starting Spring Boot application..."
echo "(This will take about 10-15 seconds)"
echo ""

# Start the application in background
./mvnw spring-boot:run > /tmp/genbridge-test.log 2>&1 &
APP_PID=$!

echo "Application PID: $APP_PID"
echo "Waiting for startup..."

# Wait for application to start
sleep 15

# Check if process is still running
if ps -p $APP_PID > /dev/null; then
    echo "✅ Application is running!"
    echo ""

    # Test health endpoint
    echo "Testing health endpoint..."
    echo "URL: http://localhost:8080/api/health"
    echo ""

    HEALTH_RESPONSE=$(curl -s http://localhost:8080/api/health)

    if [[ $HEALTH_RESPONSE == *"UP"* ]]; then
        echo "✅ Health check PASSED!"
        echo "Response: $HEALTH_RESPONSE"
    else
        echo "❌ Health check FAILED!"
        echo "Response: $HEALTH_RESPONSE"
    fi

    echo ""
    echo "Swagger UI available at: http://localhost:8080/swagger-ui.html"
    echo ""
    echo "Press Enter to stop the application..."
    read

    # Stop the application
    echo "Stopping application..."
    kill $APP_PID
    sleep 2

    if ps -p $APP_PID > /dev/null; then
        echo "Force stopping..."
        kill -9 $APP_PID
    fi

    echo "✅ Application stopped"
else
    echo "❌ Application failed to start!"
    echo "Check logs at: /tmp/genbridge-test.log"
    echo ""
    echo "Last 20 lines of log:"
    tail -20 /tmp/genbridge-test.log
fi

echo ""
echo "Test complete!"

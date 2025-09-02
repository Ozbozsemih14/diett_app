#!/usr/bin/env python3
"""
Simple mock Flask server for AI Diet Assistant
Since we can't install Flask, this creates a basic HTTP server
"""

import http.server
import json
import urllib.parse
import socketserver
from datetime import datetime

class DietAssistantHandler(http.server.BaseHTTPRequestHandler):
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/api/test':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', 'http://localhost:3000')
            self.end_headers()
            response = {"status": "success", "message": "Mock API is working!"}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/api/generate-diet':
            try:
                # Read request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                # Mock diet plan response
                mock_response = {
                    "diet_plan": [
                        {
                            "meal_type": "Breakfast",
                            "foods": ["Oats", "Banana", "Almonds"],
                            "calories": 350,
                            "protein": 12,
                            "ai_suggestion": "Perfect breakfast for energy and protein to start your day!"
                        },
                        {
                            "meal_type": "Lunch", 
                            "foods": ["Chicken Breast", "Rice", "Broccoli"],
                            "calories": 450,
                            "protein": 35,
                            "ai_suggestion": "Balanced meal with lean protein and complex carbs."
                        },
                        {
                            "meal_type": "Dinner",
                            "foods": ["Salmon", "Sweet Potato", "Spinach"],
                            "calories": 400,
                            "protein": 30,
                            "ai_suggestion": "Omega-3 rich dinner that's light but nutritious."
                        }
                    ],
                    "nutrition": {
                        "total_calories": 1200,
                        "total_protein": 77,
                        "total_carbs": 120,
                        "total_fat": 35
                    },
                    "explanation": f"Diet plan generated for {data.get('gender', 'user')} aged {data.get('age', 'N/A')}. This plan meets your activity level and dietary restrictions.",
                    "recommendation": "Focus on consistency and hydration throughout the day."
                }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', 'http://localhost:3000')
                self.end_headers()
                self.wfile.write(json.dumps(mock_response).encode())
                
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', 'http://localhost:3000')
                self.end_headers()
                error_response = {"error": str(e)}
                self.wfile.write(json.dumps(error_response).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', 'http://localhost:3000')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server(port=5000):
    """Run the mock server"""
    with socketserver.TCPServer(("", port), DietAssistantHandler) as httpd:
        print(f"Mock Diet Assistant API server running on http://localhost:{port}")
        print("Endpoints available:")
        print("  GET  /api/test")
        print("  POST /api/generate-diet")
        print("\nPress Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")

if __name__ == "__main__":
    run_server()
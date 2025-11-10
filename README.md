# 🚗 Car Dealership Reviews Website

A full-stack web application for viewing, reviewing, and analyzing car dealership reviews.  
Built with **Django**, **Express.js**, **MongoDB**, and **Flask (Sentiment Analysis Service)**.

---

## 📂 Project Structure

| Folder | Description |
|---------|--------------|
| `django-site/` | Main Django web application (frontend + routes + authentication) |
| `express-api/` | Node/Express backend providing dealer and review data (uses MongoDB or in-memory fallback) |
| `sentiment-service/` | Flask microservice using NLTK VADER to analyze review sentiment |

---

## ⚙️ Features

- **Django Frontend**
  - Dealer list and dealer detail pages
  - Login, Logout, Signup
  - Add Review form with sentiment analysis
  - About & Contact pages
  - Admin portal for managing car makes, models, and users

- **Express API**
  - REST endpoints to get all dealers, dealer by ID, dealers by state
  - Endpoints to get and post reviews for a dealer

- **Flask Sentiment Service**
  - `/analyze?text=...` endpoint returns sentiment label and score using NLTK’s VADER analyzer

---

## 🧠 Technology Stack

| Layer | Technology |
|--------|-------------|
| Frontend | Django + HTML + CSS + Bootstrap |
| Backend | Express.js (Node) |
| Database | MongoDB (or fallback JSON) |
| NLP Service | Flask + NLTK VADER |
| CI/CD | GitHub Actions |
| Version Control | Git & GitHub |

---

## ▶️ Running Locally

### 1️⃣ Start Express API
```bash
cd express-api
npm install
npm start
# Runs on http://127.0.0.1:5000

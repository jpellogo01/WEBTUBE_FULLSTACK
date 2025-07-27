# Webtube FullStack

**Webtube FullStack** is a full-stack web application designed for De La Salle Araneta University as an institutional **media and content management system**. This project aims to centralize campus news, events, and media content while integrating modern **AI features** for content management and moderation.

## 📂 Project Structure

Webtube-FullStack/
│
├── backend/ # Spring Boot + MySQL backend
├── frontend/ # ReactJS frontend


---

## 🛠 Technologies Used

### Backend
- **Spring Boot** – REST API for managing users, posts, comments, and more
- **MySQL** – Relational database for storing data
- **OpenAI API** – Integrated for content summarization and generation
- **Sentiment Analysis** – Used for comment moderation and bad word detection

### Frontend
- **ReactJS** – Responsive, component-based UI for users and content creators

---

## ✨ Features

- 📚 **Campus Media Website**  
  Central hub for university content such as news articles, stories, event highlights, and media features.

- 📝 **Content Management System (CMS)**  
  Admins and content creators can create, update, and categorize posts through a clean, easy-to-use interface.

- 🤖 **AI-Powered Summarization**  
  Automatically summarize long content using **OpenAI** to generate concise previews or descriptions.

- 💬 **Comment Moderation with Sentiment Analysis**  
  Analyze and filter user comments to detect hate speech, inappropriate language, or negative sentiment.

- 🧠 **AI-Assisted Content Creation**  
  Automatically generate **titles and descriptions** for posts to support fast and efficient publishing.

---

## 🏫 About the Project

This system was built for De La Salle Araneta University to address the lack of proper categorization and content curation in social media-based announcements. It introduces a structured platform for **media publication**, **student engagement**, and **content moderation** powered by artificial intelligence.

---

## 🚀 Getting Started

To run this project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Webtube-FullStack.git
   cd Webtube-FullStack
Backend Setup

Navigate to the backend/ folder.

Configure application.properties for your MySQL DB and OpenAI API key.

Run the Spring Boot application.

Frontend Setup

Navigate to the frontend/ folder.

Install dependencies:

npm install
Start the development server:
npm start

# Lesson Plan Generator

This project is a lesson plan generator that utilizes the **Gemini 1.5 Flash** model to create structured, engaging, and comprehensive lesson plans based on user-provided inputs. It is built using **Next.js**, **Tailwind CSS**, and **ShadCN UI**.

## 🚀 Features
- Dynamic content generation with Gemini API
- Customizable inputs for lesson plans (topic, grade level, objectives, etc.)
- Real-time content display
- Toast notifications for success and error handling

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies
```bash
npm install
```
Or with Yarn:
```bash
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project and add the following:
```
NEXT_PUBLIC_GEMINI_API=your-gemini-api-key
```
> Replace `your-gemini-api-key` with your actual API key from the Google Gemini API.

### 4. Run the Development Server
```bash
npm run dev
```
Or with Yarn:
```bash
yarn dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 📘 API Integration Details

To integrate the **Gemini 1.5 Flash** model into your project, follow these steps:

1. **Import the GoogleGenerativeAI Library:**
```typescript
import { GoogleGenerativeAI } from 'some-google-ai-library';
```

2. **Initialize the API Client:**
```typescript
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API;
if (!geminiApiKey) {
  throw new Error("API key not found");
}
const genAi = new GoogleGenerativeAI(geminiApiKey);
```

3. **Set the Model:**
```typescript
const genModel = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
```

4. **Create a Prompt:**
You can structure the prompt based on user inputs. For example:
```typescript
const prompt = `Create a lesson plan with the following details:
- Topic: ${lessonPlan.topic}
- Grade Level: ${lessonPlan.gradeLevel}
- Main Concept: ${lessonPlan.mainConcept}
- Subtopics: ${lessonPlan.subTopics}
- Learning Objectives: ${lessonPlan.learningObjectives}`;
```

5. **Generate Content:**
```typescript
const lessonContent = await genModel.generateContent(prompt);
const generatedText = lessonContent.response.text();
```

6. **Handle the Response:**
You can format and display the generated content as needed:
```typescript
const formattedText = formatLessonContent(generatedText);
setStore(formattedText);
setContentBlocks(formattedText.split("\n\n"));
```

By following these steps, even developers with beginner or intermediate experience can easily understand and implement the API integration.

---

## 📄 Additional Notes
- **API Key Security:** Do not expose your API key publicly. Use environment variables.
- **Rate Limits:** Be aware of API usage limits and quotas.
- **Customization:** You can easily extend the prompt or add more input fields.

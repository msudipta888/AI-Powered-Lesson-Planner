"use client";

import {
  Book,
  Download,
  Loader2,
  MoonStar,
  Save,
  Sun,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";
import { DndEditor } from "./DragAndDrop";

interface LessonPlan {
  topic: string;
  gradeLevel: string;
  mainConcept: string;
  subTopics: string;
  learningObjectives: string;
  lessonOutLine: string;
  materialNeeded: string;
  assessment: string;
}

const initialLesson: LessonPlan = {
  topic: "",
  gradeLevel: "",
  mainConcept: "",
  subTopics: "",
  learningObjectives: "",
  lessonOutLine: "",
  materialNeeded: "",
  assessment: "",
};


const formatLessonContent = (content: string): string => {
  let formatted = content;
  formatted = formatted.replace(/^(Lesson Plan:.*)$/m, "## $1");

  const labels = [
    "Topic:",
    "Grade Level:",
    "Main Concept:",
    "Subtopics:",
    "Learning Objectives:",
    "Lesson Outline:",
    "Materials Needed:",
    "Assessment:",
    "Differentiation:",
    "Note:",
  ];
  
  labels.forEach((label) => {
    const regex = new RegExp(`^\\s*${label}`, "gm");
    formatted = formatted.replace(regex, `**${label.trim()}**`);
  });

  formatted = formatted.replace(/(\*\*.*\*\*)\s*/g, "$1\n\n");
  return formatted.trim();
};

const cleanText = (text: string) => {
  return text
    .replace(/#{1,6}\s/g, "") 
    .replace(/\*\*/g, "") 
    .trim();
};

export const LessonPlaner = () => {
  const [isDark, setIsDark] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>(initialLesson);
  const [isGenerating, setIsGenerating] = useState(false);
  const [store, setStore] = useState<string | null>(null);
  
  const [contentBlocks, setContentBlocks] = useState<string[]>([]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newTheme;
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLessonPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (value: string) => {
    setLessonPlan((prev) => ({ ...prev, gradeLevel: value }));
  };

  const handleGeneratePlan = async () => {
    if (!lessonPlan.topic || !lessonPlan.gradeLevel) {
      toast("Please provide at least the Topic and Grade Level");
      return;
    }
    setIsGenerating(true);

    try {
      const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API;
      if (!geminiApiKey) {
        throw new Error("API key not found");
      }
      const genAi = new GoogleGenerativeAI(geminiApiKey);
      const genModel = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Using the following user-provided inputs as the foundation, develop a comprehensive lesson plan:

- **Topic:** ${lessonPlan.topic}  
  *(User Input: Subject matter)*

- **Grade Level:** ${lessonPlan.gradeLevel}  
  *(User Input: Appropriate educational level)*

- **Main Concept:** ${lessonPlan.mainConcept}  
  *(User Input: Core idea or theme)*

- **Subtopics:** ${lessonPlan.subTopics}  
  *(User Input: Key components to be addressed)*

- **Learning Objectives:** ${lessonPlan.learningObjectives}  
  *(User Input: Specific, measurable goals)*

- **Lesson Outline:** ${lessonPlan.lessonOutLine}  
  *(User Input: Structured flow such as Introduction, Body, Conclusion)*

- **Materials Needed:** ${lessonPlan.materialNeeded}  
  *(User Input: All necessary resources)*

- **Assessment:** ${lessonPlan.assessment}  
  *(User Input: Methods to evaluate student understanding)*

Ensure the final lesson plan is concise, engaging, and presented in a professional tone.`;

      const lessonContent = await genModel.generateContent(prompt);

      // Format the AI-generated text
      const generatedText = lessonContent.response.text();
      const formattedText = formatLessonContent(generatedText);

      setStore(formattedText);
      setContentBlocks(formattedText.split("\n\n"));

      toast("Successfully generated lesson content");
    } catch (error: any) {
      console.error(error);
      toast(`Cannot generate content: ${error.message || error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBlockUpdate = (index: number, newContent: string) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index] = newContent;
    setContentBlocks(newBlocks);
  };

  const handleSave = () => {
    try {
      const updatedContent = contentBlocks.join("\n\n");
      setStore(updatedContent);
      localStorage.setItem(
        "lessonPlan",
        JSON.stringify({ ...lessonPlan, generatedContent: updatedContent })
      );
      toast("Successfully saved content in local storage");
    } catch (error) {
      toast("Error saving lesson content");
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    try {
      if (contentBlocks.length > 0) {
        const updatedContent = contentBlocks.join("\n\n");
        const cleanUpdateContent = cleanText(updatedContent);
        doc.text(cleanUpdateContent, 12, 12);
        doc.save("ai-lesson-plan.pdf");
        toast("Successfully Downloaded PDF");
      } else {
        toast("No content available to download");
      }
    } catch (error) {
      toast("Something went wrong during download!");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4 dark:bg-black">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6" />
          <h1 className="lg:text-2xl sm:text-xl font-bold">Lesson Planner</h1>
        </div>
        {/* Dark mode toggle button */}
        <Button onClick={toggleTheme} variant="ghost" aria-label="Toggle Dark Mode">
          {isDark ? (
            <Sun className="h-6 w-6" />
          ) : (
            <MoonStar className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Card for user inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
          <CardDescription>
            Enter the details for your lesson plan below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                name="topic"
                value={lessonPlan.topic}
                onChange={handleInputChange}
                placeholder="e.g., Machine Learning"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Select
                value={lessonPlan.gradeLevel}
                onValueChange={handleGradeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(11)].map((_, i) => (
                    <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                      Grade {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              {[
                { id: "mainConcept", label: "Main Concept", placeholder: "Core concept of the lesson" },
                { id: "subTopics", label: "Sub Topics", placeholder: "Key topics to cover" },
                { id: "materialNeeded", label: "Materials Needed", placeholder: "Required resources and materials" },
                { id: "learningObjectives", label: "Learning Objectives", placeholder: "What students will learn" },
                { id: "assessment", label: "Assessment", placeholder: "How will you evaluate learning" }
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-sm font-medium">{field.label}</Label>
                  <Textarea
                    id={field.id}
                    name={field.id}
                    value={lessonPlan[field.id as keyof LessonPlan]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="min-h-[100px] transition-colors focus:ring-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="py-3 mr-5">
            <Button onClick={handleGeneratePlan} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal for the generated content (with drag-and-drop) */}
      {store && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl">
            <CardHeader className="border-b sticky font-mono top-0 bg-background z-10">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Input
                  value={lessonPlan.topic}
                  onChange={(e) =>
                    setLessonPlan((prev) => ({
                      ...prev,
                      topic: e.target.value,
                    }))
                  }
                  className="text-xl font-bold border-none bg-transparent focus:ring-0 p-0"
                />
              </CardTitle>
              <CardDescription>
                Generated for Grade {lessonPlan.gradeLevel}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
              {/* <DndEditor> handles drag-and-drop reordering of blocks */}
              <DndEditor
                contentBlocks={contentBlocks}
                setContentBlocks={setContentBlocks}
                handleBlockUpdate={handleBlockUpdate}
                cleanText={cleanText}
              />
              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-4">
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className="transition transform hover:scale-105 flex items-center space-x-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="transition transform hover:scale-105 flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                </div>
                <Button
                  onClick={() => setStore(null)}
                  variant="ghost"
                  className="transition transform hover:scale-105"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

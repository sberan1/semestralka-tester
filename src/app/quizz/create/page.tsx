// File: src/app/quizz/create/page.tsx
"use client";

import { useState } from "react";
import { parseQuizFile } from "@/lib/parser";
import { ParsedQuiz } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { router } from "next/client";
import { useQuizStore } from "@/store/store";
import { redirect } from "next/navigation";

export default function CreateQuizPage() {
  const [fileContent, setFileContent] = useState("");
  const [quiz, setQuiz] = useState<ParsedQuiz | null>(null);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { setActiveQuiz } = useQuizStore();

  const handleParse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const parsed = parseQuizFile(fileContent);
      setQuiz(parsed);
      console.log(parsed);
      setError("");
    } catch (err: any) {
      setError("Error parsing file content");
      setQuiz(null);
    }
  };

  // Updates a single question from the quiz based on its id (index or the synthetic id).
  const updateQuestion = (updatedQuestion: typeof quiz[number]) => {
    if (!quiz) return;
    const updatedQuiz = quiz.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setQuiz(updatedQuiz);
  };

  // Submit the edited quiz to the DB.
  const handleSave = async () => {
    if (!quiz) return;
    setSaving(true);

    try {
      const payload = {
        title: name,
        description: description,
        questions: quiz,
      };
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        setSaveError(errData.error || "Error saving quiz");
      } else {
        setSaveError("");
        toast(`Quiz - ${name} succesfully saved, redirecting...`);
        setTimeout(async () => {
          const data = await res.json();
          await setActiveQuiz(data.id);
          await redirect("/quizz/" + data.id);
        }, 500);
        // You can redirect or clear the editor here.
      }
    } catch (error: any) {
      setSaveError("Error saving quiz");
    }

    setSaving(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      <form onSubmit={handleParse}>
        <textarea
          className="border p-2 w-full h-40 mb-4"
          placeholder="Enter quiz file content here..."
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
          Parse Quiz
        </button>
      </form>

      <div className="grid w-full max-w-sm items-center gap-3 m-4">
        <Label htmlFor="name">Name of the quiz</Label>
        <Input
          id="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-3 m-4">
        <Label htmlFor="description">Description of the quiz</Label>
        <Input
          id="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Quiz"}
      </button>

      {error && <p className="mt-4 text-destructive">{error}</p>}
      {quiz && (
        <div className="mt-4">
          {quiz.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onUpdateQuestion={updateQuestion}
            />
          ))}

          {saveError && <p className="mt-4 text-destructive">{saveError}</p>}
        </div>
      )}
    </div>
  );
}

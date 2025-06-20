"use client";

import React, { useState } from "react";
import { parseQuizFile } from "@/lib/parser";
import type { ParsedQuiz } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import CreateQuizForm from "@/components/CreateQuizForm";


export default function CreateQuizPage() {
  const [fileContent, setFileContent] = useState("");
  const [quiz, setQuiz] = useState<ParsedQuiz | null>(null);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleParse = () => {
    try {
      const parsed = parseQuizFile(fileContent);
      setQuiz(parsed);
      setError("");
    } catch (err: any) {
      setError("Error parsing file content");
      setQuiz(null);
    }
  };

  const updateQuestion = (updatedQuestion: typeof quiz[number]) => {
    if (!quiz) return;
    const updatedQuiz = quiz.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setQuiz(updatedQuiz);
  };

  const deleteQuestion = (id: number | undefined) => {
    if (!quiz) return;
    setQuiz(quiz.filter((q) => q.id !== id));
  };

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
          redirect("/");
        }, 500);
      }
    } catch (error: any) {
      setSaveError("Error saving quiz");
    }
    setSaving(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      <CreateQuizForm
        fileContent={fileContent}
        setFileContent={setFileContent}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        handleParse={handleParse}
      />
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
              editMode={true}
              onDeleteQuestion={deleteQuestion}
            />
          ))}
          {saveError && <p className="mt-4 text-destructive">{saveError}</p>}
        </div>
      )}
    </div>
  );
}

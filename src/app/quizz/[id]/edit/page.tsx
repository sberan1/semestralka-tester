"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuestionCard } from "@/components/QuestionCard";
import { toast } from "sonner";
import CreateQuizForm from "@/components/CreateQuizForm";
import type { ParsedQuiz, ParsedQuestion } from "@/lib/types";

export default function EditQuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<ParsedQuiz | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      const res = await fetch(`/api/quizzes/${id}`);
      if (!res.ok) {
        setError("Quiz not found");
        return;
      }
      const data = await res.json();
      setQuiz(data.questions);
      setName(data.title);
      setDescription(data.description || "");
    }
    fetchQuiz();
  }, [id]);

  const updateQuestion = (updatedQuestion: ParsedQuestion) => {
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
      const res = await fetch(`/api/quizzes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        setSaveError(errData.error || "Error saving quiz");
      } else {
        setSaveError("");
        toast(`Quiz - ${name} successfully updated, redirecting...`);
        setTimeout(async () => {
          router.push("/");
        }, 500);
      }
    } catch (error: any) {
      setSaveError("Error saving quiz");
    }
    setSaving(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Quiz</h1>
      <CreateQuizForm
        fileContent={""}
        setFileContent={() => {}}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        handleParse={() => {}}
        disabledFileInput={true}
      />
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
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


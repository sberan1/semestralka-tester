// File: src/components/QuizzCard.tsx
import { Card, CardFooter, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/store/store";
import { redirect } from "next/navigation";
import { Edit, Trash } from "lucide-react";

type QuizzCardProps = {
  id: number;
  title: string;
  description: string | null;
  className?: string;
};

const QuizzCard: React.FC<QuizzCardProps> = ({ id, title, description, className }) => {
  const { setActiveQuiz, deleteQuiz } = useQuizStore();

  const handleStartQuiz = () => {
    setActiveQuiz(id);
    redirect("/quizz/" + id);
  };

  const handleEdit = () => {
    redirect("/quizz/" + id + "/edit");
  };

  const handleDelete = async () => {
    try {
      await deleteQuiz(id);
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className={"text-2xl font-bold"}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button onClick={handleStartQuiz}>Start Quizz</Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit} title="Edit Quiz">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="destructive" onClick={handleDelete} title="Delete Quiz">
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuizzCard;

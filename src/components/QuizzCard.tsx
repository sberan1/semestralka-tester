import { Card, CardFooter, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/store/store";

type QuizzCardProps = {
  id: number;
  title: string;
  description: string;
};

const QuizzCard: React.FC<QuizzCardProps> = ({ id, title, description }) => {
  const { setActiveQuiz } = useQuizStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => setActiveQuiz(id)}>Start Quizz</Button>
      </CardFooter>
    </Card>
  );
};

export default QuizzCard;

"use client"

import { Plus } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export default function PlusCard({className}: {className?: string}) {

  const handleClick = () => {
    // Add your click logic here
    console.log("Circle clicked!")
  }

  return (
    <Card className={className}>
      <CardContent className=" flex items-center justify-center h-full min-h-[200px]">
        <button
          onClick={handleClick}
          className={`
                sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full 
                bg-primary hover:bg-primary/90
                active:scale-95
                transition-all duration-200 ease-out
                shadow-lg hover:shadow-xl
                flex items-center justify-center
                group
              `}
        >
          <Plus
            className={`
                  w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white 
                  transition-transform duration-200
                  group-hover:scale-110
                `}
          />
        </button>
      </CardContent>
    </Card>
  )
}

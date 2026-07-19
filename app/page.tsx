"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Target, Trophy } from "lucide-react"

export default function NumberGuessingGame() {
  const [targetNumber, setTargetNumber] = useState<number>(0)
  const [guess, setGuess] = useState<string>("")
  const [attempts, setAttempts] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [guessHistory, setGuessHistory] = useState<number[]>([])
  const maxAttempts = 10

  // Initialize game
  useEffect(() => {
    resetGame()
  }, [])

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1
  }

  const resetGame = () => {
    setTargetNumber(generateRandomNumber())
    setGuess("")
    setAttempts(0)
    setFeedback("I'm thinking of a number between 1 and 100. Can you guess it?")
    setGameStatus("playing")
    setGuessHistory([])
  }

  // const handleGuess = () => {
  //   const guessNumber = Number.parseInt(guess)

  //   if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
  //     setFeedback("Please enter a valid number between 1 and 100!")
  //     return
  //   }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    setGuessHistory([...guessHistory, guessNumber])
    setGuess("")

    if (guessNumber === targetNumber) {
      setFeedback(`🎉 Congratulations! You guessed it in ${newAttempts} attempts!`)
      setGameStatus("won")
    } else if (newAttempts >= maxAttempts) {
      setFeedback(`😔 Game over! The number was ${targetNumber}. Better luck next time!`)
      setGameStatus("lost")
    } else {
      const difference = Math.abs(guessNumber - targetNumber)
      let hint = ""

      if (difference <= 5) {
        hint = "🔥 Very close!"
      } else if (difference <= 15) {
        hint = "🌡️ Getting warmer!"
      } else {
        hint = "❄️ Cold!"
      }

      if (guessNumber < targetNumber) {
        setFeedback(`Too low! ${hint} (${maxAttempts - newAttempts} attempts left)`)
      } else {
        setFeedback(`Too high! ${hint} (${maxAttempts - newAttempts} attempts left)`)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && gameStatus === "playing") {
      handleGuess()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Number Guessing Game</CardTitle>
          </div>
          <CardDescription>Guess the number between 1 and 100</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Game Status */}
          <div className="text-center">
            <p className="text-lg font-medium text-balance">{feedback}</p>
          </div>

          {/* Attempts Counter */}
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              Attempts: {attempts}/{maxAttempts}
            </Badge>
            {gameStatus === "won" && (
              <Badge className="px-3 py-1 bg-green-500 hover:bg-green-600">
                <Trophy className="h-4 w-4 mr-1" />
                Winner!
              </Badge>
            )}
          </div>


          {gameStatus === "playing" && (
            <div className="space-y-3">
              <Input
                type="number"
                placeholder="Enter your guess..."
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                min="1"
                max="100"
                className="text-center text-lg"
              />
              <Button onClick={handleGuess} className="w-full" disabled={!guess.trim()}>
                Make Guess
              </Button>
            </div>
          )}

          {/* Guess History */}
          {guessHistory.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Your Guesses:</h3>
              <div className="flex flex-wrap gap-2">
                {guessHistory.map((historyGuess, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`
                      ${historyGuess === targetNumber ? "bg-green-500 text-white" : ""}
                      ${historyGuess < targetNumber ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : ""}
                      ${historyGuess > targetNumber ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : ""}
                    `}
                  >
                    {historyGuess}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Reset Button */}
          <Button onClick={resetGame} variant="outline" className="w-full bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            New Game
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

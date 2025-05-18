"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Plus, Play, Pause, RotateCcw, Trash2, Clock } from "lucide-react"

interface Exercise {
  id: string
  name: string
  duration: number // in seconds
  completed: boolean
}

interface Routine {
  id: string
  name: string
  exercises: Exercise[]
}

export function FitnessRoutine() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)
  const [newRoutineName, setNewRoutineName] = useState("")
  const [newExerciseName, setNewExerciseName] = useState("")
  const [newExerciseDuration, setNewExerciseDuration] = useState(60)
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedRoutines = localStorage.getItem("fitnessRoutines")
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines))
    } else {
      // Create sample routine if none exists
      const sampleRoutine: Routine = {
        id: "sample-routine",
        name: "Full Body Workout",
        exercises: [
          { id: "ex1", name: "Push-ups", duration: 60, completed: false },
          { id: "ex2", name: "Squats", duration: 45, completed: false },
          { id: "ex3", name: "Plank", duration: 30, completed: false },
          { id: "ex4", name: "Jumping Jacks", duration: 60, completed: false },
        ],
      }
      setRoutines([sampleRoutine])
      localStorage.setItem("fitnessRoutines", JSON.stringify([sampleRoutine]))
    }
  }, [])

  // Set the first routine as selected if none is selected
  useEffect(() => {
    if (routines.length > 0 && !selectedRoutine) {
      setSelectedRoutine(routines[0])
    }
  }, [routines, selectedRoutine])

  // Save routines to localStorage whenever they change
  useEffect(() => {
    if (routines.length > 0) {
      localStorage.setItem("fitnessRoutines", JSON.stringify(routines))
    }
  }, [routines])

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && activeExercise) {
      // Mark exercise as completed when timer finishes
      handleToggleExercise(activeExercise.id, true)
      setIsTimerRunning(false)
      setActiveExercise(null)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isTimerRunning, timeRemaining])

  const handleCreateRoutine = () => {
    if (newRoutineName.trim()) {
      const newRoutine: Routine = {
        id: Date.now().toString(),
        name: newRoutineName,
        exercises: [],
      }
      setRoutines([...routines, newRoutine])
      setSelectedRoutine(newRoutine)
      setNewRoutineName("")
    }
  }

  const handleAddExercise = () => {
    if (selectedRoutine && newExerciseName.trim()) {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: newExerciseName,
        duration: newExerciseDuration,
        completed: false,
      }

      const updatedRoutines = routines.map((routine) =>
        routine.id === selectedRoutine.id ? { ...routine, exercises: [...routine.exercises, newExercise] } : routine,
      )

      setRoutines(updatedRoutines)
      setSelectedRoutine({
        ...selectedRoutine,
        exercises: [...selectedRoutine.exercises, newExercise],
      })

      setNewExerciseName("")
      setNewExerciseDuration(60)
    }
  }

  const handleToggleExercise = (exerciseId: string, completed: boolean) => {
    if (!selectedRoutine) return

    const updatedExercises = selectedRoutine.exercises.map((exercise) =>
      exercise.id === exerciseId ? { ...exercise, completed } : exercise,
    )

    const updatedRoutine = { ...selectedRoutine, exercises: updatedExercises }

    setSelectedRoutine(updatedRoutine)
    setRoutines(routines.map((routine) => (routine.id === selectedRoutine.id ? updatedRoutine : routine)))
  }

  const handleDeleteExercise = (exerciseId: string) => {
    if (!selectedRoutine) return

    const updatedExercises = selectedRoutine.exercises.filter((exercise) => exercise.id !== exerciseId)

    const updatedRoutine = { ...selectedRoutine, exercises: updatedExercises }

    setSelectedRoutine(updatedRoutine)
    setRoutines(routines.map((routine) => (routine.id === selectedRoutine.id ? updatedRoutine : routine)))
  }

  const handleDeleteRoutine = (routineId: string) => {
    const updatedRoutines = routines.filter((routine) => routine.id !== routineId)
    setRoutines(updatedRoutines)

    if (selectedRoutine?.id === routineId) {
      setSelectedRoutine(updatedRoutines.length > 0 ? updatedRoutines[0] : null)
    }
  }

  const startExerciseTimer = (exercise: Exercise) => {
    // Stop any running timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setActiveExercise(exercise)
    setTimeRemaining(exercise.duration)
    setIsTimerRunning(true)
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    if (activeExercise) {
      setTimeRemaining(activeExercise.duration)
      setIsTimerRunning(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {routines.map((routine) => (
          <Button
            key={routine.id}
            variant={selectedRoutine?.id === routine.id ? "default" : "outline"}
            onClick={() => setSelectedRoutine(routine)}
            className="flex items-center gap-2"
          >
            {routine.name}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-1 p-0"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteRoutine(routine.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </Button>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Routine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="routine-name">Routine Name</Label>
                <Input
                  id="routine-name"
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  placeholder="e.g., Upper Body, Cardio, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleCreateRoutine}>Create Routine</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {selectedRoutine && (
        <>
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{selectedRoutine.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedRoutine.exercises.filter((ex) => ex.completed).length} / {selectedRoutine.exercises.length}{" "}
                    completed
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const resetExercises = selectedRoutine.exercises.map((ex) => ({
                        ...ex,
                        completed: false,
                      }))

                      const updatedRoutine = {
                        ...selectedRoutine,
                        exercises: resetExercises,
                      }

                      setSelectedRoutine(updatedRoutine)
                      setRoutines(
                        routines.map((routine) => (routine.id === selectedRoutine.id ? updatedRoutine : routine)),
                      )
                    }}
                  >
                    Reset All
                  </Button>
                </div>
              </div>

              {activeExercise && (
                <Card className="mb-4 border-2 border-primary">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-4">
                      <h4 className="text-xl font-bold">{activeExercise.name}</h4>
                      <div className="text-4xl font-mono">{formatTime(timeRemaining)}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={toggleTimer}>
                          {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={resetTimer}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {selectedRoutine.exercises.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No exercises added yet. Add your first exercise below.
                  </div>
                ) : (
                  selectedRoutine.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className={`flex items-center justify-between p-3 rounded-md border ${
                        exercise.completed ? "bg-muted" : ""
                      } ${activeExercise?.id === exercise.id ? "border-primary" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={exercise.completed}
                          onCheckedChange={(checked) => handleToggleExercise(exercise.id, checked === true)}
                          id={`exercise-${exercise.id}`}
                        />
                        <Label
                          htmlFor={`exercise-${exercise.id}`}
                          className={exercise.completed ? "line-through text-muted-foreground" : ""}
                        >
                          {exercise.name}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(exercise.duration)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => startExerciseTimer(exercise)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteExercise(exercise.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Exercise</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="exercise-name">Exercise Name</Label>
                  <Input
                    id="exercise-name"
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)}
                    placeholder="e.g., Push-ups, Squats, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exercise-duration">Duration (seconds)</Label>
                  <Input
                    id="exercise-duration"
                    type="number"
                    min="5"
                    value={newExerciseDuration}
                    onChange={(e) => setNewExerciseDuration(Number.parseInt(e.target.value) || 60)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleAddExercise}>Add Exercise</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

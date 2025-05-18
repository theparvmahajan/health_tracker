"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format, subDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AreaChart } from "@tremor/react"

interface SleepEntry {
  date: Date
  hours: number
}

export function SleepTracker() {
  const [date, setDate] = useState<Date>(new Date())
  const [hours, setHours] = useState<number>(8)
  const [sleepData, setSleepData] = useState<SleepEntry[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("sleepData")
    if (savedData) {
      const parsedData = JSON.parse(savedData).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }))
      setSleepData(parsedData)
    } else {
      // Generate some sample data if none exists
      const sampleData = Array.from({ length: 7 }, (_, i) => ({
        date: subDays(new Date(), i),
        hours: 6 + Math.random() * 3,
      }))
      setSleepData(sampleData)
      localStorage.setItem("sleepData", JSON.stringify(sampleData))
    }
  }, [])

  // Update chart data whenever sleep data changes
  useEffect(() => {
    const formattedData = sleepData
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-7) // Get last 7 days
      .map((entry) => ({
        date: format(entry.date, "MMM dd"),
        "Sleep Hours": entry.hours,
      }))
    setChartData(formattedData)
  }, [sleepData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if an entry for this date already exists
    const existingEntryIndex = sleepData.findIndex(
      (entry) => format(entry.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
    )

    let newData: SleepEntry[]

    if (existingEntryIndex >= 0) {
      // Update existing entry
      newData = [...sleepData]
      newData[existingEntryIndex] = { date, hours }
    } else {
      // Add new entry
      newData = [...sleepData, { date, hours }]
    }

    setSleepData(newData)
    localStorage.setItem("sleepData", JSON.stringify(newData))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Hours Slept</Label>
            <Input
              id="hours"
              type="number"
              step="0.1"
              min="0"
              max="24"
              value={hours}
              onChange={(e) => setHours(Number.parseFloat(e.target.value))}
            />
          </div>
        </div>
        <Button type="submit">Log Sleep</Button>
      </form>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Recent Sleep History</h3>
          <div className="h-80">
            <AreaChart
              className="h-72"
              data={chartData}
              index="date"
              categories={["Sleep Hours"]}
              colors={["indigo"]}
              valueFormatter={(value) => `${value.toFixed(1)}h`}
              showLegend={false}
              showAnimation
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Recent Entries</h3>
          <div className="space-y-2">
            {sleepData
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 5)
              .map((entry, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <span>{format(entry.date, "EEEE, MMMM d, yyyy")}</span>
                  <span className="font-medium">{entry.hours.toFixed(1)} hours</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

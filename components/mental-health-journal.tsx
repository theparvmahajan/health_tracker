"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DonutChart } from "@tremor/react"

type Mood = "great" | "good" | "neutral" | "bad" | "terrible"

interface JournalEntry {
  id: string
  date: Date
  mood: Mood
  content: string
  tags: string[]
}

const moodEmoji = {
  great: "😄",
  good: "🙂",
  neutral: "😐",
  bad: "😕",
  terrible: "😢",
}

const moodColors = {
  great: "bg-green-500",
  good: "bg-green-300",
  neutral: "bg-yellow-300",
  bad: "bg-orange-300",
  terrible: "bg-red-300",
}

export function MentalHealthJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const [mood, setMood] = useState<Mood>("neutral")
  const [content, setContent] = useState("")
  const [tag, setTag] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [moodStats, setMoodStats] = useState<any[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries")
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }))
      setEntries(parsedEntries)
    } else {
      // Generate sample entries if none exist
      const sampleEntries: JournalEntry[] = [
        {
          id: "1",
          date: new Date(Date.now() - 86400000 * 6), // 6 days ago
          mood: "good",
          content: "Had a productive day at work. Feeling accomplished.",
          tags: ["work", "productivity"],
        },
        {
          id: "2",
          date: new Date(Date.now() - 86400000 * 4), // 4 days ago
          mood: "great",
          content: "Went for a long walk and felt very refreshed afterward.",
          tags: ["exercise", "outdoors"],
        },
        {
          id: "3",
          date: new Date(Date.now() - 86400000 * 2), // 2 days ago
          mood: "neutral",
          content: "Average day. Nothing special happened.",
          tags: ["routine"],
        },
      ]
      setEntries(sampleEntries)
      localStorage.setItem("journalEntries", JSON.stringify(sampleEntries))
    }
  }, [])

  // Update filtered entries when entries or search term changes
  useEffect(() => {
    let filtered = entries

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedTag) {
      filtered = filtered.filter((entry) => entry.tags.includes(selectedTag))
    }

    // Sort by date (newest first)
    filtered = [...filtered].sort((a, b) => b.date.getTime() - a.date.getTime())

    setFilteredEntries(filtered)
  }, [entries, searchTerm, selectedTag])

  // Calculate mood statistics
  useEffect(() => {
    const moodCounts: Record<Mood, number> = {
      great: 0,
      good: 0,
      neutral: 0,
      bad: 0,
      terrible: 0,
    }

    entries.forEach((entry) => {
      moodCounts[entry.mood]++
    })

    const stats = Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
    }))

    setMoodStats(stats)
  }, [entries])

  // Collect all unique tags
  useEffect(() => {
    const allTags = new Set<string>()
    entries.forEach((entry) => {
      entry.tags.forEach((tag) => allTags.add(tag))
    })
    setTags(Array.from(allTags))
  }, [entries])

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()])
      setTag("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    // Check if an entry for this date already exists
    const existingEntryIndex = entries.findIndex(
      (entry) => format(entry.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
    )

    const newEntry: JournalEntry = {
      id: existingEntryIndex >= 0 ? entries[existingEntryIndex].id : Date.now().toString(),
      date,
      mood,
      content,
      tags: tags.filter((t) => t.trim() !== ""),
    }

    let newEntries: JournalEntry[]

    if (existingEntryIndex >= 0) {
      // Update existing entry
      newEntries = [...entries]
      newEntries[existingEntryIndex] = newEntry
    } else {
      // Add new entry
      newEntries = [...entries, newEntry]
    }

    setEntries(newEntries)
    localStorage.setItem("journalEntries", JSON.stringify(newEntries))

    // Reset form
    setContent("")
    setMood("neutral")
    setTags([])
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
            <Label htmlFor="mood">Mood</Label>
            <Select value={mood} onValueChange={(value) => setMood(value as Mood)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="great">
                  <div className="flex items-center">
                    <span className="mr-2">{moodEmoji.great}</span> Great
                  </div>
                </SelectItem>
                <SelectItem value="good">
                  <div className="flex items-center">
                    <span className="mr-2">{moodEmoji.good}</span> Good
                  </div>
                </SelectItem>
                <SelectItem value="neutral">
                  <div className="flex items-center">
                    <span className="mr-2">{moodEmoji.neutral}</span> Neutral
                  </div>
                </SelectItem>
                <SelectItem value="bad">
                  <div className="flex items-center">
                    <span className="mr-2">{moodEmoji.bad}</span> Bad
                  </div>
                </SelectItem>
                <SelectItem value="terrible">
                  <div className="flex items-center">
                    <span className="mr-2">{moodEmoji.terrible}</span> Terrible
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Journal Entry</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How are you feeling today?"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((t, i) => (
              <Badge key={i} variant="secondary" className="flex items-center gap-1">
                {t}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => setTags(tags.filter((_, index) => index !== i))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Add a tag (e.g., work, family, exercise)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button type="submit">Save Entry</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={moodStats}
              category="value"
              index="name"
              colors={["emerald", "green", "amber", "orange", "rose"]}
              className="h-40"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedTag === tag) {
                        setSelectedTag(null)
                      } else {
                        setSelectedTag(tag)
                      }
                    }}
                  >
                    {tag} ({entries.filter((entry) => entry.tags.includes(tag)).length})
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No tags yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          {selectedTag && (
            <Badge variant="default" className="flex items-center gap-1">
              {selectedTag}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => setSelectedTag(null)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>

        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">
                      {moodEmoji[entry.mood]}
                    </span>
                    <div>
                      <h3 className="font-medium">{format(entry.date, "EEEE, MMMM d, yyyy")}</h3>
                      <p className="text-sm text-muted-foreground">Feeling {entry.mood}</p>
                    </div>
                  </div>
                </div>
                <p className="my-4 whitespace-pre-wrap">{entry.content}</p>
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {entry.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No journal entries found.</div>
        )}
      </div>
    </div>
  )
}

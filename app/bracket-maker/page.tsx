"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Save, Share2, Trash2, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavBar } from "@/components/nav-bar"
import { BracketDisplay } from "@/components/bracket-display"

// Bracket types
const bracketTypes = [
  { id: "single", name: "Single Elimination" },
  { id: "double", name: "Double Elimination" },
  { id: "round", name: "Round Robin" },
  { id: "swiss", name: "Swiss System" },
]

// Participant counts
const participantCounts = [4, 8, 16, 32, 64]

export default function BracketMaker() {
  const [activeTab, setActiveTab] = useState("create")
  const [tournamentName, setTournamentName] = useState("Envious Racing Championship")
  const [bracketType, setBracketType] = useState("single")
  const [participantCount, setParticipantCount] = useState(8)
  const [participants, setParticipants] = useState<string[]>(
    Array(8)
      .fill("")
      .map((_, i) => `Racer ${i + 1}`),
  )

  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...participants]
    newParticipants[index] = value
    setParticipants(newParticipants)
  }

  const handleParticipantCountChange = (count: string) => {
    const newCount = Number.parseInt(count)
    setParticipantCount(newCount)

    // Resize participants array
    if (newCount > participants.length) {
      // Add new participants
      setParticipants([
        ...participants,
        ...Array(newCount - participants.length)
          .fill("")
          .map((_, i) => `Racer ${participants.length + i + 1}`),
      ])
    } else {
      // Remove excess participants
      setParticipants(participants.slice(0, newCount))
    }
  }

  const saveBracket = () => {
    // In a real app, this would save to a database
    alert(`Bracket "${tournamentName}" saved successfully!`)
  }

  const exportBracket = () => {
    const bracketData = {
      name: tournamentName,
      type: bracketType,
      participants: participants,
      rounds: generateRounds(),
    }

    const blob = new Blob([JSON.stringify(bracketData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${tournamentName.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Generate rounds for the bracket
  const generateRounds = () => {
    const rounds = []
    let remainingParticipants = [...participants]

    while (remainingParticipants.length > 1) {
      const roundMatches = []
      const matchCount = Math.floor(remainingParticipants.length / 2)

      for (let i = 0; i < matchCount; i++) {
        roundMatches.push({
          participant1: remainingParticipants[i * 2],
          participant2: remainingParticipants[i * 2 + 1],
          winner: null,
        })
      }

      rounds.push(roundMatches)

      // For the next round, we'll have one winner from each match
      remainingParticipants = Array(matchCount).fill("TBD")
    }

    return rounds
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button asChild variant="ghost" className="mr-4 text-gray-400 hover:text-white">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            <span className="text-white">Bracket</span>
            <span className="text-red-600"> Maker</span>
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
            <TabsTrigger value="create" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Create Bracket
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Preview Bracket
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-zinc-900 text-white">
                <CardHeader>
                  <CardTitle>Tournament Settings</CardTitle>
                  <CardDescription className="text-gray-400">Configure your tournament bracket</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tournament-name">Tournament Name</Label>
                    <Input
                      id="tournament-name"
                      value={tournamentName}
                      onChange={(e) => setTournamentName(e.target.value)}
                      className="border-zinc-700 bg-zinc-800 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bracket-type">Bracket Type</Label>
                    <Select value={bracketType} onValueChange={setBracketType}>
                      <SelectTrigger id="bracket-type" className="border-zinc-700 bg-zinc-800 text-white">
                        <SelectValue placeholder="Select bracket type" />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-700 bg-zinc-800 text-white">
                        {bracketTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="participant-count">Number of Participants</Label>
                    <Select value={participantCount.toString()} onValueChange={handleParticipantCountChange}>
                      <SelectTrigger id="participant-count" className="border-zinc-700 bg-zinc-800 text-white">
                        <SelectValue placeholder="Select participant count" />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-700 bg-zinc-800 text-white">
                        {participantCounts.map((count) => (
                          <SelectItem key={count} value={count.toString()}>
                            {count} Participants
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 text-white">
                <CardHeader>
                  <CardTitle>Participants</CardTitle>
                  <CardDescription className="text-gray-400">Add and manage participants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[400px] space-y-2 overflow-y-auto pr-2">
                    {participants.map((participant, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={participant}
                          onChange={(e) => handleParticipantChange(index, e.target.value)}
                          placeholder={`Participant ${index + 1}`}
                          className="border-zinc-700 bg-zinc-800 text-white"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-gray-400 hover:text-red-600"
                          onClick={() => handleParticipantChange(index, "")}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Clear</span>
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-950/20"
                      onClick={() => setParticipants(participants.map(() => ""))}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-950/20"
                onClick={saveBracket}
              >
                <Save className="mr-2 h-4 w-4" /> Save Bracket
              </Button>
              <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => setActiveTab("preview")}>
                <Trophy className="mr-2 h-4 w-4" /> Preview Bracket
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Card className="bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle>{tournamentName}</CardTitle>
                <CardDescription className="text-gray-400">
                  {bracketTypes.find((t) => t.id === bracketType)?.name} • {participantCount} Participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <BracketDisplay participants={participants} bracketType={bracketType} />
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-950/20"
                    onClick={() => setActiveTab("create")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Edit Bracket
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-950/20"
                    onClick={saveBracket}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Bracket
                  </Button>
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-950/20">
                    <Share2 className="mr-2 h-4 w-4" /> Share Bracket
                  </Button>
                  <Button className="bg-red-600 text-white hover:bg-red-700" onClick={exportBracket}>
                    <Download className="mr-2 h-4 w-4" /> Export Bracket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

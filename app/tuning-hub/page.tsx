"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Car, Download, Save, Share2, ThumbsUp, Users, Plus, Trash2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavBar } from "@/components/nav-bar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BracketSimulator } from "@/components/bracket-simulator"
import { ReactionTimeAnalyzer } from "@/components/reaction-time-analyzer" // Import the new component

// Mock data for community tunes
const communityTunes = [
  {
    id: 1,
    title: "Track Day Special",
    car: "1999 Mitsubishi Eclipse GSX",
    author: "SpeedMaster",
    likes: 342,
    downloads: 1203,
    settings: {
      suspension: { front: 7.2, rear: 6.8 },
      camber: { front: -2.5, rear: -1.8 },
    },
  },
  {
    id: 2,
    title: "Drift King Setup",
    car: "1993 Mazda RX-7",
    author: "DriftHero",
    likes: 521,
    downloads: 1876,
    settings: {
      suspension: { front: 5.8, rear: 6.2 },
      camber: { front: -3.5, rear: -2.0 },
    },
  },
  {
    id: 3,
    title: "Laguna Seca Dominator",
    car: "2004 Chevrolet Corvette Z06",
    author: "TrackAddict",
    likes: 287,
    downloads: 943,
    settings: {
      suspension: { front: 8.5, rear: 8.2 },
      camber: { front: -2.0, rear: -1.5 },
    },
  },
]

// Car models for the dropdown
const carModels = [
  // Ford
  "1997 Ford Probe GT",

  // Mitsubishi
  "1999 Mitsubishi 3000GT SL",
  "1999 Mitsubishi Eclipse GSX",
  "1999 Mitsubishi 3000GT VR-4",
  "2005 Mitsubishi Lancer Evolution VIII",

  // Acura
  "1997 Acura Integra Type-R",
  "1997 Acura Integra GSR",
  "1999 Acura NSX",

  // Subaru
  "1998 Subaru WRX STI 22B",
  "2002 Subaru WRX",
  "2002 Subaru WRX STI",
  "2002 Subaru WRX STI RWD",
  "2005 Subaru WRX",
  "2005 Subaru WRX STI",

  // Dodge
  "2005 Dodge Neon SRT-4",

  // Honda
  "1997 Honda Civic Type-R",
  "1997 Honda Civic DX",

  // Mazda
  "1993 Mazda RX-7",

  // Chevrolet
  "2004 Chevrolet Corvette Z06",
]

// Type for a saved bracket configuration
interface BracketConfig {
  id: string
  name: string
  car: string
  dialInTime: string
  runs: RunLogEntry[]
}

// Type for a run log entry
interface RunLogEntry {
  id: number
  date: string
  dialIn: string
  et: string
  mph: string
  rt: string
}

export default function TuningHub() {
  const [activeTab, setActiveTab] = useState("my-tunes")
  const [selectedCar, setSelectedCar] = useState("1999 Mitsubishi Eclipse GSX")
  const [tuneName, setTuneName] = useState("My Track Setup")

  // Suspension settings
  const [frontSuspension, setFrontSuspension] = useState(7.0)
  const [rearSuspension, setRearSuspension] = useState(6.5)
  const [frontCamber, setFrontCamber] = useState(-2.0)
  const [rearCamber, setRearCamber] = useState(-1.5)

  // Selected community tune
  const [selectedTune, setSelectedTune] = useState<number | null>(null)

  // Bracket Racing States
  const [bracketDialInTime, setBracketDialInTime] = useState("10.50")
  const [bracketRuns, setBracketRuns] = useState<RunLogEntry[]>([
    { id: 1, date: "2024-05-10", dialIn: "10.50", et: "10.523", mph: "130.1", rt: "0.015" },
    { id: 2, date: "2024-05-10", dialIn: "10.50", et: "10.498", mph: "130.5", rt: "0.008" },
  ])
  const [newRunET, setNewRunET] = useState("")
  const [newRunMPH, setNewRunMPH] = useState("")
  const [newRunRT, setNewRunRT] = useState("")
  const [savedBracketConfigs, setSavedBracketConfigs] = useState<BracketConfig[]>([
    {
      id: "bracket-config-1",
      name: "Sunny Day Setup",
      car: "1999 Mitsubishi Eclipse GSX",
      dialInTime: "10.50",
      runs: [],
    },
    {
      id: "bracket-config-2",
      name: "Cool Night Pass",
      car: "1993 Mazda RX-7",
      dialInTime: "11.20",
      runs: [],
    },
  ])
  const [saveBracketDialogOpen, setSaveBracketDialogOpen] = useState(false)
  const [newBracketConfigName, setNewBracketConfigName] = useState("")

  // Add new state for selected run
  const [selectedRunForSimulation, setSelectedRunForSimulation] = useState<RunLogEntry | null>(null)

  const loadCommunityTune = (tuneId: number) => {
    const tune = communityTunes.find((t) => t.id === tuneId)
    if (!tune) return

    setSelectedTune(tuneId)
    setSelectedCar(tune.car)
    setTuneName(`${tune.title} (Copy)`)

    // Load all the settings
    setFrontSuspension(tune.settings.suspension.front)
    setRearSuspension(tune.settings.suspension.rear)
    setFrontCamber(tune.settings.camber.front)
    setRearCamber(tune.settings.camber.rear)

    setActiveTab("my-tunes")
  }

  const saveTune = () => {
    // In a real app, this would save to a database
    alert(`Tune "${tuneName}" for ${selectedCar} saved successfully!`)
  }

  const exportTune = () => {
    const tuneData = {
      name: tuneName,
      car: selectedCar,
      settings: {
        suspension: { front: frontSuspension, rear: rearSuspension },
        camber: { front: frontCamber, rear: rearCamber },
      },
    }

    const blob = new Blob([JSON.stringify(tuneData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedCar.replace(/\s+/g, "-").toLowerCase()}-tune.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const addBracketRun = () => {
    if (!newRunET || !newRunMPH || !newRunRT) {
      alert("Please fill in all run details.")
      return
    }
    const newRun: RunLogEntry = {
      id: bracketRuns.length + 1,
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      dialIn: bracketDialInTime,
      et: newRunET,
      mph: newRunMPH,
      rt: newRunRT,
    }
    setBracketRuns([...bracketRuns, newRun])
    setNewRunET("")
    setNewRunMPH("")
    setNewRunRT("")
  }

  const saveBracketConfig = () => {
    if (!newBracketConfigName.trim()) {
      alert("Please enter a name for your bracket configuration.")
      return
    }

    const newConfig: BracketConfig = {
      id: `bracket-config-${Date.now()}`,
      name: newBracketConfigName,
      car: selectedCar,
      dialInTime: bracketDialInTime,
      runs: [...bracketRuns], // Save current runs with the config
    }

    setSavedBracketConfigs([...savedBracketConfigs, newConfig])
    setNewBracketConfigName("")
    setSaveBracketDialogOpen(false)
  }

  const loadBracketConfig = (config: BracketConfig) => {
    setSelectedCar(config.car)
    setBracketDialInTime(config.dialInTime)
    setBracketRuns([...config.runs])
    setActiveTab("bracket-racing")
  }

  const deleteBracketConfig = (id: string) => {
    setSavedBracketConfigs(savedBracketConfigs.filter((config) => config.id !== id))
  }

  const handleSelectRunForSimulation = (run: RunLogEntry) => {
    setSelectedRunForSimulation(run)
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
            <span className="text-white">Tuning</span>
            <span className="text-red-600"> Hub</span>
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-900">
            {" "}
            {/* Increased grid-cols to 4 */}
            <TabsTrigger value="my-tunes" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              My Tunes
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Community Tunes
            </TabsTrigger>
            <TabsTrigger
              value="bracket-racing"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Bracket Racing
            </TabsTrigger>
            <TabsTrigger
              value="reaction-time"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Reaction Time
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-tunes" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Card className="bg-zinc-900 text-white">
                  <CardHeader>
                    <CardTitle>Tune Information</CardTitle>
                    <CardDescription className="text-gray-400">Name your tune and select your car</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tune-name">Tune Name</Label>
                      <Input
                        id="tune-name"
                        value={tuneName}
                        onChange={(e) => setTuneName(e.target.value)}
                        className="border-zinc-700 bg-zinc-800 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="car-model">Car Model</Label>
                      <Select value={selectedCar} onValueChange={setSelectedCar}>
                        <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                          <SelectValue placeholder="Select a car" />
                        </SelectTrigger>
                        <SelectContent className="border-zinc-700 bg-zinc-800 text-white max-h-[300px]">
                          {carModels.map((car) => (
                            <SelectItem key={car} value={car}>
                              {car}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-zinc-900 text-white">
                <CardHeader>
                  <CardTitle>Suspension</CardTitle>
                  <CardDescription className="text-gray-400">Adjust suspension stiffness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="front-suspension">Front Suspension</Label>
                      <span className="text-sm font-medium">{frontSuspension.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="front-suspension"
                      min={1}
                      max={10}
                      step={0.1}
                      value={[frontSuspension]}
                      onValueChange={(value) => setFrontSuspension(value[0])}
                      className="[&>span:first-child]:bg-red-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rear-suspension">Rear Suspension</Label>
                      <span className="text-sm font-medium">{rearSuspension.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="rear-suspension"
                      min={1}
                      max={10}
                      step={0.1}
                      value={[rearSuspension]}
                      onValueChange={(value) => setRearSuspension(value[0])}
                      className="[&>span:first-child]:bg-red-600"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 text-white">
                <CardHeader>
                  <CardTitle>Camber</CardTitle>
                  <CardDescription className="text-gray-400">Adjust wheel camber angle</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="front-camber">Front Camber</Label>
                      <span className="text-sm font-medium">{frontCamber.toFixed(1)}°</span>
                    </div>
                    <Slider
                      id="front-camber"
                      min={-5}
                      max={2}
                      step={0.1}
                      value={[frontCamber]}
                      onValueChange={(value) => setFrontCamber(value[0])}
                      className="[&>span:first-child]:bg-red-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rear-camber">Rear Camber</Label>
                      <span className="text-sm font-medium">{rearCamber.toFixed(1)}°</span>
                    </div>
                    <Slider
                      id="rear-camber"
                      min={-5}
                      max={2}
                      step={0.1}
                      value={[rearCamber]}
                      onValueChange={(value) => setRearCamber(value[0])}
                      className="[&>span:first-child]:bg-red-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" className="bg-black text-red-600 hover:bg-red-950/20" onClick={saveTune}>
                <Save className="mr-2 h-4 w-4" /> Save Tune
              </Button>
              <Button className="bg-red-600 text-white hover:bg-red-700" onClick={exportTune}>
                <Download className="mr-2 h-4 w-4" /> Export Tune
              </Button>
              <Button variant="outline" className="bg-black text-red-600 hover:bg-red-950/20">
                <Share2 className="mr-2 h-4 w-4" /> Share with Community
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {communityTunes.map((tune) => (
                <Card key={tune.id} className="bg-zinc-900 text-white">
                  <CardHeader>
                    <CardTitle>{tune.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      <div className="flex items-center">
                        <Car className="mr-1 h-4 w-4" /> {tune.car}
                      </div>
                      <div className="flex items-center mt-1">
                        <Users className="mr-1 h-4 w-4" /> By {tune.author}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Suspension (F/R)</p>
                          <p>
                            {tune.settings.suspension.front} / {tune.settings.suspension.rear}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Camber (F/R)</p>
                          <p>
                            {tune.settings.camber.front}° / {tune.settings.camber.rear}°
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <ThumbsUp className="mr-1 h-4 w-4 text-gray-400" />
                            <span>{tune.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <Download className="mr-1 h-4 w-4" />
                            <span>{tune.downloads}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => loadCommunityTune(tune.id)}
                        >
                          Use This Tune
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bracket-racing" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-zinc-900 text-white">
                <CardHeader>
                  <CardTitle>Bracket Settings</CardTitle>
                  <CardDescription className="text-gray-400">Configure your dial-in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bracket-car-model">Car Model</Label>
                    <Select value={selectedCar} onValueChange={setSelectedCar}>
                      <SelectTrigger id="bracket-car-model" className="border-zinc-700 bg-zinc-800 text-white">
                        <SelectValue placeholder="Select a car" />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-700 bg-zinc-800 text-white max-h-[300px]">
                        {carModels.map((car) => (
                          <SelectItem key={car} value={car}>
                            {car}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dial-in-time">Target Dial-in Time (ET)</Label>
                    <Input
                      id="dial-in-time"
                      type="text"
                      value={bracketDialInTime}
                      onChange={(e) => setBracketDialInTime(e.target.value)}
                      placeholder="e.g., 10.50"
                      className="border-zinc-700 bg-zinc-800 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 text-white">
                <CardHeader>
                  <CardTitle>Run Log</CardTitle>
                  <CardDescription className="text-gray-400">Record your passes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="ET (s)"
                      value={newRunET}
                      onChange={(e) => setNewRunET(e.target.value)}
                      className="border-zinc-700 bg-zinc-800 text-white"
                    />
                    <Input
                      placeholder="MPH"
                      value={newRunMPH}
                      onChange={(e) => setNewRunMPH(e.target.value)}
                      className="border-zinc-700 bg-zinc-800 text-white"
                    />
                    <Input
                      placeholder="RT (s)"
                      value={newRunRT}
                      onChange={(e) => setNewRunRT(e.target.value)}
                      className="border-zinc-700 bg-zinc-800 text-white"
                    />
                  </div>
                  <Button className="w-full bg-red-600 text-white hover:bg-red-700" onClick={addBracketRun}>
                    <Plus className="mr-2 h-4 w-4" /> Add Run
                  </Button>

                  <div className="max-h-[300px] overflow-y-auto pr-2">
                    {bracketRuns.length === 0 ? (
                      <p className="text-center text-gray-500">No runs logged yet.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-zinc-800 text-gray-400">
                            <th className="py-2 text-left">Date</th>
                            <th className="py-2 text-left">Dial-in</th>
                            <th className="py-2 text-left">ET</th>
                            <th className="py-2 text-left">MPH</th>
                            <th className="py-2 text-left">RT</th>
                            <th className="py-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bracketRuns.map((run) => (
                            <tr key={run.id} className="border-b border-zinc-800">
                              <td className="py-2">{run.date}</td>
                              <td className="py-2">{run.dialIn}</td>
                              <td className="py-2">{run.et}</td>
                              <td className="py-2">{run.mph}</td>
                              <td className="py-2">{run.rt}</td>
                              <td className="py-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-black text-red-600 hover:bg-red-950/20"
                                  onClick={() => handleSelectRunForSimulation(run)}
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <Card className="bg-zinc-900 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Saved Bracket Configurations
                      <Dialog open={saveBracketDialogOpen} onOpenChange={setSaveBracketDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-black text-red-600 hover:bg-red-950/20">
                            <Plus className="mr-2 h-4 w-4" /> Save Current
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 text-white border-zinc-800">
                          <DialogHeader>
                            <DialogTitle>Save Bracket Configuration</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Give your current bracket setup a name to save it.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Label htmlFor="bracket-config-name" className="mb-2 block">
                              Configuration Name
                            </Label>
                            <Input
                              id="bracket-config-name"
                              value={newBracketConfigName}
                              onChange={(e) => setNewBracketConfigName(e.target.value)}
                              placeholder="e.g., Hot Day Dial-in"
                              className="border-zinc-700 bg-zinc-800 text-white"
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="ghost" onClick={() => setSaveBracketDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={saveBracketConfig}
                              disabled={!newBracketConfigName.trim()}
                            >
                              Save
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Load or delete your saved bracket setups.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedBracketConfigs.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No saved bracket configurations.</p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {savedBracketConfigs.map((config) => (
                          <Card key={config.id} className="bg-zinc-800 text-white border-zinc-700">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-lg">{config.name}</CardTitle>
                              <CardDescription className="text-gray-400 text-xs">{config.car}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-sm space-y-1">
                              <div className="flex items-center text-gray-300">
                                Dial-in: <span className="ml-1 font-medium text-white">{config.dialInTime}s</span>
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-black text-red-600 hover:bg-red-950/20"
                                onClick={() => loadBracketConfig(config)}
                              >
                                Load
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-black text-gray-400 hover:bg-zinc-700 hover:text-red-600"
                                onClick={() => deleteBracketConfig(config.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Card for Bracket Simulator */}
              <div className="md:col-span-2">
                <Card className="bg-zinc-900 text-white">
                  <CardHeader>
                    <CardTitle>Bracket Race Simulator</CardTitle>
                    <CardDescription className="text-gray-400">
                      Visualize a logged run against your current dial-in.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BracketSimulator run={selectedRunForSimulation} dialIn={bracketDialInTime} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* New Tab Content for Reaction Time Analyzer */}
          <TabsContent value="reaction-time" className="mt-6">
            <ReactionTimeAnalyzer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

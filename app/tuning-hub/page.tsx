"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Car, Download, Save, Share2, ThumbsUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavBar } from "@/components/nav-bar"

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
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
            <TabsTrigger value="my-tunes" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              My Tunes
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Community Tunes
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
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-950/20" onClick={saveTune}>
                <Save className="mr-2 h-4 w-4" /> Save Tune
              </Button>
              <Button className="bg-red-600 text-white hover:bg-red-700" onClick={exportTune}>
                <Download className="mr-2 h-4 w-4" /> Export Tune
              </Button>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-950/20">
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
                            <Download className="mr-1 h-4 w-4 text-gray-400" />
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
        </Tabs>
      </div>
    </div>
  )
}

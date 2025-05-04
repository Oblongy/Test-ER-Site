"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Save, Info, Trash2, Plus, Check, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RatioVisualizer } from "@/components/ratio-visualizer"
import { NavBar } from "@/components/nav-bar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ComparisonVisualizer } from "@/components/comparison-visualizer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PerformanceSimulator } from "@/components/performance-simulator"

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

// Type for a saved configuration
interface GearConfig {
  id: string
  name: string
  car: string
  finalDrive: number
  gears: number[]
  rpm: number
  tireSize: number
  spreadFactor: number
  gearCount: 5 | 6
  firstGear: number
  color: string
  weight?: number
  power?: number
  torque?: number
  quarterMileTime?: number
  halfMileTime?: number
}

// Type for performance metrics
interface PerformanceMetrics {
  quarterMileTime: number
  quarterMileSpeed: number
  halfMileTime: number
  halfMileSpeed: number
}

export default function RatioMaker() {
  const [finalDrive, setFinalDrive] = useState(4.1)
  const [firstGear, setFirstGear] = useState(3.5)
  const [gearCount, setGearCount] = useState<5 | 6>(5)
  const [gears, setGears] = useState<number[]>([])
  const [rpm, setRpm] = useState(7500)
  const [tireSize, setTireSize] = useState(26)
  const [activeTab, setActiveTab] = useState("calculator")
  const [spreadFactor, setSpreadFactor] = useState(0.8)
  const [savedConfigs, setSavedConfigs] = useState<GearConfig[]>([])
  const [configName, setConfigName] = useState("")
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([])
  const [selectedCar, setSelectedCar] = useState("1999 Mitsubishi Eclipse GSX")
  const [carWeight, setCarWeight] = useState(3200)
  const [carPower, setCarPower] = useState(210)
  const [carTorque, setCarTorque] = useState(214)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    quarterMileTime: 0,
    quarterMileSpeed: 0,
    halfMileTime: 0,
    halfMileSpeed: 0,
  })

  // Available colors for configurations
  const configColors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#14b8a6", // teal
  ]

  // Calculate gear ratios based on first gear and spread factor
  useEffect(() => {
    calculateGearRatios()
  }, [firstGear, gearCount, spreadFactor])

  // Calculate performance metrics when relevant parameters change
  useEffect(() => {
    calculatePerformanceMetrics()
  }, [gears, finalDrive, rpm, tireSize, carWeight, carPower, carTorque])

  // Load saved configurations from localStorage on component mount
  useEffect(() => {
    const savedConfigsStr = localStorage.getItem("savedGearConfigs")
    if (savedConfigsStr) {
      try {
        const parsedConfigs = JSON.parse(savedConfigsStr)
        setSavedConfigs(parsedConfigs)
      } catch (e) {
        console.error("Failed to parse saved configurations:", e)
      }
    }
  }, [])

  // Save configurations to localStorage when they change
  useEffect(() => {
    if (savedConfigs.length > 0) {
      localStorage.setItem("savedGearConfigs", JSON.stringify(savedConfigs))
    }
  }, [savedConfigs])

  // Load car-specific configuration when car changes
  useEffect(() => {
    const carConfig = savedConfigs.find((config) => config.car === selectedCar)
    if (carConfig) {
      // Don't automatically load the config, just show a notification or badge
      // that there's a saved config for this car
    } else {
      // Set default values based on car type
      if (selectedCar.includes("Corvette")) {
        setCarWeight(3200)
        setCarPower(400)
        setCarTorque(400)
      } else if (selectedCar.includes("Civic")) {
        setCarWeight(2600)
        setCarPower(160)
        setCarTorque(140)
      } else if (selectedCar.includes("Eclipse")) {
        setCarWeight(3200)
        setCarPower(210)
        setCarTorque(214)
      } else if (selectedCar.includes("Lancer")) {
        setCarWeight(3200)
        setCarPower(276)
        setCarTorque(286)
      } else {
        setCarWeight(3200)
        setCarPower(250)
        setCarTorque(250)
      }
    }
  }, [selectedCar])

  const calculateGearRatios = () => {
    // Start with the first gear
    const newGears = [firstGear]

    // Calculate the remaining gears using a progressive pattern
    // Each gear is a percentage of the previous gear
    for (let i = 1; i < gearCount; i++) {
      // For the last gear, always use 1.0 (direct drive)
      if (i === gearCount - 1) {
        newGears.push(1.0)
      } else {
        // Calculate the ratio for this gear based on the previous gear
        const prevGear = newGears[i - 1]
        const factor = Math.pow(1.0 / firstGear, 1 / (gearCount - 1)) * spreadFactor
        const nextGear = prevGear * factor
        newGears.push(Number.parseFloat(nextGear.toFixed(3)))
      }
    }

    setGears(newGears)
  }

  const calculatePerformanceMetrics = () => {
    // Simple performance calculation based on power-to-weight ratio and gearing
    // This is a simplified model and doesn't account for many real-world factors

    const powerToWeightRatio = carPower / carWeight
    const torqueToWeightRatio = carTorque / carWeight

    // Quarter mile calculation (simplified)
    const quarterMileTime = 12.5 - powerToWeightRatio * 10 + finalDrive / 10
    const quarterMileSpeed = 100 + powerToWeightRatio * 100 - finalDrive * 2

    // Half mile calculation
    const halfMileTime = quarterMileTime * 1.6
    const halfMileSpeed = quarterMileSpeed * 1.3

    setPerformanceMetrics({
      quarterMileTime: Math.max(9, Math.min(16, quarterMileTime)),
      quarterMileSpeed: Math.max(80, Math.min(160, quarterMileSpeed)),
      halfMileTime: Math.max(14, Math.min(25, halfMileTime)),
      halfMileSpeed: Math.max(100, Math.min(200, halfMileSpeed)),
    })
  }

  const updateGear = (index: number, value: number) => {
    const newGears = [...gears]
    newGears[index] = value
    setGears(newGears)
  }

  const calculateSpeed = (
    gearRatio: number,
    finalDriveRatio: number = finalDrive,
    rpmValue: number = rpm,
    tireSizeValue: number = tireSize,
  ) => {
    // Speed (mph) = (RPM × tire diameter × π) ÷ (gear ratio × final drive × 336)
    const combinedRatio = gearRatio * finalDriveRatio
    return (rpmValue * tireSizeValue * Math.PI) / (combinedRatio * 336)
  }

  const exportData = () => {
    const data = {
      car: selectedCar,
      finalDrive,
      gears,
      rpm,
      tireSize,
      carWeight,
      carPower,
      carTorque,
      performance: performanceMetrics,
      speeds: gears.map((gear) => calculateSpeed(gear)),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedCar.replace(/\s+/g, "-").toLowerCase()}-ratios.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const saveCurrentConfig = () => {
    if (!configName.trim()) return

    // Generate a unique ID
    const id = `config-${Date.now()}`

    // Find an unused color
    const usedColors = savedConfigs.map((config) => config.color)
    const availableColors = configColors.filter((color) => !usedColors.includes(color))
    const color =
      availableColors.length > 0 ? availableColors[0] : configColors[savedConfigs.length % configColors.length]

    const newConfig: GearConfig = {
      id,
      name: configName,
      car: selectedCar,
      finalDrive,
      gears: [...gears],
      rpm,
      tireSize,
      spreadFactor,
      gearCount,
      firstGear,
      color,
      weight: carWeight,
      power: carPower,
      torque: carTorque,
      quarterMileTime: performanceMetrics.quarterMileTime,
      halfMileTime: performanceMetrics.halfMileTime,
    }

    setSavedConfigs([...savedConfigs, newConfig])
    setConfigName("")
    setSaveDialogOpen(false)

    // Automatically select the new config for comparison
    setSelectedConfigs([...selectedConfigs, id])

    // Switch to comparison tab if this is the second config
    if (savedConfigs.length === 1) {
      setActiveTab("comparison")
    }
  }

  const deleteConfig = (id: string) => {
    setSavedConfigs(savedConfigs.filter((config) => config.id !== id))
    setSelectedConfigs(selectedConfigs.filter((configId) => configId !== id))
  }

  const loadConfig = (config: GearConfig) => {
    setSelectedCar(config.car)
    setFinalDrive(config.finalDrive)
    setGears([...config.gears])
    setRpm(config.rpm)
    setTireSize(config.tireSize)
    setSpreadFactor(config.spreadFactor)
    setGearCount(config.gearCount)
    setFirstGear(config.firstGear)
    if (config.weight) setCarWeight(config.weight)
    if (config.power) setCarPower(config.power)
    if (config.torque) setCarTorque(config.torque)
    setActiveTab("calculator")
  }

  const toggleConfigSelection = (id: string) => {
    if (selectedConfigs.includes(id)) {
      setSelectedConfigs(selectedConfigs.filter((configId) => configId !== id))
    } else {
      // Limit to 4 selections to avoid visual clutter
      if (selectedConfigs.length < 4) {
        setSelectedConfigs([...selectedConfigs, id])
      }
    }
  }

  const getCarSpecificConfigs = () => {
    return savedConfigs.filter((config) => config.car === selectedCar)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-6 flex items-center">
          <Button asChild variant="ghost" className="mr-4 text-gray-400 hover:text-white">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            <span className="text-white">Ratio</span>
            <span className="text-red-600"> Maker</span>
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-900">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Calculator
            </TabsTrigger>
            <TabsTrigger
              value="visualization"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Visualization
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Performance
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-zinc-900 text-white transition-all duration-300 hover:shadow-md hover:shadow-red-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      Car Selection
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-2 h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Select your car model. Each car can have saved gear ratio configurations.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {getCarSpecificConfigs().length > 0 && (
                      <Badge className="bg-red-600">
                        {getCarSpecificConfigs().length} saved{" "}
                        {getCarSpecificConfigs().length === 1 ? "config" : "configs"}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Select your car and enter its specifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="car-weight">Weight (lbs)</Label>
                      <Input
                        id="car-weight"
                        type="number"
                        min={1500}
                        max={5000}
                        value={carWeight}
                        onChange={(e) => setCarWeight(Number.parseInt(e.target.value))}
                        className="border-zinc-700 bg-zinc-800 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="car-power">Power (hp)</Label>
                      <Input
                        id="car-power"
                        type="number"
                        min={100}
                        max={1000}
                        value={carPower}
                        onChange={(e) => setCarPower(Number.parseInt(e.target.value))}
                        className="border-zinc-700 bg-zinc-800 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="car-torque">Torque (lb-ft)</Label>
                      <Input
                        id="car-torque"
                        type="number"
                        min={100}
                        max={1000}
                        value={carTorque}
                        onChange={(e) => setCarTorque(Number.parseInt(e.target.value))}
                        className="border-zinc-700 bg-zinc-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="final-drive">Final Drive</Label>
                      <div className="flex items-center">
                        <Input
                          id="final-drive-input"
                          type="number"
                          min={2.2}
                          max={6}
                          step={0.01}
                          value={finalDrive}
                          onChange={(e) => setFinalDrive(Number.parseFloat(e.target.value))}
                          className="w-20 border-zinc-700 bg-zinc-800 text-right text-white"
                        />
                      </div>
                    </div>
                    <Slider
                      id="final-drive"
                      min={2.2}
                      max={6}
                      step={0.01}
                      value={[finalDrive]}
                      onValueChange={(value) => setFinalDrive(value[0])}
                      className="[&>span:first-child]:bg-red-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="first-gear">First Gear</Label>
                      <div className="flex items-center">
                        <Input
                          id="first-gear-input"
                          type="number"
                          min={2}
                          max={5}
                          step={0.01}
                          value={firstGear}
                          onChange={(e) => setFirstGear(Number.parseFloat(e.target.value))}
                          className="w-20 border-zinc-700 bg-zinc-800 text-right text-white"
                        />
                      </div>
                    </div>
                    <Slider
                      id="first-gear"
                      min={2}
                      max={5}
                      step={0.01}
                      value={[firstGear]}
                      onValueChange={(value) => setFirstGear(value[0])}
                      className="[&>span:first-child]:bg-red-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="spread-factor">Spread Factor</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Controls how close or spread out your gear ratios are. Higher values create more closely
                              spaced ratios.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="flex items-center">
                        <Input
                          id="spread-factor-input"
                          type="number"
                          min={0.6}
                          max={0.95}
                          step={0.01}
                          value={spreadFactor}
                          onChange={(e) => setSpreadFactor(Number.parseFloat(e.target.value))}
                          className="w-20 border-zinc-700 bg-zinc-800 text-right text-white"
                        />
                      </div>
                    </div>
                    <Slider
                      id="spread-factor"
                      min={0.6}
                      max={0.95}
                      step={0.01}
                      value={[spreadFactor]}
                      onValueChange={(value) => setSpreadFactor(value[0])}
                      className="[&>span:first-child]:bg-red-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Gears</Label>
                    <RadioGroup
                      value={gearCount.toString()}
                      onValueChange={(value) => setGearCount(Number.parseInt(value) as 5 | 6)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="five-speed" className="border-red-600 text-red-600" />
                        <Label htmlFor="five-speed" className="cursor-pointer">
                          5-Speed
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="6" id="six-speed" className="border-red-600 text-red-600" />
                        <Label htmlFor="six-speed" className="cursor-pointer">
                          6-Speed
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rpm">Max RPM</Label>
                      <div className="flex items-center">
                        <Input
                          id="rpm-input"
                          type="number"
                          min={5000}
                          max={12000}
                          step={100}
                          value={rpm}
                          onChange={(e) => setRpm(Number.parseInt(e.target.value))}
                          className="w-20 border-zinc-700 bg-zinc-800 text-right text-white"
                        />
                      </div>
                    </div>
                    <Slider
                      id="rpm"
                      min={5000}
                      max={12000}
                      step={100}
                      value={[rpm]}
                      onValueChange={(value) => setRpm(value[0])}
                      className="[&>span:first-child]:bg-red-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tire-size">Tire Diameter (inches)</Label>
                      <div className="flex items-center">
                        <Input
                          id="tire-size-input"
                          type="number"
                          min={15}
                          max={35}
                          step={0.5}
                          value={tireSize}
                          onChange={(e) => setTireSize(Number.parseFloat(e.target.value))}
                          className="w-20 border-zinc-700 bg-zinc-800 text-right text-white"
                        />
                      </div>
                    </div>
                    <Slider
                      id="tire-size"
                      min={15}
                      max={35}
                      step={0.5}
                      value={[tireSize]}
                      onValueChange={(value) => setTireSize(value[0])}
                      className="[&>span:first-child]:bg-red-600"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 text-white transition-all duration-300 hover:shadow-md hover:shadow-red-900/20">
                <CardHeader>
                  <CardTitle>Calculated Gear Ratios</CardTitle>
                  <CardDescription className="text-gray-400">
                    Optimized gear ratios based on your inputs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gears.map((gear, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`gear-${index + 1}`}>Gear {index + 1}</Label>
                        <div className="flex items-center">
                          <Input
                            id={`gear-${index + 1}-input`}
                            type="number"
                            min={0.5}
                            max={5}
                            step={0.001}
                            value={gear}
                            onChange={(e) => updateGear(index, Number.parseFloat(e.target.value))}
                            className="w-20 border-zinc-700 bg-zinc-800 text-right text-white"
                          />
                        </div>
                      </div>
                      <Slider
                        id={`gear-${index + 1}`}
                        min={0.5}
                        max={5}
                        step={0.001}
                        value={[gear]}
                        onValueChange={(value) => updateGear(index, value[0])}
                        className="[&>span:first-child]:bg-red-600"
                      />
                    </div>
                  ))}

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-zinc-800 p-4">
                      <div className="flex items-center space-x-2 text-red-500">
                        <Flag className="h-5 w-5" />
                        <h3 className="font-semibold">Quarter Mile</h3>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-400">Time</p>
                          <p className="text-lg font-bold">{performanceMetrics.quarterMileTime.toFixed(2)}s</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Speed</p>
                          <p className="text-lg font-bold">{performanceMetrics.quarterMileSpeed.toFixed(1)} mph</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-zinc-800 p-4">
                      <div className="flex items-center space-x-2 text-red-500">
                        <Flag className="h-5 w-5" />
                        <h3 className="font-semibold">Half Mile</h3>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-400">Time</p>
                          <p className="text-lg font-bold">{performanceMetrics.halfMileTime.toFixed(2)}s</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Speed</p>
                          <p className="text-lg font-bold">{performanceMetrics.halfMileSpeed.toFixed(1)} mph</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 bg-zinc-900 text-white transition-all duration-300 hover:shadow-md hover:shadow-red-900/20">
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription className="text-gray-400">Calculated speeds at max RPM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="pb-2 text-left">Gear</th>
                        <th className="pb-2 text-left">Ratio</th>
                        <th className="pb-2 text-left">Combined Ratio</th>
                        <th className="pb-2 text-left">Speed at {rpm.toLocaleString()} RPM</th>
                        <th className="pb-2 text-left">RPM Drop to Next Gear</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gears.map((gear, index) => (
                        <tr key={index} className="border-b border-zinc-800">
                          <td className="py-2">{index + 1}</td>
                          <td className="py-2">{gear.toFixed(3)}</td>
                          <td className="py-2">{(gear * finalDrive).toFixed(3)}</td>
                          <td className="py-2">{calculateSpeed(gear).toFixed(1)} mph</td>
                          <td className="py-2">
                            {index < gears.length - 1 ? `${((1 - gears[index + 1] / gear) * 100).toFixed(1)}%` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-950/20 transition-all duration-300 hover:scale-105"
                    onClick={() => calculateGearRatios()}
                  >
                    <Save className="mr-2 h-4 w-4" /> Reset Calculations
                  </Button>
                  <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-950/20 transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Save Configuration
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 text-white border-zinc-800">
                      <DialogHeader>
                        <DialogTitle>Save Configuration</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Give your gear ratio configuration a name to save it for comparison.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="config-name" className="mb-2 block">
                          Configuration Name
                        </Label>
                        <Input
                          id="config-name"
                          value={configName}
                          onChange={(e) => setConfigName(e.target.value)}
                          placeholder="e.g., Track Day Setup"
                          className="border-zinc-700 bg-zinc-800 text-white"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setSaveDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={saveCurrentConfig}
                          disabled={!configName.trim()}
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700 transition-all duration-300 hover:scale-105"
                    onClick={exportData}
                  >
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visualization" className="mt-6">
            <Card className="bg-zinc-900 text-white transition-all duration-300 hover:shadow-md hover:shadow-red-900/20">
              <CardHeader>
                <CardTitle>Gear Ratio Visualization</CardTitle>
                <CardDescription className="text-gray-400">
                  Visual representation of your gear ratios and speed ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RatioVisualizer gears={gears} primaryGear={1} finalDrive={finalDrive} rpm={rpm} tireSize={tireSize} />

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-950/20 transition-all duration-300 hover:scale-105"
                    onClick={() => calculateGearRatios()}
                  >
                    <Save className="mr-2 h-4 w-4" /> Reset Calculations
                  </Button>
                  <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-950/20 transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Save Configuration
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 text-white border-zinc-800">
                      <DialogHeader>
                        <DialogTitle>Save Configuration</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Give your gear ratio configuration a name to save it for comparison.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="config-name" className="mb-2 block">
                          Configuration Name
                        </Label>
                        <Input
                          id="config-name"
                          value={configName}
                          onChange={(e) => setConfigName(e.target.value)}
                          placeholder="e.g., Track Day Setup"
                          className="border-zinc-700 bg-zinc-800 text-white"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setSaveDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={saveCurrentConfig}
                          disabled={!configName.trim()}
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700 transition-all duration-300 hover:scale-105"
                    onClick={exportData}
                  >
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <Card className="bg-zinc-900 text-white transition-all duration-300 hover:shadow-md hover:shadow-red-900/20">
              <CardHeader>
                <CardTitle>Performance Simulation</CardTitle>
                <CardDescription className="text-gray-400">
                  Simulate quarter mile and half mile performance with your current gear ratios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceSimulator
                  gears={gears}
                  finalDrive={finalDrive}
                  rpm={rpm}
                  tireSize={tireSize}
                  carWeight={carWeight}
                  carPower={carPower}
                  carTorque={carTorque}
                  car={selectedCar}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <div className="grid gap-6">
              <Card className="bg-zinc-900 text-white">
                <CardHeader>
                  <CardTitle>Saved Configurations</CardTitle>
                  <CardDescription className="text-gray-400">
                    Select configurations to compare side by side
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedConfigs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Info className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-gray-400">No saved configurations yet.</p>
                      <p className="mt-2 text-sm text-gray-500">
                        Create and save a configuration from the Calculator tab to compare.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {savedConfigs.map((config) => (
                        <Card
                          key={config.id}
                          className={`border-l-4 transition-all duration-300 hover:shadow-md ${
                            selectedConfigs.includes(config.id) ? "border-l-zinc-200" : "border-l-zinc-700"
                          }`}
                          style={{ borderLeftColor: selectedConfigs.includes(config.id) ? config.color : undefined }}
                        >
                          <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{config.name}</CardTitle>
                                <p className="text-xs text-gray-400">{config.car}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-400 hover:text-white"
                                  onClick={() => loadConfig(config)}
                                >
                                  <Save className="h-4 w-4" />
                                  <span className="sr-only">Load</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-400 hover:text-red-600"
                                  onClick={() => deleteConfig(config.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-400">Final Drive:</span> {config.finalDrive.toFixed(2)}
                              </div>
                              <div>
                                <span className="text-gray-400">First Gear:</span> {config.firstGear.toFixed(2)}
                              </div>
                              <div>
                                <span className="text-gray-400">Gears:</span> {config.gearCount}
                              </div>
                              <div>
                                <span className="text-gray-400">Spread:</span> {config.spreadFactor.toFixed(2)}
                              </div>
                            </div>
                            {config.quarterMileTime && (
                              <div className="mt-2 grid grid-cols-2 gap-2 text-sm border-t border-zinc-800 pt-2">
                                <div>
                                  <span className="text-gray-400">1/4 Mile:</span> {config.quarterMileTime.toFixed(2)}s
                                </div>
                                <div>
                                  <span className="text-gray-400">1/2 Mile:</span> {config.halfMileTime?.toFixed(2)}s
                                </div>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button
                              variant={selectedConfigs.includes(config.id) ? "default" : "outline"}
                              size="sm"
                              className="w-full"
                              style={{
                                backgroundColor: selectedConfigs.includes(config.id) ? config.color : "transparent",
                                borderColor: config.color,
                                color: selectedConfigs.includes(config.id) ? "white" : config.color,
                              }}
                              onClick={() => toggleConfigSelection(config.id)}
                            >
                              {selectedConfigs.includes(config.id) ? (
                                <>
                                  <Check className="mr-1 h-4 w-4" /> Selected
                                </>
                              ) : (
                                "Select for Comparison"
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedConfigs.length > 0 && (
                <>
                  <Card className="bg-zinc-900 text-white">
                    <CardHeader>
                      <CardTitle>Visual Comparison</CardTitle>
                      <CardDescription className="text-gray-400">
                        Compare gear ratios and speed ranges visually
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ComparisonVisualizer
                        configs={savedConfigs.filter((config) => selectedConfigs.includes(config.id))}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 text-white">
                    <CardHeader>
                      <CardTitle>Data Comparison</CardTitle>
                      <CardDescription className="text-gray-400">
                        Side-by-side comparison of gear ratios and speeds
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-zinc-800">
                              <th className="pb-2 text-left">Gear</th>
                              {savedConfigs
                                .filter((config) => selectedConfigs.includes(config.id))
                                .map((config) => (
                                  <th key={config.id} className="pb-2 text-left">
                                    <div className="flex items-center">
                                      <div
                                        className="mr-2 h-3 w-3 rounded-full"
                                        style={{ backgroundColor: config.color }}
                                      ></div>
                                      {config.name}
                                    </div>
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from({ length: Math.max(...savedConfigs.map((c) => c.gearCount)) }).map(
                              (_, gearIndex) => (
                                <tr key={gearIndex} className="border-b border-zinc-800">
                                  <td className="py-2 font-medium">Gear {gearIndex + 1}</td>
                                  {savedConfigs
                                    .filter((config) => selectedConfigs.includes(config.id))
                                    .map((config) => (
                                      <td key={config.id} className="py-2">
                                        {gearIndex < config.gears.length ? (
                                          <div>
                                            <div>{config.gears[gearIndex].toFixed(3)}</div>
                                            <div className="text-sm text-gray-400">
                                              {calculateSpeed(
                                                config.gears[gearIndex],
                                                config.finalDrive,
                                                config.rpm,
                                                config.tireSize,
                                              ).toFixed(1)}{" "}
                                              mph
                                            </div>
                                          </div>
                                        ) : (
                                          "-"
                                        )}
                                      </td>
                                    ))}
                                </tr>
                              ),
                            )}
                            <tr className="border-b border-zinc-800 bg-zinc-800/30">
                              <td className="py-2 font-medium">Final Drive</td>
                              {savedConfigs
                                .filter((config) => selectedConfigs.includes(config.id))
                                .map((config) => (
                                  <td key={config.id} className="py-2">
                                    {config.finalDrive.toFixed(2)}
                                  </td>
                                ))}
                            </tr>
                            <tr className="border-b border-zinc-800 bg-zinc-800/30">
                              <td className="py-2 font-medium">Top Speed</td>
                              {savedConfigs
                                .filter((config) => selectedConfigs.includes(config.id))
                                .map((config) => {
                                  const lastGear = config.gears[config.gears.length - 1]
                                  return (
                                    <td key={config.id} className="py-2">
                                      {calculateSpeed(lastGear, config.finalDrive, config.rpm, config.tireSize).toFixed(
                                        1,
                                      )}{" "}
                                      mph
                                    </td>
                                  )
                                })}
                            </tr>
                            <tr className="border-b border-zinc-800 bg-zinc-800/30">
                              <td className="py-2 font-medium">1/4 Mile</td>
                              {savedConfigs
                                .filter((config) => selectedConfigs.includes(config.id))
                                .map((config) => (
                                  <td key={config.id} className="py-2">
                                    {config.quarterMileTime ? `${config.quarterMileTime.toFixed(2)}s` : "-"}
                                  </td>
                                ))}
                            </tr>
                            <tr className="border-b border-zinc-800 bg-zinc-800/30">
                              <td className="py-2 font-medium">1/2 Mile</td>
                              {savedConfigs
                                .filter((config) => selectedConfigs.includes(config.id))
                                .map((config) => (
                                  <td key={config.id} className="py-2">
                                    {config.halfMileTime ? `${config.halfMileTime.toFixed(2)}s` : "-"}
                                  </td>
                                ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

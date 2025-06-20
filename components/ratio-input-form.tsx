"use client"

import type React from "react"

import { useState } from "react"
import { Button3D } from "@/components/ui/button-3d"
import { FloatingInput } from "@/components/ui/floating-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"

interface RatioInputFormProps {
  onCalculate: (values: {
    firstGear: number
    gearCount: 5 | 6
    spreadFactor: number
    finalDrive: number
    rpm: number
  }) => void
  initialValues?: {
    firstGear: number
    gearCount: 5 | 6
    spreadFactor: number
    finalDrive: number
    rpm: number
  }
}

export function RatioInputForm({
  onCalculate,
  initialValues = {
    firstGear: 3.5,
    gearCount: 5,
    spreadFactor: 0.8,
    finalDrive: 4.1,
    rpm: 7500,
  },
}: RatioInputFormProps) {
  const [firstGear, setFirstGear] = useState(initialValues.firstGear.toString())
  const [gearCount, setGearCount] = useState<5 | 6>(initialValues.gearCount)
  const [spreadFactor, setSpreadFactor] = useState(initialValues.spreadFactor.toString())
  const [finalDrive, setFinalDrive] = useState(initialValues.finalDrive.toString())
  const [rpm, setRpm] = useState(initialValues.rpm.toString())
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!firstGear || isNaN(Number(firstGear)) || Number(firstGear) < 2 || Number(firstGear) > 5) {
      newErrors.firstGear = "First gear must be between 2 and 5"
    }

    if (!spreadFactor || isNaN(Number(spreadFactor)) || Number(spreadFactor) < 0.6 || Number(spreadFactor) > 0.95) {
      newErrors.spreadFactor = "Spread factor must be between 0.6 and 0.95"
    }

    if (!finalDrive || isNaN(Number(finalDrive)) || Number(finalDrive) < 2.2 || Number(finalDrive) > 6) {
      newErrors.finalDrive = "Final drive must be between 2.2 and 6"
    }

    if (!rpm || isNaN(Number(rpm)) || Number(rpm) < 5000 || Number(rpm) > 12000) {
      newErrors.rpm = "RPM must be between 5,000 and 12,000"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onCalculate({
        firstGear: Number(firstGear),
        gearCount,
        spreadFactor: Number(spreadFactor),
        finalDrive: Number(finalDrive),
        rpm: Number(rpm),
      })
    }
  }

  return (
    <Card className="bg-zinc-900 text-white transition-all duration-300 hover:shadow-md hover:shadow-red-900/20">
      <CardHeader>
        <CardTitle>Transmission Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FloatingInput
              id="first-gear"
              label="First Gear Ratio"
              type="number"
              required
              className="mb-4"
              error={errors.firstGear}
              onChange={(e) => setFirstGear(e.target.value)}
              value={firstGear}
            />

            <FloatingInput
              id="spread-factor"
              label="Spread Factor"
              type="number"
              required
              className="mb-4"
              error={errors.spreadFactor}
              onChange={(e) => setSpreadFactor(e.target.value)}
              value={spreadFactor}
            />

            <FloatingInput
              id="final-drive"
              label="Final Drive Ratio"
              type="number"
              required
              className="mb-4"
              error={errors.finalDrive}
              onChange={(e) => setFinalDrive(e.target.value)}
              value={finalDrive}
            />

            <FloatingInput
              id="rpm"
              label="Maximum RPM"
              type="number"
              required
              className="mb-4"
              error={errors.rpm}
              onChange={(e) => setRpm(e.target.value)}
              value={rpm}
            />

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
          </motion.div>

          <Button3D type="submit" color="red" className="w-full">
            Calculate Gear Ratios
          </Button3D>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Trophy, Calendar, BarChart3, LogOut, Edit } from "lucide-react"
import { Button3D } from "@/components/ui/button-3d"
import { FloatingInput } from "@/components/ui/floating-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedText } from "@/components/ui/animated-text"
import { RotatingCard } from "@/components/ui/rotating-card"
import { Spotlight } from "@/components/ui/spotlight"
import { cn } from "@/lib/utils"

interface UserProfileProps {
  user: {
    name: string
    email: string
    avatar?: string
    joinDate: string
    totalRaces: number
    bestTime: string
    favoriteTrack: string
  }
  onLogout?: () => void
  className?: string
}

export function UserProfile({ user, onLogout, className }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving profile:", { name, email })
    setIsEditing(false)
  }

  const stats = [
    { label: "Total Races", value: user.totalRaces, icon: <Trophy className="h-5 w-5" /> },
    { label: "Best Quarter Mile", value: user.bestTime, icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Favorite Track", value: user.favoriteTrack, icon: <Calendar className="h-5 w-5" /> },
  ]

  return (
    <Spotlight className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
          <CardHeader className="text-center">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.avatar ? (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                  <Edit className="h-3 w-3" />
                </button>
              </div>
            </motion.div>

            <AnimatedText
              text={`Welcome, ${user.name.split(" ")[0]}!`}
              className="text-2xl font-bold text-white"
              highlightWords={[user.name.split(" ")[0] + "!"]}
            />

            <motion.p
              className="text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Member since {user.joinDate}
            </motion.p>
          </CardHeader>

          <CardContent className="space-y-4">
            {isEditing ? (
              <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <FloatingInput
                  id="profile-name"
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FloatingInput
                  id="profile-email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button3D color="red" onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button3D>
                  <Button3D color="red" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancel
                  </Button3D>
                </div>
              </motion.div>
            ) : (
              <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-white">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
                <Button3D color="red" onClick={() => setIsEditing(true)} className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button3D>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
              <span>Racing Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-red-600">{stat.icon}</div>
                    <span className="text-gray-400">{stat.label}</span>
                  </div>
                  <span className="text-white font-semibold">{stat.value}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="md:col-span-2">
          <RotatingCard
            front={
              <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                <Settings className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Quick Actions</h3>
                <p className="text-gray-400">Click to see available actions</p>
              </div>
            }
            back={
              <div className="p-6 h-full flex flex-col justify-center space-y-4">
                <Button3D color="red" className="w-full">
                  <Trophy className="mr-2 h-4 w-4" />
                  View Race History
                </Button3D>
                <Button3D color="red" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button3D>
                <Button3D color="red" className="w-full" onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button3D>
              </div>
            }
          />
        </div>
      </div>
    </Spotlight>
  )
}
